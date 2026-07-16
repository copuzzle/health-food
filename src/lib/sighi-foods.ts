import sighiFoodJson from "../../data/sighi-foods.json";

export type SighiScore = "0" | "1" | "2" | "3" | "?";

export type SighiFoodItem = {
  id: string;
  page: number;
  score: SighiScore;
  h: string;
  a: string;
  l: string;
  b: string;
  ingredientEn: string;
  ingredientZh: string;
  remarksEn: string;
  remarksZh: string;
  categoryKey: string;
  categoryEn: string;
  categoryZh: string;
};

export type SighiCategory = {
  key: string;
  en: string;
  zh: string;
  count: number;
  scoreCounts: Record<SighiScore, number>;
};

export type SighiQualityReport = {
  rawRows: number;
  rawItems: number;
  usableItems: number;
  categories: number;
  skippedRows: number;
  categoryCorrections: number;
  sourceFile: string;
  sourceUpdated: string;
};

export type SighiFoodMetadata = {
  name: string;
  generated: string;
  sourceUpdated: string;
  sourceFiles: string[];
  note: string;
};

export type SighiFoodData = {
  metadata: SighiFoodMetadata;
  items: SighiFoodItem[];
  categories: SighiCategory[];
  quality: SighiQualityReport;
};

const sighiFoodData = sighiFoodJson as SighiFoodData;

export function getSighiFoodData(): SighiFoodData {
  return sighiFoodData;
}
