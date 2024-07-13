import { RaidType } from "./entities/raids/RaidFactory";

export const LEVEL_GRAVITY = 7000
export const PLAYER_JUMP_VELOCITY = -2500
export const SHADOW_VELOCITY = 20;
export const INITIAL_COFFEE_LEVEL = 1800;
export const INITIAL_LEVEL_VELOCITY = -1000;
export const COFFEE_LEVEL = 300;
export const TIMER_DELAY = 200;

export const ITEMS_HEIGHT = [
  520,
  240,
]

export const LEVEL_RAIDS: Record<string, RaidType[]> = {
  "09:10": ["work"],
  // "09:10": ["normal"],
  // "10:00": ["daily"],
  // "11:30": ["work"],
}