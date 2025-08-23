const { describe, it, expect, beforeEach } = require('@jest/globals');

// Mock battle system functions
class BattleSystem {
  calculateDamage(attacker, defender, move) {
    const baseDamage = (attacker.power * move.damage) / 100;
    const typeMultiplier = this.getTypeEffectiveness(move.elementType, defender.elementType);
    const critChance = 0.0625 + (attacker.power / 1000);
    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit ? 1.5 : 1;
    const randomFactor = 0.85 + Math.random() * 0.3; // 0.85 - 1.15
    
    return Math.floor(baseDamage * typeMultiplier * critMultiplier * randomFactor);
  }

  getTypeEffectiveness(attackType, defenseType) {
    const effectiveness = {
      fire: { earth: 2, water: 0.5, electric: 1, fire: 1 },
      earth: { electric: 2, fire: 0.5, water: 1, earth: 1 },
      electric: { water: 2, earth: 0.5, fire: 1, electric: 1 },
      water: { fire: 2, electric: 0.5, earth: 1, water: 1 }
    };
    return effectiveness[attackType]?.[defenseType] || 1;
  }

  determineTurnOrder(beast1, beast2) {
    return beast1.stamina >= beast2.stamina ? 'player1' : 'player2';
  }

  checkBattleEnd(player1Beast, player2Beast) {
    if (player1Beast.currentHP <= 0) return 'player2';
    if (player2Beast.currentHP <= 0) return 'player1';
    return null;
  }

  convertToBattleBeast(beast) {
    return {
      id: beast.id,
      name: beast.name,
      maxHP: beast.stats.health,
      currentHP: beast.stats.health,
      power: beast.stats.power,
      stamina: beast.stats.stamina,
      elementType: beast.elementType,
      imageUrl: beast.imageUrl,
      moves: beast.moves
    };
  }
}

describe('Battle System', () => {
  let battleSystem;
  let mockBeast1;
  let mockBeast2;
  let mockMove;

  beforeEach(() => {
    battleSystem = new BattleSystem();
    
    mockBeast1 = {
      id: 'beast1',
      name: 'Fire Beast',
      stats: { health: 100, power: 80, stamina: 60 },
      elementType: 'fire',
      imageUrl: null,
      moves: [
        { id: 'move1', name: 'Flame Burst', damage: 50, elementType: 'fire' }
      ]
    };

    mockBeast2 = {
      id: 'beast2',
      name: 'Water Beast',
      stats: { health: 90, power: 70, stamina: 70 },
      elementType: 'water',
      imageUrl: null,
      moves: [
        { id: 'move2', name: 'Water Pulse', damage: 45, elementType: 'water' }
      ]
    };

    mockMove = {
      id: 'move1',
      name: 'Flame Burst',
      damage: 50,
      elementType: 'fire'
    };
  });

  describe('Type Effectiveness', () => {
    it('should return 2x damage for super effective attacks', () => {
      expect(battleSystem.getTypeEffectiveness('fire', 'earth')).toBe(2);
      expect(battleSystem.getTypeEffectiveness('water', 'fire')).toBe(2);
      expect(battleSystem.getTypeEffectiveness('earth', 'electric')).toBe(2);
      expect(battleSystem.getTypeEffectiveness('electric', 'water')).toBe(2);
    });

    it('should return 0.5x damage for not very effective attacks', () => {
      expect(battleSystem.getTypeEffectiveness('fire', 'water')).toBe(0.5);
      expect(battleSystem.getTypeEffectiveness('water', 'electric')).toBe(0.5);
      expect(battleSystem.getTypeEffectiveness('earth', 'fire')).toBe(0.5);
      expect(battleSystem.getTypeEffectiveness('electric', 'earth')).toBe(0.5);
    });

    it('should return 1x damage for neutral attacks', () => {
      expect(battleSystem.getTypeEffectiveness('fire', 'fire')).toBe(1);
      expect(battleSystem.getTypeEffectiveness('water', 'water')).toBe(1);
      expect(battleSystem.getTypeEffectiveness('fire', 'electric')).toBe(1);
    });

    it('should return 1x damage for unknown types', () => {
      expect(battleSystem.getTypeEffectiveness('unknown', 'fire')).toBe(1);
      expect(battleSystem.getTypeEffectiveness('fire', 'unknown')).toBe(1);
    });
  });

  describe('Damage Calculation', () => {
    it('should calculate base damage correctly', () => {
      const attacker = battleSystem.convertToBattleBeast(mockBeast1);
      const defender = battleSystem.convertToBattleBeast(mockBeast2);
      
      // Mock Math.random to return consistent values
      const originalRandom = Math.random;
      Math.random = () => 0.5; // Middle of range for consistent testing
      
      const damage = battleSystem.calculateDamage(attacker, defender, mockMove);
      
      // Base damage = (80 * 50) / 100 = 40
      // Type effectiveness = fire vs water = 0.5
      // Expected base = 40 * 0.5 = 20
      // With random factor 0.5 -> 1.0, so damage should be around 20
      expect(damage).toBeGreaterThan(15);
      expect(damage).toBeLessThan(25);
      
      Math.random = originalRandom;
    });

    it('should apply type effectiveness multiplier', () => {
      const fireAttacker = battleSystem.convertToBattleBeast(mockBeast1);
      const earthDefender = battleSystem.convertToBattleBeast({
        ...mockBeast2,
        elementType: 'earth'
      });
      
      const originalRandom = Math.random;
      Math.random = () => 0.5;
      
      const damage = battleSystem.calculateDamage(fireAttacker, earthDefender, mockMove);
      
      // Fire vs Earth should be super effective (2x)
      expect(damage).toBeGreaterThan(60); // Should be roughly double
      
      Math.random = originalRandom;
    });

    it('should never return negative damage', () => {
      const weakAttacker = battleSystem.convertToBattleBeast({
        ...mockBeast1,
        stats: { ...mockBeast1.stats, power: 1 }
      });
      const defender = battleSystem.convertToBattleBeast(mockBeast2);
      
      const damage = battleSystem.calculateDamage(weakAttacker, defender, mockMove);
      expect(damage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Turn Order', () => {
    it('should give first turn to beast with higher stamina', () => {
      const beast1 = battleSystem.convertToBattleBeast(mockBeast1); // stamina: 60
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2); // stamina: 70
      
      const firstTurn = battleSystem.determineTurnOrder(beast1, beast2);
      expect(firstTurn).toBe('player2');
    });

    it('should give first turn to player1 when stamina is equal', () => {
      const beast1 = battleSystem.convertToBattleBeast({
        ...mockBeast1,
        stats: { ...mockBeast1.stats, stamina: 70 }
      });
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2); // stamina: 70
      
      const firstTurn = battleSystem.determineTurnOrder(beast1, beast2);
      expect(firstTurn).toBe('player1');
    });
  });

  describe('Battle End Conditions', () => {
    it('should declare player2 winner when player1 beast HP reaches 0', () => {
      const beast1 = battleSystem.convertToBattleBeast(mockBeast1);
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2);
      
      beast1.currentHP = 0;
      
      const winner = battleSystem.checkBattleEnd(beast1, beast2);
      expect(winner).toBe('player2');
    });

    it('should declare player1 winner when player2 beast HP reaches 0', () => {
      const beast1 = battleSystem.convertToBattleBeast(mockBeast1);
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2);
      
      beast2.currentHP = 0;
      
      const winner = battleSystem.checkBattleEnd(beast1, beast2);
      expect(winner).toBe('player1');
    });

    it('should return null when both beasts have HP remaining', () => {
      const beast1 = battleSystem.convertToBattleBeast(mockBeast1);
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2);
      
      const winner = battleSystem.checkBattleEnd(beast1, beast2);
      expect(winner).toBeNull();
    });

    it('should handle negative HP as defeat', () => {
      const beast1 = battleSystem.convertToBattleBeast(mockBeast1);
      const beast2 = battleSystem.convertToBattleBeast(mockBeast2);
      
      beast1.currentHP = -10;
      
      const winner = battleSystem.checkBattleEnd(beast1, beast2);
      expect(winner).toBe('player2');
    });
  });

  describe('Beast Conversion', () => {
    it('should convert regular beast to battle beast format', () => {
      const battleBeast = battleSystem.convertToBattleBeast(mockBeast1);
      
      expect(battleBeast).toHaveProperty('id', mockBeast1.id);
      expect(battleBeast).toHaveProperty('name', mockBeast1.name);
      expect(battleBeast).toHaveProperty('maxHP', mockBeast1.stats.health);
      expect(battleBeast).toHaveProperty('currentHP', mockBeast1.stats.health);
      expect(battleBeast).toHaveProperty('power', mockBeast1.stats.power);
      expect(battleBeast).toHaveProperty('stamina', mockBeast1.stats.stamina);
      expect(battleBeast).toHaveProperty('elementType', mockBeast1.elementType);
      expect(battleBeast).toHaveProperty('moves', mockBeast1.moves);
    });

    it('should set currentHP equal to maxHP initially', () => {
      const battleBeast = battleSystem.convertToBattleBeast(mockBeast1);
      
      expect(battleBeast.currentHP).toBe(battleBeast.maxHP);
      expect(battleBeast.currentHP).toBe(mockBeast1.stats.health);
    });
  });

  describe('Battle State Validation', () => {
    it('should validate required battle state properties', () => {
      const battleState = {
        id: 'battle_123',
        player1Beast: battleSystem.convertToBattleBeast(mockBeast1),
        player2Beast: battleSystem.convertToBattleBeast(mockBeast2),
        currentTurn: 'player1',
        battleLog: [],
        winner: null,
        isProcessing: false,
        pot: 20
      };

      expect(battleState).toHaveProperty('id');
      expect(battleState).toHaveProperty('player1Beast');
      expect(battleState).toHaveProperty('player2Beast');
      expect(battleState).toHaveProperty('currentTurn');
      expect(battleState).toHaveProperty('battleLog');
      expect(battleState).toHaveProperty('winner');
      expect(battleState).toHaveProperty('isProcessing');
      expect(battleState).toHaveProperty('pot');
      
      expect(['player1', 'player2']).toContain(battleState.currentTurn);
      expect(Array.isArray(battleState.battleLog)).toBe(true);
      expect(typeof battleState.isProcessing).toBe('boolean');
      expect(typeof battleState.pot).toBe('number');
    });
  });

  describe('Edge Cases', () => {
    it('should handle beasts with zero power', () => {
      const zeroPowerBeast = battleSystem.convertToBattleBeast({
        ...mockBeast1,
        stats: { ...mockBeast1.stats, power: 0 }
      });
      const defender = battleSystem.convertToBattleBeast(mockBeast2);
      
      const damage = battleSystem.calculateDamage(zeroPowerBeast, defender, mockMove);
      expect(damage).toBe(0);
    });

    it('should handle moves with zero damage', () => {
      const attacker = battleSystem.convertToBattleBeast(mockBeast1);
      const defender = battleSystem.convertToBattleBeast(mockBeast2);
      const zeroMove = { ...mockMove, damage: 0 };
      
      const damage = battleSystem.calculateDamage(attacker, defender, zeroMove);
      expect(damage).toBe(0);
    });

    it('should handle very high power values', () => {
      const highPowerBeast = battleSystem.convertToBattleBeast({
        ...mockBeast1,
        stats: { ...mockBeast1.stats, power: 999 }
      });
      const defender = battleSystem.convertToBattleBeast(mockBeast2);
      
      const damage = battleSystem.calculateDamage(highPowerBeast, defender, mockMove);
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThan(10000); // Reasonable upper bound
    });
  });
});

module.exports = { BattleSystem };