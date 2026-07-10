export const FOODMAP_TAGS = [
  "低FODMAP",
  "可无洋葱蒜",
  "可无乳糖",
  "可无麸质",
  "清淡",
  "需提前沟通",
] as const;

export const DEFAULT_SYMPTOM_TYPES = ["腹泻", "腹痛", "胀气"] as const;

export const HEALTH_DISCLAIMER =
  "本产品仅用于个人记录和社区信息整理，不提供诊断、治疗或医疗建议。严重或持续症状请咨询医生或注册营养师。";

export type RestaurantSummary = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  tags: string[];
  avgFodmapScore: number | null;
  avgSymptomSafetyScore: number | null;
  ratingCount: number;
};
