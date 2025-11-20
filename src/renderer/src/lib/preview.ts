import type { CombinedFormValuesType as FormValuesType } from '../schemas/formSchemas';

const cmToM = (v?: number) => (typeof v === 'number' && !Number.isNaN(v) ? v / 100 : NaN);
const mmToM = (v?: number) => (typeof v === 'number' && !Number.isNaN(v) ? v / 1000 : NaN);
const MPaToPa = (v?: number) => (typeof v === 'number' && !Number.isNaN(v) ? v * 1_000_000 : NaN);
const degToRad = (deg: number) => (deg * Math.PI) / 180;

export type PreviewValues = {
  totalArmLength: number;
  velocity: number;
  totalMass: number;
  kineticEnergy: number;
  penetrationPercentage: number;
};

export const computePreview = (values: Partial<FormValuesType> | undefined): PreviewValues | null => {
  if (!values) return null;
  try {
    const arm = cmToM(values.armLength);
    const handle = cmToM(values.handleToHammerHeadLength);
    const headH = cmToM(values.hammerHeadHeight);
    const t = typeof values.travelTime === 'number' ? values.travelTime : NaN;
    const mHammer = typeof values.hammerWeight === 'number' ? values.hammerWeight : NaN;
    const mArm = typeof values.armWeight === 'number' ? values.armWeight : NaN;

    if ([arm, handle, headH, t, mHammer, mArm].some(x => !Number.isFinite(x))) return null;

    const totalArmLength = arm + handle + headH / 2;
    const velocity = totalArmLength / t;
    const totalMass = mHammer + mArm;
    const kineticEnergy = 0.5 * totalMass * velocity * velocity;

    const d = mmToM(values.diameter);
    const nailLen = cmToM(values.nailLength);
    const coneLen = cmToM(values.coneLength);
    const coneAngleDeg = typeof values.coneAngleDeg === 'number' ? values.coneAngleDeg : NaN;
    const hardnessPa = MPaToPa(values.materialHardness);
    const materialH = cmToM(values.materialHeight);
    const mu = typeof values.nailFrictionCoefficient === 'number' ? values.nailFrictionCoefficient : NaN;

    let penetrationPercentage = NaN;
    if ([d, nailLen, coneLen, coneAngleDeg, hardnessPa, materialH, mu].every(x => Number.isFinite(x))) {
      const baseRadius = d / 2;
      const rTip = baseRadius - coneLen * Math.tan(degToRad(coneAngleDeg / 2));
      const avgRadius = (baseRadius + rTip) / 2;
      const shaftArea = Math.PI * baseRadius * baseRadius;
      const coneAreaAvg = Math.PI * avgRadius * avgRadius;

      const shaftLength = Math.max(0, nailLen - coneLen);
      const frictionShaft = shaftArea * hardnessPa * shaftLength;
      const frictionCone = coneAreaAvg * hardnessPa * coneLen;
      const totalNormalForce = frictionShaft + frictionCone;
      const frictionForce = totalNormalForce * mu;

      const maxPenetrationDepth = frictionForce > 0 ? kineticEnergy / frictionForce : NaN;
      penetrationPercentage =
        Number.isFinite(materialH) && materialH > 0 ? (maxPenetrationDepth / materialH) * 100 : NaN;
    }

    return {
      totalArmLength,
      velocity,
      totalMass,
      kineticEnergy,
      penetrationPercentage,
    };
  } catch {
    return null;
  }
};
