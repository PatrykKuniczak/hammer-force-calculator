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
  toSIConverter,
} from './calculations';
import { describe, expect, it } from 'vitest';

describe('toSIConverter', () => {
  it('converts cm to m', () => {
    expect(toSIConverter(100, 'cm', 'm')).toBe(1);
    expect(toSIConverter(2.5, 'cm', 'm')).toBe(0.025);
  });

  it('converts mm to m', () => {
    expect(toSIConverter(1000, 'mm', 'm')).toBe(1);
  });

  it('converts m to cm', () => {
    expect(toSIConverter(1, 'm', 'cm')).toBe(100);
    expect(toSIConverter(0.025, 'm', 'cm')).toBe(2.5);
  });

  it('converts MPa to Pa', () => {
    expect(toSIConverter(1, 'MPa', 'Pa')).toBe(1_000_000);
    expect(toSIConverter(2.5, 'MPa', 'Pa')).toBe(2_500_000);
  });

  it('throws for unsupported units', () => {
    expect(() => toSIConverter(1, 'km', 'm')).toThrowError(/Invalid fromUnit/);
    expect(() => toSIConverter(1, 'cm', 'km')).toThrowError(/Invalid toUnit/);
  });
});

describe('calculateTotalArmLength', () => {
  it('sums arm, handle-to-head, and half head height', () => {
    expect(calculateTotalArmLength(0.6, 0.3, 0.04)).toBeCloseTo(0.92, 10);
  });

  it('works with fractional inputs', () => {
    expect(calculateTotalArmLength(0.75, 0.125, 0.03)).toBeCloseTo(0.75 + 0.125 + 0.015, 10);
  });
});

describe('calculateVelocity', () => {
  it('computes velocity as distance/time', () => {
    expect(calculateVelocity(10, 2)).toBe(5);
  });

  it('handles floating point division', () => {
    expect(calculateVelocity(1, 3)).toBeCloseTo(0.3333333333, 9);
  });
});

describe('calculateTotalMass', () => {
  it('adds masses (integers)', () => {
    expect(calculateTotalMass(2, 1)).toBe(3);
  });

  it('adds masses (decimals)', () => {
    expect(calculateTotalMass(1.25, 0.75)).toBe(2);
  });
});

describe('calculateKineticEnergy', () => {
  it('computes KE = 1/2 m v^2', () => {
    expect(calculateKineticEnergy(2, 3)).toBe(9);
  });

  it('works with non-integer values', () => {
    expect(calculateKineticEnergy(1.5, 2.2)).toBeCloseTo(0.5 * 1.5 * 2.2 ** 2, 10);
  });
});

describe('calculateNailShaftCrossSection', () => {
  it('computes circular area from diameter', () => {
    // diameter = 0.01 m => r = 0.005 m => area = pi * r^2 ≈ 7.853981633974483e-5
    expect(calculateNailShaftCrossSection(0.01)).toBeCloseTo(7.853981633974483e-5, 12);
  });
});

describe('calculateConeCrossSectionAvg', () => {
  it('computes average cone cross-section area from geometry', () => {
    // d = 0.01 m, coneLength = 0.005 m, coneAngle = 30°
    // Expected ≈ 5.890486225480862e-5 m^2
    expect(calculateConeCrossSectionAvg(0.01, 0.005, 30)).toBeCloseTo(5.890486225480862e-5, 12);
  });
});

describe('calculateFrictionForce', () => {
  it('computes friction force with default steel coefficient', () => {
    // diameter=0.01 m, hardness=1e6 Pa, nailLength=0.05 m, coneLength=0.01 m, angle=30°
    // Expected from the current model ≈ 1.4249945043 N
    expect(calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30)).toBeCloseTo(1.4249945043, 9);
  });

  it('supports custom friction coefficient', () => {
    // Same as above but with coefficient = 0.5 => ≈ 1.7812431304 N
    expect(calculateFrictionForce(0.01, 1_000_000, 0.05, 0.01, 30, 0.5)).toBeCloseTo(1.7812431304, 8);
  });
});

describe('calculateMaxPenetrationDepth', () => {
  it('returns KE / friction', () => {
    expect(calculateMaxPenetrationDepth(10, 2)).toBe(5);
  });
});

describe('calculatePenetrationPercentage', () => {
  it('computes percentage of penetration', () => {
    expect(calculatePenetrationPercentage(0.025, 0.05)).toBe(50);
  });

  it('can exceed 100% if max depth is greater than material height (no capping)', () => {
    expect(calculatePenetrationPercentage(0.06, 0.05)).toBe(120);
  });
});
