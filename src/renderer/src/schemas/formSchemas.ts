import { z } from 'zod';

export const hammerFormSchema = z.object({
  armLength: z.number().positive('Długość ramienia musi być dodatnia').max(200, 'Za duża wartość (cm)'),
  handleToHammerHeadLength: z.number().positive('Długość rękojeści musi być dodatnia').max(50, 'Za duża wartość (cm)'),
  hammerHeadHeight: z
    .number()
    .positive('Wysokość głowicy musi być dodatnia')
    .min(2, 'Wysokość głowicy musi mieć co najmniej 2 cm')
    .max(30, 'Podejrzanie duża wysokość (cm)'),
  travelTime: z.number().positive('Czas musi być dodatni').max(5, 'Czas nie może przekraczać 5 s'),
  hammerWeight: z.number().positive('Masa młotka musi być dodatnia').max(100, 'Nieprawdopodobnie duża masa (kg)'),
  armWeight: z.number().positive('Masa ramienia musi być dodatnia').max(200, 'Nieprawdopodobnie duża masa (kg)'),
});

export const materialNailFormSchema = z.object({
  diameter: z.number().positive('Średnica musi być dodatnia').max(50, 'Za duża średnica (mm)'),
  nailLength: z.number().positive('Długość gwoździa musi być dodatnia').max(100, 'Za duża długość (cm)'),
  coneLength: z.number().positive('Długość stożka musi być dodatnia').max(100, 'Za duża długość stożka (cm)'),
  coneAngleDeg: z.number().min(0, 'Kąt nie może być ujemny').max(180, 'Kąt nie może przekraczać 180°'),
  materialHardness: z
    .number()
    .positive('Twardość materiału musi być dodatnia')
    .max(100000, 'Podejrzanie duża wartość (MPa)'),
  materialHeight: z.number().positive('Wysokość materiału musi być dodatnia').max(1000, 'Za duża wysokość (cm)'),
  nailFrictionCoefficient: z
    .number()
    .min(0, 'Współczynnik nie może być ujemny')
    .max(1, 'Współczynnik nie może przekraczać 1'),
});

export const combinedFormSchema = hammerFormSchema.and(materialNailFormSchema).superRefine((vals, ctx) => {
  const { coneLength, nailLength } = vals;
  if (typeof coneLength === 'number' && typeof nailLength === 'number') {
    const maxCone = 0.2 * nailLength;
    if (coneLength > maxCone) {
      ctx.addIssue({
        code: 'custom',
        path: ['coneLength'],
        message: 'Długość stożka nie może przekraczać 20% długości gwoździa',
      });
    }
  }
});

export type CombinedFormValuesType = z.infer<typeof combinedFormSchema>;
