import { buses, TRANSIT_CHECKED_ON, TRAM_SOURCE, type BusRecord } from "./transit-data";
import { urbanZones } from "./data";
import type { District, Leg, TransitRide, Zone } from "./types";

// Stop order and terminal times are sourced. Access, running times and distances
// below are conservative editorial estimates, not official stop coordinates/ETAs.
type Anchor = { id: string; name: string; offset: number; km: number };
type Service = { id: string; line: string; vehicle: "bus" | "tram"; anchors: Anchor[]; source: string; updated: string; bus?: BusRecord; direction?: number; first?: number; last?: number; frequency?: (time: number, weekend: boolean) => number };
const a = (id: string, name: string, offset: number, km: number): Anchor => ({ id, name, offset, km });
const busById = Object.fromEntries(buses.map(b => [b.id, b]));
const services: Service[] = [];
export function busLabel(record: BusRecord) { return record.number === "OtobEs26" || record.number.includes("Kırmızı") ? record.number : `${record.number} · Siyah`; }
function bus(id: number, paths: Anchor[][]) {
  const record = busById[id];
  paths.forEach((anchors, direction) => services.push({ id: `bus:${id}:${direction}`, line: busLabel(record), vehicle: "bus", anchors, source: record.source, updated: record.updated, bus: record, direction }));
}
const rural: [number, number, number][] = [[105,70,42],[106,120,80],[114,115,75],[107,200,145],[108,160,100],[116,90,58],[110,180,125],[111,115,65],[112,90,52],[113,160,110],[135,195,140],[117,165,105]];
for (const [id, minutes, km] of rural) {
  const r = busById[id];
  bus(id, [[a("otogar", "Eskişehir Otogar", 0, 0), a(r.zone, r.directions[1].terminal, minutes, km)], [a(r.zone, r.directions[1].terminal, 0, 0), a("otogar", "Eskişehir Otogar", minutes, km)]]);
}
bus(85, [[a("ssk-bus", "Yunus Emre Devlet Hastanesi (eski SSK) · otobüs", 0, 0),a("inonu", "İnönü ilçesi",75,45)], [a("inonu", "İnönü ilçesi",0,0),a("ssk-bus", "Yunus Emre Devlet Hastanesi (eski SSK) · otobüs",75,45)]]);
bus(109, [[a("otogar","Eskişehir Otogar",0,0),a("ilica","Sakarı Ilıca Kaplıcaları",75,43),a("mihalgazi","Mihalgazi ilçesi",110,64)], [a("mihalgazi","Mihalgazi ilçesi",0,0),a("ilica","Sakarı Ilıca Kaplıcaları",35,21),a("otogar","Eskişehir Otogar",110,64)]]);
bus(23, [[a("bademlik","Bademlik",0,0),a("bus-oldtown","Alaeddin Caddesi · 5 numaralı durak",15,2),a("bus-sazova","Sazova Mahallesi",60,13)], [a("bus-sazova","Sazova Mahallesi",0,0),a("bus-oldtown","Atatürk Bulvarı · 17 numaralı durak",45,11),a("bademlik","Bademlik",60,13)]]);
bus(26, [[a("otogar","Eskişehir Otogar",0,0),a("bus-oldtown","Odunpazarı · otobüs güzergâhı",30,7),a("nabi","Prof. Dr. Nabi Avcı Bulvarı",55,12)], [a("nabi","Prof. Dr. Nabi Avcı Bulvarı",0,0),a("bus-oldtown","Odunpazarı · otobüs güzergâhı",25,5),a("otogar","Eskişehir Otogar",55,12)]]);
bus(49, [[a("otogar","Eskişehir Otogar",0,0),a("ssk-bus","Yunus Emre Devlet Hastanesi (eski SSK) · otobüs",85,18)], [a("ssk-bus","Yunus Emre Devlet Hastanesi (eski SSK) · otobüs",0,0),a("otogar","Eskişehir Otogar",85,18)]]);
bus(156, [[a("otogar","Eskişehir Otogar",0,0),a("kentpark","Kentpark",5,1),a("tour-oldtown","Odunpazarı Evleri",25,6),a("sazova","Sazova Parkı",65,15),a("tour-gar","Tren Garı",80,20),a("otogar","Eskişehir Otogar",115,27)], [a("otogar","Eskişehir Otogar",0,0),a("kentpark","Kentpark",5,1),a("tour-gar","Tren Garı",35,8),a("sazova","Sazova Parkı",50,13),a("tour-oldtown","Odunpazarı Evleri",90,22),a("otogar","Eskişehir Otogar",115,28)]]);
function tram(line: string, anchors: Anchor[], first: number[], last: number[], frequency: Service["frequency"]) {
  const end = anchors.at(-1)!;
  [anchors, [...anchors].reverse().map(x => ({ ...x, offset: end.offset - x.offset, km: end.km - x.km }))].forEach((path, direction) => services.push({ id: `tram:${line}:${direction}`, line, vehicle: "tram", anchors: path, first: first[direction], last: last[direction], frequency, source: TRAM_SOURCE, updated: "2026-06-26" }));
}
// ESTRAM published frequencies, effective 26 June 2026. The July 24 notice
// applies the Sunday service on Saturdays; the current charts combine Sat/Sun.
tram("1", [a("otogar","Otogar · tramvay",0,0),a("kentpark","Kent Park · tramvay",3,.8),a("belediye","Belediye · tramvay",15,4),a("center","İsmet İnönü · tramvay",22,6),a("ssk-tram","SSK · tramvay",35,10)], [335,370], [1425,1460], (t,w) => t >= 1193 ? 13 : w || t < 631 || t >= 1127 ? 11 : 8);
tram("3", [a("ogu","Osmangazi Üniversitesi · tramvay",0,0),a("river","Büyükdere · tramvay",7,2),a("oldtown","Atatürk Lisesi · tramvay",20,5),a("belediye","Belediye · tramvay",23,6),a("center","İsmet İnönü · tramvay",27,7),a("ssk-tram","SSK · tramvay",40,11)], [355,375], [1425,1430], (t,w) => t >= 1204 ? 13 : w || t < 661 || t >= 1133 ? 11 : 8);
tram("4", [a("otogar","Otogar · tramvay",0,0),a("kentpark","Kent Park · tramvay",3,.8),a("belediye","Belediye · tramvay",15,4),a("oldtown","Atatürk Lisesi · tramvay",18,5),a("river","Büyükdere · tramvay",31,8),a("ogu","Osmangazi Üniversitesi · tramvay",38,10)], [325,322], [1430,1460], (t,w) => w || t < 483 || t >= 1187 ? 22 : 16);

const access: Partial<Record<Zone, [string, number, number][]>> = {
  center: [["center",15,.8],["tour-gar",15,.8]], oldtown: [["oldtown",15,.8],["bus-oldtown",15,.8],["tour-oldtown",10,.5]],
  river: [["river",25,1.5]], sazova: [["sazova",10,.5],["bus-sazova",35,2.2]], kentpark: [["kentpark",10,.5],["otogar",20,1.2]],
};
for (const r of buses.filter(b => !urbanZones.includes(b.zone))) access[r.zone] = [[r.zone,15,.8]];
access.ilica = [["ilica",15,.8]];
export const transitZones = Object.keys(access) as Zone[];
export function serviceGroup(date: string, holiday = false) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return holiday || day === 0 ? "sunday" : day === 6 ? "saturday" : "weekday";
}
export function departures(record: BusRecord, direction: number, date: string, holiday = false): number[] {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(date)) return [];
  const group = serviceGroup(date, holiday), day = new Date(`${date}T12:00:00Z`).getUTCDay();
  // A single DAKİKA column does not prove weekend operation. Only verified
  // weekday runs are used for the three ordinary urban bus lines.
  if (holiday && !record.directions[direction].runs.some(r => r.group === "sunday")) return [];
  return [...new Set(record.directions[direction].runs.filter(r => r.group === group && (!r.condition || r.condition === "fridaySaturday" && !holiday && [5,6].includes(day))).map(r => r.at))].sort((a,b) => a-b);
}
export function transitAvailable(zone: Zone) { return transitZones.includes(zone); }
export function transitDateAge(date: string) { return Math.floor((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${TRANSIT_CHECKED_ON}T12:00:00Z`)) / 86400000); }
export function districtBusRecords(districts: District[]) { return buses.filter(b => !urbanZones.includes(b.zone) && (!districts.length || districts.includes(b.district))); }

export function findTransitLeg(from: string, to: string, origin: Zone, target: Zone, ready: number, date: string, holiday = false): Leg | null {
  if (!date || !access[origin] || !access[target] || origin === target) return null;
  type State = { node: string; time: number; km: number; walkKm: number; walk: number; wait: number; rides: TransitRide[] };
  const queue: State[] = access[origin]!.map(([node,walk,walkKm]) => ({ node, time: ready+walk, km:walkKm, walkKm, walk, wait:0, rides:[] }));
  const best = new Map<string, number>();
  let winner: State | undefined;
  while (queue.length) {
    queue.sort((a,b) => a.time-b.time || a.rides.length-b.rides.length);
    const state = queue.shift()!;
    if (state.time > 1439 || winner && state.time >= winner.time) continue;
    // Retain different boarding counts: an earlier three-ride path cannot erase
    // a later one-ride path that still has transfer capacity.
    const key = `${state.node}:${state.rides.length}`;
    if ((best.get(key) ?? Infinity) <= state.time) continue;
    best.set(key,state.time);
    const arrival = access[target]!.find(([node]) => node===state.node);
    if (arrival && state.rides.length) {
      const final = { ...state,time:state.time+arrival[1],km:state.km+arrival[2],walkKm:state.walkKm+arrival[2],walk:state.walk+arrival[1] };
      if (!winner || final.time<winner.time) winner=final;
    }
    // Different SSK boarding areas are a walking transfer, never instantaneous.
    const transfers: [string,string,number,number][] = [["ssk-tram","ssk-bus",20,1.2],["oldtown","bus-oldtown",10,.5],["oldtown","tour-oldtown",10,.5],["center","tour-gar",15,.8],["sazova","bus-sazova",35,2.2]];
    for (const [a,b,minutes,km] of transfers) {
      const node = state.node === a ? b : state.node === b ? a : "";
      if (node) queue.push({ ...state,node,time:state.time+minutes,km:state.km+km,walkKm:state.walkKm+km,walk:state.walk+minutes });
    }
    if (state.rides.length >= 3) continue;
    for (const service of services) {
      service.anchors.forEach((board,i) => {
        if (board.id !== state.node || i === service.anchors.length-1) return;
        const buffer = service.vehicle === "bus" ? 10 : 5;
        const earliest = state.time + buffer;
        let depart: number, terminalDeparture: number | undefined, headway: number | undefined;
        if (service.bus) {
          terminalDeparture = departures(service.bus, service.direction!, date, holiday).find(t => t+board.offset >= earliest);
          if (terminalDeparture === undefined) return;
          depart = terminalDeparture + board.offset;
        } else {
          const first = service.first! + board.offset, last = service.last! + board.offset;
          if (earliest > last) return;
          headway = service.frequency!(Math.max(earliest-board.offset,service.first!),serviceGroup(date,holiday)!=="weekday");
          // Full headway budget, not a fabricated exact tram departure.
          depart = Math.max(earliest,first) + headway;
          if (depart>last) return;
        }
        for (const alight of service.anchors.slice(i+1)) {
          if (alight.id===board.id) continue;
          const arrive=depart+alight.offset-board.offset;
          const ride: TransitRide = {line:service.line,vehicle:service.vehicle,direction:service.bus?.id===156 ? (service.direction===0 ? "Odunpazarı" : "Tepebaşı") : service.anchors.at(-1)!.name,board:board.name,alight:alight.name,depart,arrive,terminal:service.anchors[0].name,terminalDeparture,estimatedBoard:service.vehicle==="tram" || board.offset!==0,headway,source:service.source,updated:service.updated};
          queue.push({node:alight.id,time:arrive,km:state.km+alight.km-board.km,walkKm:state.walkKm,walk:state.walk,wait:state.wait+depart-state.time,rides:[...state.rides,ride]});
        }
      });
    }
  }
  if (!winner) return null;
  return {from,to,km:Math.round(winner.km*10)/10,minutes:winner.time-ready,rest:0,walkingKm:winner.walkKm,transit:{rides:winner.rides,walkingMinutes:winner.walk,walkingKm:Math.round(winner.walkKm*10)/10,waitingMinutes:winner.wait}};
}
export function transitMapUrl(ride: TransitRide) {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({api:"1",origin:`${ride.board}, Eskişehir, Türkiye`,destination:`${ride.alight}, Eskişehir, Türkiye`,travelmode:"transit"})}`;
}
