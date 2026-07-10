export type RatingInput = {
  fodmapScore: number;
  symptomSafetyScore: number;
};

export function averageRating<T extends RatingInput>(
  ratings: T[],
  field: keyof RatingInput,
): number | null {
  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating[field], 0);
  return Math.round((total / ratings.length) * 10) / 10;
}

export function summarizeRestaurant<T extends RatingInput>(ratings: T[]) {
  return {
    avgFodmapScore: averageRating(ratings, "fodmapScore"),
    avgSymptomSafetyScore: averageRating(ratings, "symptomSafetyScore"),
    ratingCount: ratings.length,
  };
}
