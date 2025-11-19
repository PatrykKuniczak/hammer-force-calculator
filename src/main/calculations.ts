import { roundTo3, validateInputsPositivity, ValidationError } from './util';

/**
 * @param armLength (m)
 * @param handleToHammerHeadLength (m)
 * @param hammerHeadHeight (m)
 * @returns Total Arm Length (m)
 */
export const calculateTotalArmLength = (
  armLength: number,
  handleToHammerHeadLength: number,
  hammerHeadHeight: number,
) => {
  validateInputsPositivity({ armLength, handleToHammerHeadLength, hammerHeadHeight });
  return roundTo3(armLength + handleToHammerHeadLength + hammerHeadHeight / 2);
};

/**
 * @param roadLength (m)
 * @param travelTime (s)
 * @returns Velocity (m/s)
 */
export const calculateVelocity = (roadLength: number, travelTime: number) => {
  validateInputsPositivity({ roadLength, travelTime });
  return roundTo3(roadLength / travelTime);
};

/**
 * @param hammerWeight (kg)
 * @param armWeight (kg)
 * @returns Sum of Masses (kg)
 */
export const calculateTotalMass = (hammerWeight: number, armWeight: number) => {
  validateInputsPositivity({ hammerWeight, armWeight });
  return roundTo3(hammerWeight + armWeight);
};

/**
 * @param totalMass (kg)
 * @param velocity (m/s)
 * @returns Kinetic Energy (J)
 */
export const calculateKineticEnergy = (totalMass: number, velocity: number) => {
  validateInputsPositivity({ totalMass, velocity });
  return roundTo3(0.5 * totalMass * velocity ** 2);
};

/**
 * Calculates cross-sectional area of the nail shaft (cylindrical part).
 * @param diameter - Diameter of the shaft (m).
 * @returns Cross-sectional area (m²).
 */
export const calculateNailShaftCrossSection = (diameter: number) => {
  validateInputsPositivity({ diameter });
  return Math.PI * (diameter / 2) ** 2;
};

/**
 * Calculates average cross-sectional area of the conical tip based on cone length and angle.
 * Uses geometry: average radius = (base radius + radius at cone length) / 2,
 * radius at cone length derived from tan(coneAngle / 2) * coneLength.
 * @param diameter - Base diameter of the cone (m).
 * @param coneLength - Length of cone (m).
 * @param coneAngleDeg - Full apex angle of cone (deg).
 * @returns Average area of the cone cross-section (m²).
 */
export const calculateConeCrossSectionAvg = (diameter: number, coneLength: number, coneAngleDeg: number) => {
  if (coneAngleDeg < 0) throw new ValidationError('coneAngleDeg', coneAngleDeg, 'Cone angle must be positive.');
  validateInputsPositivity({ diameter, coneLength });
  const baseRadius = diameter / 2;
  const halfConeAngleRad = ((coneAngleDeg / 2) * Math.PI) / 180;
  const rTip = baseRadius - coneLength * Math.tan(halfConeAngleRad);
  const avgRadius = (baseRadius + rTip) / 2;
  return Math.PI * avgRadius ** 2;
};

/**
 * Calculates friction force required to overcome resistance,
 * considering a shaft and conical tip with user-defined length and cone angle,
 * and with steel friction coefficient included.
 * @param diameter - Shaft diameter (m).
 * @param materialHardness - Hardness of the material being penetrated (Pa).
 * @param nailLength - Total nail length (m).
 * @param coneLength - Length of conical tip (m).
 * @param coneAngleDeg - Apex angle of cone (deg).
 * @param nailFrictionCoefficient - Steel friction coefficient (e.g., 0.4).
 * @returns Total frictional force (N).
 */
export const calculateFrictionForce = (
  diameter: number,
  materialHardness: number,
  nailLength: number,
  coneLength: number,
  coneAngleDeg: number,
  nailFrictionCoefficient = 0.4,
) => {
  if (coneAngleDeg < 0) throw new ValidationError('coneAngleDeg', coneAngleDeg, 'Cone angle must be positive.');
  validateInputsPositivity({ diameter, materialHardness, nailLength, coneLength, nailFrictionCoefficient });
  const shaftLength = nailLength - coneLength;
  const shaftArea = calculateNailShaftCrossSection(diameter);
  const coneAreaAvg = calculateConeCrossSectionAvg(diameter, coneLength, coneAngleDeg);

  const frictionShaft = shaftArea * materialHardness * shaftLength;
  const frictionCone = coneAreaAvg * materialHardness * coneLength;

  const totalNormalForce = frictionShaft + frictionCone;
  return totalNormalForce * nailFrictionCoefficient;
};

/**
 * Calculates maximum penetration depth based on hammer kinetic energy and friction force.
 * @param kineticEnergy - Kinetic energy available (J).
 * @param frictionForce - Friction force resisting penetration (N).
 * @returns Maximum penetration depth (m).
 */
export const calculateMaxPenetrationDepth = (kineticEnergy: number, frictionForce: number) => {
  validateInputsPositivity({ kineticEnergy, frictionForce });
  return roundTo3(kineticEnergy / frictionForce);
};

/**
 * Calculates percentage of nail penetrated given max penetration depth and material length.
 * Returns capped percentage relative to material length.
 * @param maxPenetrationDepth - Maximum penetration depth (m).
 * @param materialHeight - Length of material being penetrated (m).
 * @returns Penetration as percentage of material length.
 */
export const calculatePenetrationPercentage = (maxPenetrationDepth: number, materialHeight: number) => {
  validateInputsPositivity({ maxPenetrationDepth, materialHeight });
  return roundTo3((maxPenetrationDepth / materialHeight) * 100);
};

/**
 * Aggregates full calculation pipeline to get penetration percentage
 * directly from SI inputs.
 */
export const computePenetrationPercentageFromSI = (data: {
  armLength: number;
  handleToHammerHeadLength: number;
  hammerHeadHeight: number;
  travelTime: number;
  hammerWeight: number;
  armWeight: number;
  diameter: number;
  nailLength: number;
  coneLength: number;
  coneAngleDeg: number;
  materialHardness: number;
  materialHeight: number;
  nailFrictionCoefficient: number;
}) => {
  const totalArmLength = calculateTotalArmLength(data.armLength, data.handleToHammerHeadLength, data.hammerHeadHeight);
  const velocity = calculateVelocity(totalArmLength, data.travelTime);
  const totalMass = calculateTotalMass(data.hammerWeight, data.armWeight);
  const kineticEnergy = calculateKineticEnergy(totalMass, velocity);
  const frictionForce = calculateFrictionForce(
    data.diameter,
    data.materialHardness,
    data.nailLength,
    data.coneLength,
    data.coneAngleDeg,
    data.nailFrictionCoefficient,
  );

  const maxDepth = calculateMaxPenetrationDepth(kineticEnergy, frictionForce);
  return calculatePenetrationPercentage(maxDepth, data.materialHeight);
};
