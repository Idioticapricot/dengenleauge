const { describe, it, expect, beforeEach, afterEach, jest } = require('@jest/globals');

// Mock battle API endpoints
class BattleAPI {
  constructor() {
    this.battles = new Map();
    this.battleCounter = 1;
  }

  // POST /api/battle - Create new battle
  async createBattle(player1Id, player2Id, battleType = 'pve', pot = 0) {
    const battleId = `battle_${this.battleCounter++}`;
    
    const battle = {
      id: battleId,
      player1Id,
      player2Id,
      battleType, // 'pve' or 'pvp'
      pot,
      status: 'active',
      currentTurn: 'player1',
      turnCount: 1,
      createdAt: new Date().toISOString(),
      winner: null,
      battleLog: [`Battle ${battleId} started!`]
    };

    this.battles.set(battleId, battle);
    return { success: true, battle };
  }

  // POST /api/battle/action - Process battle action
  async processBattleAction(battleId, playerId, action) {
    const battle = this.battles.get(battleId);
    
    if (!battle) {
      return { success: false, error: 'Battle not found' };
    }

    if (battle.status !== 'active') {
      return { success: false, error: 'Battle is not active' };
    }

    if (battle.currentTurn !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    // Validate action
    if (!action || !action.type) {
      return { success: false, error: 'Invalid action' };
    }

    // Process different action types
    switch (action.type) {
      case 'attack':
        return this.processAttack(battle, playerId, action);
      case 'switch':
        return this.processSwitch(battle, playerId, action);
      default:
        return { success: false, error: 'Unknown action type' };
    }
  }

  processAttack(battle, playerId, action) {
    if (!action.moveId || !action.targetId) {
      return { success: false, error: 'Missing move or target' };
    }

    // Mock damage calculation
    const damage = Math.floor(Math.random() * 50) + 20; // 20-70 damage
    const isPlayerAttack = playerId === 'player1';
    const attacker = isPlayerAttack ? 'Player 1' : 'Player 2';
    const defender = isPlayerAttack ? 'Player 2' : 'Player 1';

    // Update battle log
    battle.battleLog.push(`${attacker} used ${action.moveId}!`);
    battle.battleLog.push(`${defender} took ${damage} damage!`);

    // Switch turns
    battle.currentTurn = battle.currentTurn === 'player1' ? 'player2' : 'player1';
    battle.turnCount++;

    // Check for battle end (mock)
    if (Math.random() < 0.1) { // 10% chance to end battle
      battle.status = 'completed';
      battle.winner = playerId;
      battle.battleLog.push(`${attacker} wins the battle!`);
    }

    this.battles.set(battle.id, battle);
    return { success: true, battle, damage };
  }

  processSwitch(battle, playerId, action) {
    if (!action.newBeastId) {
      return { success: false, error: 'Missing new beast ID' };
    }

    const playerName = playerId === 'player1' ? 'Player 1' : 'Player 2';
    
    // Update battle log
    battle.battleLog.push(`${playerName} switched to ${action.newBeastId}!`);

    // Switch turns (switching takes a turn)
    battle.currentTurn = battle.currentTurn === 'player1' ? 'player2' : 'player1';
    battle.turnCount++;

    this.battles.set(battle.id, battle);
    return { success: true, battle };
  }

  // GET /api/battle/:id - Get battle state
  async getBattle(battleId) {
    const battle = this.battles.get(battleId);
    
    if (!battle) {
      return { success: false, error: 'Battle not found' };
    }

    return { success: true, battle };
  }

  // POST /api/battle/:id/end - End battle
  async endBattle(battleId, winnerId) {
    const battle = this.battles.get(battleId);
    
    if (!battle) {
      return { success: false, error: 'Battle not found' };
    }

    battle.status = 'completed';
    battle.winner = winnerId;
    battle.endedAt = new Date().toISOString();
    
    // Handle rewards/penalties
    const rewards = this.calculateRewards(battle);
    
    this.battles.set(battleId, battle);
    return { success: true, battle, rewards };
  }

  calculateRewards(battle) {
    const rewards = {
      winner: {
        exp: 100,
        tokens: battle.pot || 0,
        items: []
      },
      loser: {
        exp: 25,
        tokens: battle.battleType === 'pvp' ? -battle.pot : 0,
        items: []
      }
    };

    // PvE battles give items
    if (battle.battleType === 'pve') {
      if (Math.random() < 0.3) { // 30% chance for item drop
        rewards.winner.items.push('Health Potion');
      }
    }

    return rewards;
  }

  // Helper method to clear all battles (for testing)
  clearBattles() {
    this.battles.clear();
    this.battleCounter = 1;
  }
}

describe('Battle API', () => {
  let battleAPI;

  beforeEach(() => {
    battleAPI = new BattleAPI();
  });

  afterEach(() => {
    battleAPI.clearBattles();
  });

  describe('Battle Creation', () => {
    it('should create a new PvE battle successfully', async () => {
      const result = await battleAPI.createBattle('player1', 'ai', 'pve', 0);
      
      expect(result.success).toBe(true);
      expect(result.battle).toBeDefined();
      expect(result.battle.id).toMatch(/^battle_\d+$/);
      expect(result.battle.battleType).toBe('pve');
      expect(result.battle.status).toBe('active');
      expect(result.battle.currentTurn).toBe('player1');
      expect(result.battle.pot).toBe(0);
    });

    it('should create a new PvP battle with pot', async () => {
      const result = await battleAPI.createBattle('player1', 'player2', 'pvp', 20);
      
      expect(result.success).toBe(true);
      expect(result.battle.battleType).toBe('pvp');
      expect(result.battle.pot).toBe(20);
      expect(result.battle.player1Id).toBe('player1');
      expect(result.battle.player2Id).toBe('player2');
    });

    it('should generate unique battle IDs', async () => {
      const battle1 = await battleAPI.createBattle('player1', 'ai', 'pve');
      const battle2 = await battleAPI.createBattle('player1', 'ai', 'pve');
      
      expect(battle1.battle.id).not.toBe(battle2.battle.id);
    });

    it('should initialize battle with correct default values', async () => {
      const result = await battleAPI.createBattle('player1', 'ai');
      const battle = result.battle;
      
      expect(battle.turnCount).toBe(1);
      expect(battle.winner).toBeNull();
      expect(Array.isArray(battle.battleLog)).toBe(true);
      expect(battle.battleLog.length).toBeGreaterThan(0);
      expect(battle.createdAt).toBeDefined();
    });
  });

  describe('Battle Actions', () => {
    let battleId;

    beforeEach(async () => {
      const result = await battleAPI.createBattle('player1', 'player2', 'pvp', 20);
      battleId = result.battle.id;
    });

    it('should process attack action successfully', async () => {
      const action = {
        type: 'attack',
        moveId: 'fire_blast',
        targetId: 'opponent_beast'
      };

      const result = await battleAPI.processBattleAction(battleId, 'player1', action);
      
      expect(result.success).toBe(true);
      expect(result.battle.currentTurn).toBe('player2'); // Turn switched
      expect(result.battle.turnCount).toBe(2);
      expect(result.damage).toBeGreaterThanOrEqual(20);
      expect(result.damage).toBeLessThanOrEqual(70);
      expect(result.battle.battleLog.length).toBeGreaterThan(1);
    });

    it('should process switch action successfully', async () => {
      const action = {
        type: 'switch',
        newBeastId: 'water_beast_2'
      };

      const result = await battleAPI.processBattleAction(battleId, 'player1', action);
      
      expect(result.success).toBe(true);
      expect(result.battle.currentTurn).toBe('player2');
      expect(result.battle.turnCount).toBe(2);
      expect(result.battle.battleLog.some(log => log.includes('switched'))).toBe(true);
    });

    it('should reject action when not player turn', async () => {
      const action = {
        type: 'attack',
        moveId: 'water_gun',
        targetId: 'opponent_beast'
      };

      // Try to act as player2 when it's player1's turn
      const result = await battleAPI.processBattleAction(battleId, 'player2', action);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Not your turn');
    });

    it('should reject invalid action types', async () => {
      const action = {
        type: 'invalid_action',
        data: 'test'
      };

      const result = await battleAPI.processBattleAction(battleId, 'player1', action);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown action type');
    });

    it('should reject attack without required parameters', async () => {
      const action = {
        type: 'attack'
        // Missing moveId and targetId
      };

      const result = await battleAPI.processBattleAction(battleId, 'player1', action);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing move or target');
    });

    it('should reject switch without new beast ID', async () => {
      const action = {
        type: 'switch'
        // Missing newBeastId
      };

      const result = await battleAPI.processBattleAction(battleId, 'player1', action);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Missing new beast ID');
    });

    it('should handle battle not found', async () => {
      const action = {
        type: 'attack',
        moveId: 'fire_blast',
        targetId: 'opponent'
      };

      const result = await battleAPI.processBattleAction('nonexistent', 'player1', action);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Battle not found');
    });
  });

  describe('Battle State Retrieval', () => {
    it('should retrieve existing battle state', async () => {
      const createResult = await battleAPI.createBattle('player1', 'ai', 'pve');
      const battleId = createResult.battle.id;

      const result = await battleAPI.getBattle(battleId);
      
      expect(result.success).toBe(true);
      expect(result.battle.id).toBe(battleId);
      expect(result.battle.status).toBe('active');
    });

    it('should handle non-existent battle', async () => {
      const result = await battleAPI.getBattle('nonexistent');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Battle not found');
    });
  });

  describe('Battle Completion', () => {
    let battleId;

    beforeEach(async () => {
      const result = await battleAPI.createBattle('player1', 'player2', 'pvp', 20);
      battleId = result.battle.id;
    });

    it('should end battle and calculate rewards', async () => {
      const result = await battleAPI.endBattle(battleId, 'player1');
      
      expect(result.success).toBe(true);
      expect(result.battle.status).toBe('completed');
      expect(result.battle.winner).toBe('player1');
      expect(result.battle.endedAt).toBeDefined();
      expect(result.rewards).toBeDefined();
      expect(result.rewards.winner).toBeDefined();
      expect(result.rewards.loser).toBeDefined();
    });

    it('should calculate PvP rewards correctly', async () => {
      const result = await battleAPI.endBattle(battleId, 'player1');
      
      expect(result.rewards.winner.exp).toBe(100);
      expect(result.rewards.winner.tokens).toBe(20); // Pot amount
      expect(result.rewards.loser.exp).toBe(25);
      expect(result.rewards.loser.tokens).toBe(-20); // Loses pot
    });

    it('should calculate PvE rewards correctly', async () => {
      // Create PvE battle
      const pveResult = await battleAPI.createBattle('player1', 'ai', 'pve', 0);
      const pveId = pveResult.battle.id;

      const result = await battleAPI.endBattle(pveId, 'player1');
      
      expect(result.rewards.winner.exp).toBe(100);
      expect(result.rewards.winner.tokens).toBe(0); // No pot in PvE
      expect(result.rewards.loser.tokens).toBe(0); // AI doesn't lose tokens
    });

    it('should handle ending non-existent battle', async () => {
      const result = await battleAPI.endBattle('nonexistent', 'player1');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Battle not found');
    });
  });

  describe('Battle Flow Integration', () => {
    it('should handle complete battle flow', async () => {
      // Create battle
      const createResult = await battleAPI.createBattle('player1', 'player2', 'pvp', 20);
      const battleId = createResult.battle.id;
      
      expect(createResult.success).toBe(true);

      // Player 1 attacks
      const attack1 = await battleAPI.processBattleAction(battleId, 'player1', {
        type: 'attack',
        moveId: 'fire_blast',
        targetId: 'opponent'
      });
      
      expect(attack1.success).toBe(true);
      expect(attack1.battle.currentTurn).toBe('player2');

      // Player 2 switches
      const switch1 = await battleAPI.processBattleAction(battleId, 'player2', {
        type: 'switch',
        newBeastId: 'water_beast'
      });
      
      expect(switch1.success).toBe(true);
      expect(switch1.battle.currentTurn).toBe('player1');

      // Get battle state
      const stateResult = await battleAPI.getBattle(battleId);
      expect(stateResult.success).toBe(true);
      expect(stateResult.battle.turnCount).toBe(3);

      // End battle
      const endResult = await battleAPI.endBattle(battleId, 'player1');
      expect(endResult.success).toBe(true);
      expect(endResult.battle.status).toBe('completed');
    });

    it('should prevent actions on completed battle', async () => {
      // Create and end battle
      const createResult = await battleAPI.createBattle('player1', 'player2', 'pvp', 20);
      const battleId = createResult.battle.id;
      
      await battleAPI.endBattle(battleId, 'player1');

      // Try to perform action on completed battle
      const result = await battleAPI.processBattleAction(battleId, 'player1', {
        type: 'attack',
        moveId: 'fire_blast',
        targetId: 'opponent'
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Battle is not active');
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined action', async () => {
      const createResult = await battleAPI.createBattle('player1', 'player2');
      const battleId = createResult.battle.id;

      const result1 = await battleAPI.processBattleAction(battleId, 'player1', null);
      const result2 = await battleAPI.processBattleAction(battleId, 'player1', undefined);
      const result3 = await battleAPI.processBattleAction(battleId, 'player1', {});

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
      expect(result3.success).toBe(false);
    });

    it('should handle invalid player IDs', async () => {
      const createResult = await battleAPI.createBattle('player1', 'player2');
      const battleId = createResult.battle.id;

      const result = await battleAPI.processBattleAction(battleId, 'invalid_player', {
        type: 'attack',
        moveId: 'test',
        targetId: 'test'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not your turn');
    });
  });
});

module.exports = { BattleAPI };