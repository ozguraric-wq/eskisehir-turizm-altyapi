#!/usr/bin/env python3
"""Refresh the reviewed EBB timetable snapshot. Run tests and review diff before publishing.
Usage: python scripts/refresh-transit.py [--cache-dir PATH]
A cache directory allows deterministic parser checks without network calls.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import argparse, html, json, re
ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'lib/routing/transit-data.ts'
CLEAN = lambda value: ' '.join(html.unescape(re.sub('<[^>]+>', ' ', value)).split())

def parse(page, record):
    parts = page.split('HAT NOTLARI', 1)
    if len(parts) != 2:
        raise ValueError(f'No notes section for line {record["id"]}')
    body = parts[1]
    notes = [CLEAN(x) for x in re.findall(r'<strong>(.*?)</strong>', body.split('</table>', 1)[0], re.S)]
    tables = re.findall(r'<table[^>]+class=[\'"]tableee_saat[\'"][^>]*>(.*?)</table>', body, re.S)
    if len(tables) != 2:
        raise ValueError(f'Expected two timetable directions for line {record["id"]}')
    directions = []
    for table in tables:
        heads = [CLEAN(x) for x in re.findall(r'<th\b[^>]*>(.*?)</th>', table, re.S)]
        if heads and heads[0] == 'SAAT' and record['id'] == 156:
            heads.insert(0, 'OTOGAR')
        if len(heads) < 3 or heads[1] != 'SAAT' or heads[2] != 'DAKİKA':
            raise ValueError(f'Unexpected columns for line {record["id"]}: {heads}')
        runs = []
        for row in re.split('<tr[^>]*>', table)[1:]:
            cells = re.findall(r'<td\b[^>]*>(.*?)</td>', row, re.S)
            if not cells or not re.fullmatch(r'\d\d', CLEAN(cells[0])):
                continue
            hour = int(CLEAN(cells[0]))
            for col, cell in enumerate(cells[1:]):
                if col + 2 >= len(heads):
                    raise ValueError('Unexpected timetable width')
                label = heads[col + 2]
                group = 'saturday' if label == 'CUMARTESİ' else 'sunday' if 'PAZAR' in label else 'weekday'
                for attrs, value in re.findall(r'<span\b([^>]*)>(.*?)</span>', cell, re.S):
                    if not re.fullmatch(r'\d{1,2}', CLEAN(value)):
                        raise ValueError('Unexpected departure annotation')
                    minute = int(CLEAN(value))
                    if not 0 <= hour <= 23 or not 0 <= minute <= 59:
                        raise ValueError('Invalid departure time')
                    color = re.search(r'color:\s*(#[0-9a-fA-F]{6})', attrs)
                    color = color[1].lower() if color else ''
                    condition = '' if color in ['', '#000000'] else 'unverified'
                    if record['id'] == 109 and color == '#00cc33' and any('CUMA VE CUMARTESİ' in n for n in notes):
                        condition = 'fridaySaturday'
                    run = {'at': hour * 60 + minute, 'group': group, 'condition': condition}
                    if run not in runs:
                        runs.append(run)
        directions.append({'terminal': heads[0], 'runs': runs})
    routes = [CLEAN(x).strip(' *').split(' * ') for x in re.findall(r"<p style='margin-left:5px;'>(.*?)</p>", body, re.S)]
    if len(routes) != 2 or any(len(r) < 2 for r in routes):
        raise ValueError('Unexpected route geometry/order')
    date = next((re.search(r'(\d{2})\.(\d{2})\.(\d{4})', n) for n in notes if 'GÜNCELLEME' in n), None)
    updated = f'{date[3]}-{date[2]}-{date[1]}' if date else ''
    return {**record, 'updated': updated, 'directions': directions, 'routes': routes, 'notes': notes}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache-dir', type=Path)
    args = parser.parse_args()
    source = TARGET.read_text()
    header, payload = source.split('export const buses: BusRecord[] = ', 1)
    records = json.loads(payload.strip().removesuffix(';'))
    def get(record):
        if args.cache_dir:
            page = (args.cache_dir / f'bus-{record["id"]}.html').read_text()
        else:
            with urlopen(Request(record['source'], headers={'User-Agent': 'ETAHB-timetable-research/1.0'}), timeout=30) as response:
                page = response.read().decode(response.headers.get_content_charset() or 'windows-1254')
        return parse(page, record)
    # Validate all responses before making one atomic source replacement.
    with ThreadPoolExecutor(max_workers=3) as pool:
        result = list(pool.map(get, records))
    if not args.cache_dir:
        checked = datetime.now(timezone.utc).date().isoformat()
        header = re.sub(r'(TRANSIT_CHECKED_ON = ")[^"]+', r'\g<1>' + checked, header)
        header = re.sub(r'retrieved \d{4}-\d{2}-\d{2}', 'retrieved ' + checked, header)
    output = header + 'export const buses: BusRecord[] = ' + json.dumps(result, ensure_ascii=False, indent=2) + ';\n'
    temp = TARGET.with_suffix('.ts.tmp')
    temp.write_text(output)
    temp.replace(TARGET)
    print(f'Validated {len(result)} bus records. Review changes and run routing tests before publication.')

if __name__ == '__main__':
    main()
