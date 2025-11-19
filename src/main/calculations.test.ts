import {
  calculateConeCrossSectionAvg,
  calculateFrictionForce,
  calculateKineticEnergy,
  calculateMaxPenetrationDepth,
  calculateNailShaftCrossSection,
  calculatePenetrationPercentage,
  calculateTotalArmLength,
  calculateTotalMass,
  calculateVelocity,
  computePenetrationPercentageFromSI,
} from './calculations';
import { ValidationError } from './util';
import { describe, expect, it } from 'vitest';

describe('calculateTotalArmLength', () => {
  it('sums arm, handle-to-head, and half head height', () => {
    // 0.6 + 0.3 + 0.02 = 0.92 -> truncated to 3 decimals: 0.919
    expect(calculateTotalArmLength(0.6, 0.3, 0.04)).toBe(0.919);
  });

  it('works with fractional inputs', () => {
    expect(calculateTotalArmLength(0.75, 0.125, 0.03)).toBeCloseTo(0.75 + 0.125 + 0.015, 10);
  });

  it('throws ValidationError for negative inputs', () => {
    expect(() => calculateTotalArmLength(-0.6, 0.3, 0.04)).toThrowError(ValidationError);
    expect(() => calculateTotalArmLength(0.6, -0.3, 0.04)).toThrowError(ValidationError);
    expect(() => calculateTotalArmLength(0.6, 0.3, -0.04)).toThrowError(ValidationError);
  });

  it('throws ValidationError for zero inputs', () => {
    expect(() => calculateTotalArmLength(0, 0.3, 0.04)).toThrowError(ValidationError);
    expect(() => calculateTotalArmLength(0.6, 0, 0.04)).toThrowError(ValidationError);
    expect(() => calculateTotalArmLength(0.6, 0.3, 0)).toThrowError(ValidationError);
  });
});

describe('calculateVelocity', () => {
  it('computes velocity as distance/time', () => {
    expect(calculateVelocity(10, 2)).toBe(5);
  });

  it('handles floating point division', () => {
    // 1/3 truncated/rounded to three decimals
    expect(calculateVelocity(1, 3)).toBe(0.333);
  });

  it('throws ValidationError for negative distance', () => {
    expect(() => calculateVelocity(-10, 2)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative time', () => {
    expect(() => calculateVelocity(10, -2)).toThrowError(/Invalid value/);
  });
});

describe('calculateTotalMass', () => {
  it('adds masses (integers)', () => {
    expect(calculateTotalMass(2, 1)).toBe(3);
  });

  it('adds masses (decimals)', () => {
    expect(calculateTotalMass(1.25, 0.75)).toBe(2);
  });

  it('throws ValidationError for negative inputs', () => {
    expect(() => calculateTotalMass(-2, 1)).toThrowError(ValidationError);
    expect(() => calculateTotalMass(2, -1)).toThrowError(ValidationError);
  });

  it('throws ValidationError for zero inputs', () => {
    expect(() => calculateTotalMass(0, 1)).toThrowError(ValidationError);
    expect(() => calculateTotalMass(1, 0)).toThrowError(ValidationError);
  });
});

describe('calculateKineticEnergy', () => {
  it('computes KE = 1/2 m v^2', () => {
    expect(calculateKineticEnergy(2, 3)).toBe(9);
  });

  it('works with non-integer values', () => {
    // 0.5 * 1.5 * 2.2^2 = 3.63 -> rounded to 3.63
    expect(calculateKineticEnergy(1.5, 2.2)).toBe(3.63);
  });

  it('throws ValidationError for negative mass', () => {
    expect(() => calculateKineticEnergy(-1, 2)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative velocity', () => {
    expect(() => calculateKineticEnergy(1, -2)).toThrowError(/Invalid value/);
  });
});

describe('calculateNailShaftCrossSection', () => {
  it('computes circular area from diameter', () => {
    // diameter = 0.01 m => area ≈ 7.85e-5 -> rounded to 0.00
    expect(calculateNailShaftCrossSection(0.01)).toBe(0);
  });

  it('throws ValidationError for non-positive diameter', () => {
    expect(() => calculateNailShaftCrossSection(-0.01)).toThrowError(ValidationError);
    expect(() => calculateNailShaftCrossSection(0)).toThrowError(ValidationError);
  });
});

describe('calculateConeCrossSectionAvg', () => {
  it('computes average cone cross-section area from geometry', () => {
    // Small geometry yields tiny area -> rounded to 0.00 m^2
    expect(calculateConeCrossSectionAvg(0.01, 0.005, 30)).toBe(0);
  });

  it('throws ValidationError for negative diameter or cone length', () => {
    expect(() => calculateConeCrossSectionAvg(-0.01, 0.005, 30)).toThrowError(ValidationError);
    expect(() => calculateConeCrossSectionAvg(0.01, -0.005, 30)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative cone angle', () => {
    expect(() => calculateConeCrossSectionAvg(0.01, 0.005, -5)).toThrowError(ValidationError);
  });

  it('handles 0° cone angle (area equals shaft cross-section)', () => {
    const d = 0.01;
    const shaftArea = calculateNailShaftCrossSection(d); // rounded to 0
    expect(calculateConeCrossSectionAvg(d, 0.005, 0)).toBe(shaftArea);
  });
});

describe('calculateFrictionForce', () => {
  it('computes friction force with default steel coefficient', () => {
    // With small areas rounded to 0, force rounds to 0.00 N
    expect(calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30)).toBe(0);
  });

  it('supports custom friction coefficient', () => {
    expect(calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30, 0.5)).toBe(0);
  });

  it('throws ValidationError for negative inputs', () => {
    expect(() => calculateFrictionForce(-0.01, 1_000_000, 0.05, 0.01, 30, 0.4)).toThrowError(ValidationError);
    expect(() => calculateFrictionForce(0.01, -1_000_000, 0.05, 0.01, 30, 0.4)).toThrowError(ValidationError);
    expect(() => calculateFrictionForce(0.01, 1_000_000, -0.05, 0.01, 30, 0.4)).toThrowError(ValidationError);
    expect(() => calculateFrictionForce(0.01, 1_000_000, 0.05, -0.01, 30, 0.4)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative cone angle', () => {
    expect(() => calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, -30, 0.4)).toThrowError(ValidationError);
  });

  it('throws ValidationError when friction coefficient is 0', () => {
    expect(() => calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30, 0)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative friction coefficient', () => {
    expect(() => calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30, -0.1)).toThrowError(ValidationError);
  });
});

describe('calculateMaxPenetrationDepth', () => {
  it('returns KE / friction', () => {
    expect(calculateMaxPenetrationDepth(10, 2)).toBe(5);
  });

  it('throws ValidationError for negative kinetic energy', () => {
    expect(() => calculateMaxPenetrationDepth(-10, 2)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative friction force', () => {
    expect(() => calculateMaxPenetrationDepth(10, -2)).toThrowError(/Invalid value/);
  });
});

describe('calculatePenetrationPercentage', () => {
  it('computes percentage of penetration', () => {
    expect(calculatePenetrationPercentage(0.025, 0.05)).toBe(50);
  });

  it('can exceed 100% if max depth is greater than material height (no capping)', () => {
    expect(calculatePenetrationPercentage(0.06, 0.05)).toBe(120);
  });

  it('throws ValidationError for negative depth', () => {
    expect(() => calculatePenetrationPercentage(-0.01, 0.05)).toThrowError(ValidationError);
  });

  it('throws ValidationError for negative material height', () => {
    expect(() => calculatePenetrationPercentage(0.01, -0.05)).toThrowError(/Invalid value/);
  });
});

describe('computePenetrationPercentageFromSI', () => {
  it('computes penetration percentage end-to-end from SI inputs', () => {
    const data = {
      armLength: 0.6,
      handleToHammerHeadLength: 0.2,
      hammerHeadHeight: 0.04,
      travelTime: 0.3,
      hammerWeight: 1.2,
      armWeight: 4,
      diameter: 0.04,
      nailLength: 0.12,
      coneLength: 0.02,
      coneAngleDeg: 30,
      materialHardness: 200_000_000,
      materialHeight: 0.05,
      nailFrictionCoefficient: 0.4,
    };

    const totalArm = calculateTotalArmLength(data.armLength, data.handleToHammerHeadLength, data.hammerHeadHeight);
    const vel = calculateVelocity(totalArm, data.travelTime);
    const totalMass = calculateTotalMass(data.hammerWeight, data.armWeight);
    const kineticEnergy = calculateKineticEnergy(totalMass, vel);
    const friction = calculateFrictionForce(
      data.diameter,
      data.materialHardness,
      data.nailLength,
      data.coneLength,
      data.coneAngleDeg,
      data.nailFrictionCoefficient,
    );
    const maxDepth = calculateMaxPenetrationDepth(kineticEnergy, friction);
    const expected = calculatePenetrationPercentage(maxDepth, data.materialHeight);

    const result = computePenetrationPercentageFromSI(data);
    expect(result).toBe(expected);
  });
});
