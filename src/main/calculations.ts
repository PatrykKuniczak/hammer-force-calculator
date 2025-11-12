/**
 * @param value - e.g `100`
 * @param fromUnit - e.g `cm`
 * @param toUnit - e.g `m`
 * @returns Converted value e.g. `1`
 */
const toSIConverter = (value: number, fromUnit: string, toUnit: string) => {
  switch (fromUnit) {
    case 'cm':
      switch (toUnit) {
        case 'm':
          return value / 100;
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
