import { Beast } from '../types/beast'
import { getStartingMoves } from './mockMoves'

export const mockBeasts: Beast[] = [
  {
    id: "1",
    name: "Flame Warrior",
    tier: "basic",
    level: 12,
    exp: { current: 850, required: 1000 },
    stats: { health: 45, stamina: 38, power: 42 },
    elementType: "fire",
    rarity: "common",
    moves: getStartingMoves("fire")
  },
  {
    id: "2", 
    name: "Aqua Guardian",
    tier: "advanced",
    level: 8,
    exp: { current: 320, required: 500 },
    stats: { health: 52, stamina: 45, power: 38 },
    elementType: "water",
    rarity: "rare", 
    moves: getStartingMoves("water")
  },
  {
    id: "3",
    name: "Thunder Beast", 
    tier: "legendary",
    level: 15,
    exp: { current: 1200, required: 1200 },
    stats: { health: 68, stamina: 55, power: 72 },
    elementType: "electric",
    rarity: "legendary",
    moves: getStartingMoves("electric")
  },
  {
    id: "4",
    name: "Earth Titan",
    tier: "advanced", 
    level: 10,
    exp: { current: 650, required: 750 },
    stats: { health: 58, stamina: 42, power: 48 },
    elementType: "earth",
    rarity: "common",
    moves: getStartingMoves("earth")
  },
  {
    id: "5",
    name: "Frost Wolf",
    tier: "basic",
    level: 6,
    exp: { current: 180, required: 300 },
    stats: { health: 35, stamina: 42, power: 38 },
    elementType: "water",
    rarity: "common",
    moves: getStartingMoves("water")
  },
  {
    id: "6", 
    name: "Magma Drake",
    tier: "legendary",
    level: 20,
    exp: { current: 2500, required: 2500 },
    stats: { health: 85, stamina: 70, power: 95 },
    elementType: "fire",
    rarity: "legendary",
    moves: getStartingMoves("fire")
  }
]