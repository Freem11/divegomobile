export type DiveSiteConditions = {
  conditionId: number,
  value: number
};

export enum DiveConditions {
  SHORE_DIVE = 1,
  BOAT_DIVE = 2,
  NIHGT_DIVE = 3,
  ALTITUDE_DIVE = 4,
  WREAK_DIVE = 5,
  CAVE_DIVE = 6,
  SALT_WATER = 7,
  FRESH_WATER = 8,
  SURFACE_TRAFFIC = 9,
  SURGE = 10,
  NO_REFS = 11,
  MAX_DEPTH = 12,
  KELP = 13,
  POLLUTION = 14,
  VISIBILITY = 15,
  CURRENT_INTENSITY = 16,
  CURRENT_LATTERAL = 17,
  CURRENT_UP = 18,
  CURRENT_DOWN = 19,
  CURRENT_CONTRASTING = 20,
};
