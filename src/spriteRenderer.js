/**
 * Simple 2D Sprite System for Butterfly City
 * 
 * This is a basic text-based sprite system using Unicode characters
 * For a full graphical implementation, consider using:
 * - HTML5 Canvas
 * - Phaser.js
 * - PixiJS
 * - or other game engines
 */

/**
 * Sprite definitions for different villager types and moods
 * Uses emoji/Unicode for simple visual representation
 */
export const SPRITES = {
  // Default villager sprites by trait
  VILLAGER_DEFAULT: '🦋',
  VILLAGER_FRIENDLY: '😊',
  VILLAGER_SHY: '😳',
  VILLAGER_ARTISTIC: '🎨',
  VILLAGER_ATHLETIC: '⚽',
  VILLAGER_BOOKISH: '📚',
  VILLAGER_REBELLIOUS: '😎',
  VILLAGER_ROMANTIC: '💝',
  VILLAGER_COMPETITIVE: '🏆',
  VILLAGER_GOSSIP: '💬',
  VILLAGER_PEACEMAKER: '☮️',
  
  // Mood overlays (can be combined with trait sprites)
  MOOD_HAPPY: '😊',
  MOOD_SAD: '😢',
  MOOD_ANGRY: '😠',
  MOOD_EXCITED: '🤩',
  MOOD_ANXIOUS: '😰',
  MOOD_NEUTRAL: '😐',
  MOOD_LOVE_STRUCK: '😍',
  MOOD_JEALOUS: '😒',
  
  // Relationship indicators
  RELATIONSHIP_FRIEND: '💚',
  RELATIONSHIP_ROMANCE: '💖',
  RELATIONSHIP_RIVAL: '⚡',
  RELATIONSHIP_NEUTRAL: '➖',
  
  // Special effects
  EFFECT_HEARTS: '💕',
  EFFECT_SPARKLE: '✨',
  EFFECT_ANGER: '💢',
  EFFECT_SWEAT: '💦'
};

/**
 * SpriteRenderer handles rendering the game world
 * This is a simple console-based renderer
 */
export class SpriteRenderer {
  constructor(width = 80, height = 24) {
    this.width = width;
    this.height = height;
  }

  /**
   * Assign a sprite to a villager based on their primary trait
   * @param {Villager} villager 
   */
  assignSpriteByTrait(villager) {
    if (villager.traits.length === 0) {
      villager.sprite = SPRITES.VILLAGER_DEFAULT;
      return;
    }

    const primaryTrait = villager.traits[0];
    const spriteMap = {
      'friendly': SPRITES.VILLAGER_FRIENDLY,
      'shy': SPRITES.VILLAGER_SHY,
      'artistic': SPRITES.VILLAGER_ARTISTIC,
      'athletic': SPRITES.VILLAGER_ATHLETIC,
      'bookish': SPRITES.VILLAGER_BOOKISH,
      'rebellious': SPRITES.VILLAGER_REBELLIOUS,
      'romantic': SPRITES.VILLAGER_ROMANTIC,
      'competitive': SPRITES.VILLAGER_COMPETITIVE,
      'gossip': SPRITES.VILLAGER_GOSSIP,
      'peacemaker': SPRITES.VILLAGER_PEACEMAKER
    };

    villager.sprite = spriteMap[primaryTrait] || SPRITES.VILLAGER_DEFAULT;
  }

  /**
   * Get mood indicator for a villager
   * @param {Villager} villager 
   * @returns {string} Mood emoji
   */
  getMoodSprite(villager) {
    const moodMap = {
      'happy': SPRITES.MOOD_HAPPY,
      'sad': SPRITES.MOOD_SAD,
      'angry': SPRITES.MOOD_ANGRY,
      'excited': SPRITES.MOOD_EXCITED,
      'anxious': SPRITES.MOOD_ANXIOUS,
      'neutral': SPRITES.MOOD_NEUTRAL,
      'love-struck': SPRITES.MOOD_LOVE_STRUCK,
      'jealous': SPRITES.MOOD_JEALOUS
    };

    return moodMap[villager.mood] || SPRITES.MOOD_NEUTRAL;
  }

  /**
   * Render a simple scene with villagers
   * @param {Array<Villager>} villagers 
   */
  renderScene(villagers) {
    console.log('\n' + '='.repeat(this.width));
    console.log('BUTTERFLY CITY'.padStart(this.width / 2 + 7));
    console.log('='.repeat(this.width));
    console.log();

    villagers.forEach((villager, index) => {
      const moodIcon = this.getMoodSprite(villager);
      const line = `${villager.sprite} ${villager.name} ${moodIcon} [${villager.mood}]`;
      console.log(line);
      
      // Show traits
      console.log(`   Traits: ${villager.traits.join(', ')}`);
      
      // Show relationships
      if (villager.relationships.size > 0) {
        console.log('   Relationships:');
        for (const [id, rel] of villager.relationships) {
          const relIcon = this._getRelationshipIcon(rel.type);
          console.log(`     ${relIcon} ${rel.villagerName}: ${rel.affinity} (${rel.type})`);
        }
      }
      console.log();
    });

    console.log('='.repeat(this.width) + '\n');
  }

  /**
   * Get icon for relationship type
   * @private
   */
  _getRelationshipIcon(type) {
    const iconMap = {
      'friend': SPRITES.RELATIONSHIP_FRIEND,
      'romance': SPRITES.RELATIONSHIP_ROMANCE,
      'rival': SPRITES.RELATIONSHIP_RIVAL,
      'neutral': SPRITES.RELATIONSHIP_NEUTRAL
    };
    return iconMap[type] || SPRITES.RELATIONSHIP_NEUTRAL;
  }

  /**
   * Render consequences from a nudge
   * @param {Array} consequences 
   */
  renderConsequences(consequences) {
    console.log('\n--- CONSEQUENCES ---');
    consequences.forEach((consequence, index) => {
      const icon = this._getConsequenceIcon(consequence.type);
      console.log(`${index + 1}. ${icon} ${consequence.description}`);
    });
    console.log('-------------------\n');
  }

  /**
   * Get icon for consequence type
   * @private
   */
  _getConsequenceIcon(type) {
    const iconMap = {
      'positive': '✅',
      'negative': '❌',
      'neutral': 'ℹ️',
      'romance': '💖',
      'rivalry': '⚡',
      'chaos': '🌀'
    };
    return iconMap[type] || 'ℹ️';
  }
}

// NEXT STEPS for sprite system:
// 1. Integrate with HTML5 Canvas for graphical rendering
// 2. Create actual sprite images for villagers (PNG files)
// 3. Add animation frames for walking, talking, emoting
// 4. Implement sprite sheet loading and management
// 5. Add particle effects for special moments (hearts, sparkles, etc.)
// 6. Create background tiles for the city environment
// 7. Implement camera/viewport system for scrolling
