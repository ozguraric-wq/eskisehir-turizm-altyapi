export type Locale = "tr" | "en" | "de" | "fr" | "ar";
export type Localized = Record<Locale, string>;
export const text = (tr: string, en: string, de: string, fr: string, ar: string): Localized => ({ tr, en, de, fr, ar });
export type Mode = "walk" | "transit" | "car" | "bicycle" | "motorcycle";
export type Interest = "heritage" | "nature" | "craft" | "taste" | "faith" | "city";
export type Zone = "center" | "oldtown" | "sazova" | "kentpark" | "river" | "seyit" | "doganli" | "midas" | "han" | "sivri" | "cifteler" | "yunus" | "gurleyik" | "inonu";
export type Pace = "relaxed" | "balanced" | "full";
export type MealStyle = "local" | "vegetarian" | "picnic";
export type Weather = "outdoors" | "indoors";
export type VisitNote = "hours" | "worship" | "uneven" | "water" | "pedestrian";
export interface Place {
  id: string; name: string; zone: Zone; district: string;
  summary: Localized; interests: Interest[]; minutes: number; walking: number;
  indoor: boolean; family: boolean; lowWalk: boolean; paid: boolean;
  note: VisitNote; source: string; status: "existing";
  /** Planning assumptions, NOT live opening hours. */
  window: [number, number];
  /** Conservative known regular closing day, 0=Sun. Empty means unverified, not open. */
  closedDays?: number[];
}
export interface FoodArea { zone: Zone; name: string; local: Localized; vegetarian: Localized; source: string; }
export interface RouteTheme { id: string; name: Localized; stops: string[]; interests: Interest[]; }
export interface Preferences {
  days: number; start: number; end: number; mode: Mode; pace: Pace;
  interests: Interest[]; origin: Zone; meal: MealStyle; family: boolean;
  lowWalk: boolean; weather: Weather; freeOnly: boolean; date: string;
  excluded: string[]; focus: string; alternatives: number;
}
export interface Leg { from: string; to: string; km: number; minutes: number; rest: number; }
export interface ScheduleItem {
  kind: "visit" | "meal" | "return"; id: string; zone: Zone;
  start: number; end: number; leg: Leg; wait: number;
}
export interface DayPlan {
  date: string; theme: string; items: ScheduleItem[]; placeIds: string[];
  km: number; travel: number; walking: number; finish: number; score: number;
}
export interface Plan { id: string; days: DayPlan[]; score: number; covered: Interest[]; }
export interface PlanningResult { plans: Plan[]; eligible: number; evaluated: number; requestedDays: number; }
