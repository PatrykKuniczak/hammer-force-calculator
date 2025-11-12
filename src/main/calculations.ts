/**
 * @param value - e.g `100`
 * @param fromUnit - e.g `cm`
 * @param toUnit - e.g `m`
 * @returns Converted value e.g. `1`
 */
const toSIConverter = (value: number, fromUnit: string, toUnit: string) => {
  switch (fromUnit) {
    case 'mm':
      switch (toUnit) {
        case 'm':
          return value / 1000;
        default:
          throw new Error(`Invalid toUnit ${toUnit}`);
      }
    case 'cm':
      switch (toUnit) {
        case 'm':
          return value / 100;
        default:
          throw new Error(`Invalid toUnit ${toUnit}`);
      }
    case 'm':
      switch (toUnit) {
        case 'cm':
          return value * 100;
        default:
          throw new Error(`Invalid toUnit ${toUnit}`);
      }
    case 'MPa':
      switch (toUnit) {
        case 'Pa':
          return value * 1_000_000;
        default:
          throw new Error(`Invalid toUnit ${toUnit}`);
      }
    default:
      throw new Error(`Invalid fromUnit ${fromUnit}`);
  }
};

/**
 * @param armLength (m)
 * @param handleToHammerHeadLength (m)
 * @param hammerHeadHeight (m)
 * @returns Total Arm Length (m)
 */
const calculateTotalArmLength = (armLength: number, handleToHammerHeadLength: number, hammerHeadHeight: number) =>
  armLength + handleToHammerHeadLength + hammerHeadHeight / 2;

/**
 * @param roadLength (m)
 * @param travelTime (s)
 * @returns Velocity (m/s)
 */
const calculateVelocity = (roadLength: number, travelTime: number) => roadLength / travelTime;

/**
 * @param hammerWeight (kg)
 * @param armWeight (kg)
 * @returns Sum of Masses (kg)
 */
const calculateTotalMass = (hammerWeight: number, armWeight: number) => hammerWeight + armWeight;

/**
 * @param totalMass (kg)
 * @param velocity (m/s)
 * @returns Kinetic Energy (J)
 */
const calculateKineticEnergy = (totalMass: number, velocity: number) => 0.5 * totalMass * velocity ** 2;

/**
 * Calculates cross-sectional area of the nail shaft (cylindrical part).
 * @param diameter - Diameter of the shaft (m).
 * @returns Cross-sectional area (m²).
 */
const calculateNailShaftCrossSection = (diameter: number) => Math.PI * (diameter / 2) ** 2;

/**
 * Calculates average cross-sectional area of the conical tip based on cone length and angle.
 * Uses geometry: average radius = (base radius + radius at cone length) / 2,
 * radius at cone length derived from tan(coneAngle / 2) * coneLength.
 * @param diameter - Base diameter of the cone (m).
 * @param coneLength - Length of cone (m).
 * @param coneAngleDeg - Full apex angle of cone (deg).
 * @returns Average area of the cone cross-section (m²).
 */
const calculateConeCrossSectionAvg = (diameter: number, coneLength: number, coneAngleDeg: number) => {
  const baseRadius = diameter / 2;
  const coneAngleRad = (coneAngleDeg * Math.PI) / 180;
  const halfConeAngle = coneAngleRad / 2;
  const rTip = baseRadius - coneLength * Math.tan(halfConeAngle);
  const avgRadius = (baseRadius + Math.max(rTip, 0)) / 2; // Radius can't be negative
  return Math.PI * avgRadius ** 2;
};

/**
 * Calculates friction force required to overcome resistance,
 * considering a shaft and conical tip with user-defined length and cone angle.
 * @param diameter - Shaft diameter (m).
 * @param hardness - Material hardness (Pa).
 * @param nailLength - Total nail length (m).
 * @param coneLength - Length of conical tip (m).
 * @param coneAngleDeg - Apex angle of cone (deg).
 * @returns Total frictional force (N).
 */
const calculateFrictionForce = (
  diameter: number,
  hardness: number,
  nailLength: number,
  coneLength: number,
  coneAngleDeg: number,
) => {
  const shaftLength = nailLength - coneLength;
  const shaftArea = calculateNailShaftCrossSection(diameter);
  const coneAreaAvg = calculateConeCrossSectionAvg(diameter, coneLength, coneAngleDeg);

  const frictionShaft = shaftArea * hardness * shaftLength;
  const frictionCone = coneAreaAvg * hardness * coneLength;

  return frictionShaft + frictionCone;
};

/**
 * Calculates maximum penetration depth based on hammer kinetic energy and friction force.
 * @param kineticEnergy - Kinetic energy available (J).
 * @param frictionForce - Friction force resisting penetration (N).
 * @returns Maximum penetration depth (m).
 */
const calculateMaxPenetrationDepth = (kineticEnergy: number, frictionForce: number) => kineticEnergy / frictionForce;

/**
 * Calculates percentage of nail penetrated given penetration depth and nail length.
 * This value can exceed 100% if penetration depth is greater than nail length.
 * @param penetrationDepth - Depth of penetration (m).
 * @param nailLength - Total nail length (m).
 * @returns Penetration as percentage of nail length (0 and above).
 */
const calculatePenetrationPercentage = (penetrationDepth: number, nailLength: number) =>
  (penetrationDepth / nailLength) * 100;
