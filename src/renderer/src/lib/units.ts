const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

export const cmToM = (value: number) => roundTo3(value / 100);
export const mmToM = (value: number) => roundTo3(value / 1000);
export const MPaToPa = (value: number) => roundTo3(value * 1_000_000);

export type FormInputType = {
  // ARM AND HAMMER
  armLength: number;
  handleToHammerHeadLength: number;
  hammerHeadHeight: number;
  travelTime: number;
  hammerWeight: number;
  armWeight: number;
  // NAIL AND MATERIAL
  diameter: number;
  nailLength: number;
  coneLength: number;
  coneAngleDeg: number;
  materialHardness: number;
  materialHeight: number;
  nailFrictionCoefficient: number;
};

export const normalizeUnitsToSI = (ui: FormInputType): FormInputType => ({
  // ARM AND HAMMER SECTION
  armLength: cmToM(ui.armLength),
  handleToHammerHeadLength: cmToM(ui.handleToHammerHeadLength),
  hammerHeadHeight: cmToM(ui.hammerHeadHeight),
  travelTime: ui.travelTime,
  hammerWeight: ui.hammerWeight,
  armWeight: ui.armWeight,
  // NAIL AND MATERIAL SECTION
  diameter: mmToM(ui.diameter),
  nailLength: cmToM(ui.nailLength),
  coneLength: cmToM(ui.coneLength),
  coneAngleDeg: ui.coneAngleDeg,
  materialHardness: MPaToPa(ui.materialHardness),
  materialHeight: cmToM(ui.materialHeight),
  nailFrictionCoefficient: ui.nailFrictionCoefficient,
});
