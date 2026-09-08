"use client";
import { RoutePlanner } from "@/components/route-planner";
import type { InternationalLocale } from "@/lib/international";
export function InternationalRoutePlanner({ locale }: { locale: InternationalLocale }) { return <RoutePlanner locale={locale} />; }
