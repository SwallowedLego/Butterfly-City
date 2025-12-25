/**
 * Villager class represents an individual character in Butterfly City
 * 
 * Each villager has:
 * - Unique traits that define their personality
 * - A mood that changes based on events
 * - Relationships with other villagers
 * - A position in the 2D world
 */
export class Villager {
  constructor(name, traits = [], initialMood = 'neutral') {
    this.id = Math.random().toString(36).substr(2, 9);
    this.name = name;
    this.traits = traits; // e.g., ['friendly', 'artistic', 'shy']
    this.mood = initialMood; // e.g., 'happy', 'sad', 'angry', 'excited', 'neutral'
    this.relationships = new Map(); // Map of villager.id -> Relationship object
    this.position = { x: 0, y: 0 }; // Position in the 2D world
    this.sprite = '🦋'; // Default sprite (can be customized)
  }

  /**
   * Add or update a relationship with another villager
   * @param {Villager} otherVillager - The villager to relate to
   * @param {number} affinity - Relationship strength (-100 to 100)
   * @param {string} type - Type of relationship ('friend', 'romance', 'rival', 'neutral')
   */
  setRelationship(otherVillager, affinity, type = 'neutral') {
    this.relationships.set(otherVillager.id, {
      villagerId: otherVillager.id,
      villagerName: otherVillager.name,
      affinity: affinity,
      type: type,
      history: [] // Track events that affected this relationship
    });
  }

  /**
   * Get relationship with another villager
   * @param {Villager} otherVillager
   * @returns {Object|null} Relationship object or null if no relationship exists
   */
  getRelationship(otherVillager) {
    return this.relationships.get(otherVillager.id) || null;
  }

  /**
   * Modify the affinity of a relationship
   * @param {Villager} otherVillager
   * @param {number} delta - Amount to change affinity by
   */
  modifyAffinity(otherVillager, delta) {
    const relationship = this.relationships.get(otherVillager.id);
    if (relationship) {
      relationship.affinity = Math.max(-100, Math.min(100, relationship.affinity + delta));
      
      // Update relationship type based on affinity
      if (relationship.affinity > 60) {
        relationship.type = relationship.type === 'romance' ? 'romance' : 'friend';
      } else if (relationship.affinity < -40) {
        relationship.type = 'rival';
      } else {
        relationship.type = 'neutral';
      }
    }
  }

  /**
   * Set the villager's mood
   * @param {string} newMood - The new mood state
   */
  setMood(newMood) {
    this.mood = newMood;
  }

  /**
   * Check if the villager has a specific trait
   * @param {string} trait - The trait to check for
   * @returns {boolean}
   */
  hasTrait(trait) {
    return this.traits.includes(trait);
  }

  /**
   * Set the villager's position in the 2D world
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    this.position = { x, y };
  }

  /**
   * Get a string representation of the villager for display
   * @returns {string}
   */
  toString() {
    return `${this.sprite} ${this.name} (${this.mood}) - Traits: ${this.traits.join(', ')}`;
  }

  /**
   * Get summary of all relationships
   * @returns {Array} Array of relationship summaries
   */
  getRelationshipSummary() {
    const summaries = [];
    for (const [id, rel] of this.relationships) {
      summaries.push({
        name: rel.villagerName,
        affinity: rel.affinity,
        type: rel.type
      });
    }
    return summaries;
  }
}

// Common trait examples for easy reference
export const TRAITS = {
  FRIENDLY: 'friendly',
  SHY: 'shy',
  ARTISTIC: 'artistic',
  ATHLETIC: 'athletic',
  BOOKISH: 'bookish',
  REBELLIOUS: 'rebellious',
  ROMANTIC: 'romantic',
  COMPETITIVE: 'competitive',
  GOSSIP: 'gossip',
  PEACEMAKER: 'peacemaker'
};

// Common mood states
export const MOODS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  EXCITED: 'excited',
  ANXIOUS: 'anxious',
  NEUTRAL: 'neutral',
  LOVE_STRUCK: 'love-struck',
  JEALOUS: 'jealous'
};
