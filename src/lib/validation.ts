import { z } from "zod";
import { FOODMAP_TAGS } from "@/lib/constants";

const score = z.coerce.number().int().min(1).max(5);
const severity = z.coerce.number().int().min(1).max(5);

export const sessionSchema = z.object({
  mode: z.enum(["login", "register"]).default("login"),
  email: z.string().email().max(120),
  password: z.string().min(8).max(120),
  name: z.string().trim().max(60).optional().nullable(),
});

export const restaurantSchema = z.object({
  name: z.string().trim().min(2).max(80),
  address: z.string().trim().min(4).max(160),
  city: z.string().trim().min(2).max(40),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tags: z.array(z.enum(FOODMAP_TAGS)).min(1).max(6),
});

export const ratingSchema = z.object({
  fodmapScore: score,
  symptomSafetyScore: score,
  comment: z.string().trim().max(400).optional().nullable(),
});

export const foodLogSchema = z.object({
  mealTime: z.coerce.date(),
  foods: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  notes: z.string().trim().max(600).optional().nullable(),
  symptoms: z
    .array(
      z.object({
        symptomType: z.string().trim().min(1).max(20),
        severity,
        occurredAt: z.coerce.date(),
        notes: z.string().trim().max(300).optional().nullable(),
      }),
    )
    .max(3)
    .default([]),
});

export const dailyLogSchema = z.object({
  date: z.coerce.date(),
  breakfast: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  lunch: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  dinner: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  notes: z.string().trim().max(600).optional().nullable(),
  symptoms: z
    .array(
      z.object({
        symptomType: z.string().trim().min(1).max(20),
        severity,
      }),
    )
    .max(3)
    .default([]),
}).refine((value) => value.breakfast.length + value.lunch.length + value.dinner.length > 0, {
  message: "At least one meal must contain food",
  path: ["breakfast"],
});

export const symptomPreferencesSchema = z.object({
  symptoms: z
    .array(z.string().trim().min(1).max(20))
    .max(3)
    .transform((items) => Array.from(new Set(items))),
});

export function parseCommaList(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
