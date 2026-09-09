"""Read public Ministry pages. Writes a review snapshot, never auto-publishes access claims.
Run: PYTHONPATH=work/python-deps python3 scripts/refresh-tourism-inventory.py
Dependency: beautifulsoup4. Keep full scraped prose only in ignored work/.
"""
import concurrent.futures,json,re,pathlib,urllib.request,urllib.parse,hashlib,time
from bs4 import BeautifulSoup
ROOT='https://eskisehir.ktb.gov.tr'
OUT=pathlib.Path('work/tourism-source-review');OUT.mkdir(parents=True,exist_ok=True)

def read(url):
 key=hashlib.sha256(url.encode()).hexdigest()[:16];p=OUT/(key+'.html')
 if p.exists():raw=p.read_bytes()
 else:
  req=urllib.request.Request(url,headers={'User-Agent':'ETAHB tourism source inventory/1.0'})
  raw=urllib.request.urlopen(req,timeout=30).read(3_000_000);p.write_bytes(raw)
 soup=BeautifulSoup(raw,'html.parser');content=soup.select_one('.inner_mid_left') or soup.select_one('.content')
 if content is None:return None
 body=content
 for tag in body.select('script,style,.breadcrumb,.in_sec_nrd'):tag.decompose()
 title=soup.select_one('#bbaslik1') or soup.select_one('.content h1') or soup.find('title')
 title=title.get_text(' ',strip=True).split(' - ')[0] if title else ''
 links=[]
 for a in body.select('a[href]'):
  href=urllib.parse.urljoin(url,a['href']);name=a.get_text(' ',strip=True)
  if urllib.parse.urlparse(href).hostname=='eskisehir.ktb.gov.tr' and '/TR-' in href and href.endswith('.html') and name:links.append({'name':name,'url':href})
 return {'url':url,'title':title,'text':body.get_text(' ',strip=True),'links':links,'checkedAt':'2026-09-09'}
seeds=[ROOT+'/TR-336883/gezilecek-yerler.html',ROOT+'/TR-436407/kultur-envanteri.html',ROOT+'/TR-70880/korunan-alanlar.html',ROOT+'/TR-339300/muzelerimiz.html']
seen=set();records=[];queue=[(u,None,0) for u in seeds]
while queue:
 batch=queue[:8];queue=queue[8:]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  future={pool.submit(read,u):(u,region,depth) for u,region,depth in batch if u not in seen}
  for f in concurrent.futures.as_completed(future):
   u,region,depth=future[f];seen.add(u)
   try:r=f.result()
   except Exception as e:print('source unavailable',u,type(e).__name__,flush=True);continue
   if not r:continue
   r['region']=region;r['depth']=depth;records.append(r)
   if depth<2 and len(seen)+len(queue)<220:
    for a in r['links']:
     if a['url'] not in seen and all(a['url']!=v[0] for v in queue):queue.append((a['url'],a['name'] if depth==0 else region,depth+1))
  (OUT/'snapshot.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 print('sources',len(records),'queued',len(queue),flush=True)
print('completed',len(records),flush=True)
