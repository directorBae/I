export const GRAIN_HOLD_MS = 2000;
export const GRAIN_FADE_MS = 1000;

export function grainOpacity(age: number): number {
  if (age < 0) return 0;
  if (age <= GRAIN_HOLD_MS) return 1;
  const progress = Math.min(1, (age - GRAIN_HOLD_MS) / GRAIN_FADE_MS);
  return 1 - progress * progress * (3 - 2 * progress);
}
