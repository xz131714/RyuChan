export interface SakuraConfig {
  enable: boolean;
  sakuraNum: number;
  limitTimes: number;
  zIndex: number;
  size: { min: number; max: number };
  speed: {
    horizontal: { min: number; max: number };
    vertical: { min: number; max: number };
    rotation: number;
  };
}
