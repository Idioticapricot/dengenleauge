import { Move } from '../types/beast'

export const mockMoves: Move[] = [
  // Fire Moves
  {
    id: "fire_1",
    name: "Flame Burst",
    damage: 45,
    elementType: "fire",
    cooldown: 2,
    description: "A basic fire attack that burns enemies"
  },
  {
    id: "fire_2", 
    name: "Inferno Strike",
    damage: 65,
    elementType: "fire",
    cooldown: 3,
    description: "A powerful fire attack with high damage"
  },
  {
    id: "fire_3",
    name: "Meteor Crash",
    damage: 85,
    elementType: "fire", 
    cooldown: 4,
    description: "Ultimate fire move with devastating power"
  },

  // Water Moves
  {
    id: "water_1",
    name: "Water Pulse",
    damage: 40,
    elementType: "water",
    cooldown: 2,
    description: "A basic water attack that soaks enemies"
  },
  {
    id: "water_2",
    name: "Tidal Wave",
    damage: 60,
    elementType: "water",
    cooldown: 3,
    description: "A powerful water attack that crashes down"
  },
  {
    id: "water_3",
    name: "Tsunami Force",
    damage: 80,
    elementType: "water",
    cooldown: 4,
    description: "Ultimate water move with crushing force"
  },

  // Earth Moves
  {
    id: "earth_1",
    name: "Rock Throw",
    damage: 50,
    elementType: "earth",
    cooldown: 2,
    description: "A basic earth attack using solid rocks"
  },
  {
    id: "earth_2",
    name: "Earthquake",
    damage: 70,
    elementType: "earth", 
    cooldown: 3,
    description: "A powerful earth attack that shakes the ground"
  },
  {
    id: "earth_3",
    name: "Mountain Crush",
    damage: 90,
    elementType: "earth",
    cooldown: 4,
    description: "Ultimate earth move with immense weight"
  },

  // Electric Moves
  {
    id: "electric_1",
    name: "Thunder Bolt",
    damage: 55,
    elementType: "electric",
    cooldown: 2,
    description: "A basic electric attack with shocking power"
  },
  {
    id: "electric_2",
    name: "Lightning Strike",
    damage: 75,
    elementType: "electric",
    cooldown: 3,
    description: "A powerful electric attack from the sky"
  },
  {
    id: "electric_3",
    name: "Storm Fury",
    damage: 95,
    elementType: "electric",
    cooldown: 4,
    description: "Ultimate electric move with storm power"
  }
]

// Helper function to get moves by element and level
export function getAvailableMoves(elementType: string, level: number): Move[] {
  const elementMoves = mockMoves.filter(move => move.elementType === elementType)
  
  // Unlock moves based on level
  if (level >= 15) return elementMoves // All 3 moves
  if (level >= 10) return elementMoves.slice(0, 2) // First 2 moves
  return elementMoves.slice(0, 1) // Only first move
}

// Helper function to get starting moves for new beasts
export function getStartingMoves(elementType: string): Move[] {
  const elementMoves = mockMoves.filter(move => move.elementType === elementType)
  return elementMoves.slice(0, 1) // Start with 1 move
}