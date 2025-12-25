import { EventLogger } from './eventLogger.js';

/**
 * NudgeSystem handles player interactions with villagers
 * 
 * A "nudge" is a small player intervention that can cause cascading effects:
 * - Introduce two villagers
 * - Suggest an activity
 * - Share gossip
 * - Break up a conversation
 * 
 * Each nudge triggers immediate consequences that can cascade based on
 * villager traits, moods, and existing relationships.
 */
export class NudgeSystem {
  constructor(eventLogger) {
    this.eventLogger = eventLogger || new EventLogger();
  }

  /**
   * Introduce two villagers to each other
   * This creates or modifies their relationship based on their traits
   * 
   * @param {Villager} villager1 
   * @param {Villager} villager2 
   * @returns {Object} Result of the nudge with consequences
   */
  introduceVillagers(villager1, villager2) {
    this.eventLogger.log(
      'nudge',
      `You introduce ${villager1.name} to ${villager2.name}`,
      { villager1: villager1.name, villager2: villager2.name }
    );

    const consequences = [];

    // Check for existing relationship
    let existingRel = villager1.getRelationship(villager2);
    
    if (existingRel) {
      consequences.push({
        type: 'neutral',
        description: `${villager1.name} and ${villager2.name} already know each other`
      });
      return { consequences };
    }

    // Calculate initial affinity based on traits
    let initialAffinity = 0;
    
    // Friendly people start with positive affinity
    if (villager1.hasTrait('friendly')) initialAffinity += 15;
    if (villager2.hasTrait('friendly')) initialAffinity += 15;
    
    // Shy people are more cautious
    if (villager1.hasTrait('shy')) initialAffinity -= 10;
    if (villager2.hasTrait('shy')) initialAffinity -= 10;
    
    // Shared interests boost affinity
    const sharedTraits = villager1.traits.filter(t => villager2.hasTrait(t));
    initialAffinity += sharedTraits.length * 10;

    // Create mutual relationships
    villager1.setRelationship(villager2, initialAffinity, 'neutral');
    villager2.setRelationship(villager1, initialAffinity, 'neutral');

    // Log the consequence
    if (initialAffinity > 20) {
      villager1.setMood('happy');
      villager2.setMood('happy');
      consequences.push({
        type: 'positive',
        description: `${villager1.name} and ${villager2.name} hit it off! (Affinity: ${initialAffinity})`
      });
      this.eventLogger.log('consequence', `${villager1.name} and ${villager2.name} became friends!`);
    } else if (initialAffinity < -10) {
      consequences.push({
        type: 'negative',
        description: `${villager1.name} and ${villager2.name} don't seem to click (Affinity: ${initialAffinity})`
      });
      this.eventLogger.log('consequence', `${villager1.name} and ${villager2.name} feel awkward around each other`);
    } else {
      consequences.push({
        type: 'neutral',
        description: `${villager1.name} and ${villager2.name} meet (Affinity: ${initialAffinity})`
      });
    }

    // Check for cascading effects - romantic interest
    if (villager1.hasTrait('romantic') && initialAffinity > 30) {
      villager1.setMood('love-struck');
      villager1.modifyAffinity(villager2, 20);
      const rel = villager1.getRelationship(villager2);
      rel.type = 'romance';
      
      consequences.push({
        type: 'romance',
        description: `💕 ${villager1.name} is smitten with ${villager2.name}!`
      });
      this.eventLogger.log('consequence', `${villager1.name} develops romantic feelings!`, {
        target: villager2.name
      });
    }

    return { consequences };
  }

  /**
   * Nudge a villager to share gossip about another villager
   * Can strengthen bonds or create rivalries
   * 
   * @param {Villager} gossiper - The villager sharing gossip
   * @param {Villager} listener - The villager hearing the gossip
   * @param {Villager} subject - The villager being gossiped about
   * @returns {Object} Result of the nudge
   */
  shareGossip(gossiper, listener, subject) {
    this.eventLogger.log(
      'nudge',
      `You nudge ${gossiper.name} to gossip with ${listener.name} about ${subject.name}`,
      { gossiper: gossiper.name, listener: listener.name, subject: subject.name }
    );

    const consequences = [];

    // Gossipy trait makes it more effective
    const gossiperBonus = gossiper.hasTrait('gossip') ? 1.5 : 1.0;
    
    // Get existing relationships
    const gossipListenerRel = gossiper.getRelationship(listener);
    const listenerSubjectRel = listener.getRelationship(subject);

    // Gossip bonds the gossiper and listener
    if (gossipListenerRel) {
      gossiper.modifyAffinity(listener, 10 * gossiperBonus);
      listener.modifyAffinity(gossiper, 10 * gossiperBonus);
      consequences.push({
        type: 'positive',
        description: `${gossiper.name} and ${listener.name} bond over gossip`
      });
    }

    // Gossip damages relationship with subject
    if (listenerSubjectRel) {
      listener.modifyAffinity(subject, -15 * gossiperBonus);
      consequences.push({
        type: 'negative',
        description: `${listener.name}'s opinion of ${subject.name} decreases`
      });
      
      // If affinity becomes very negative, create rivalry
      if (listenerSubjectRel.affinity < -40) {
        listenerSubjectRel.type = 'rival';
        listener.setMood('angry');
        consequences.push({
          type: 'rivalry',
          description: `⚡ ${listener.name} and ${subject.name} are now rivals!`
        });
        this.eventLogger.log('consequence', `A rivalry forms between ${listener.name} and ${subject.name}!`);
      }
    }

    // Peacemakers don't like gossip
    if (listener.hasTrait('peacemaker')) {
      gossiper.modifyAffinity(listener, -20);
      listener.setMood('sad');
      consequences.push({
        type: 'chaos',
        description: `${listener.name} (a peacemaker) is disappointed in ${gossiper.name} for gossiping!`
      });
      this.eventLogger.log('consequence', `${listener.name} disapproves of gossip`);
    }

    return { consequences };
  }

  /**
   * Encourage a romantic gesture between two villagers
   * Can lead to romance or awkwardness
   * 
   * @param {Villager} admirer - The villager making the gesture
   * @param {Villager} target - The recipient of the gesture
   * @returns {Object} Result of the nudge
   */
  encourageRomance(admirer, target) {
    this.eventLogger.log(
      'nudge',
      `You encourage ${admirer.name} to make a romantic gesture toward ${target.name}`,
      { admirer: admirer.name, target: target.name }
    );

    const consequences = [];
    const relationship = admirer.getRelationship(target);

    if (!relationship) {
      consequences.push({
        type: 'chaos',
        description: `${admirer.name} and ${target.name} barely know each other! This is awkward!`
      });
      admirer.setMood('anxious');
      return { consequences };
    }

    const affinity = relationship.affinity;

    if (affinity > 40) {
      // Success! Romance blooms
      admirer.modifyAffinity(target, 30);
      target.modifyAffinity(admirer, 25);
      admirer.setMood('love-struck');
      target.setMood('love-struck');
      relationship.type = 'romance';
      const targetRel = target.getRelationship(admirer);
      if (targetRel) targetRel.type = 'romance';

      consequences.push({
        type: 'romance',
        description: `💖 ${admirer.name} and ${target.name} start a romance!`
      });
      this.eventLogger.log('consequence', `Romance blooms between ${admirer.name} and ${target.name}!`);
    } else if (affinity > 0) {
      // Mixed results
      admirer.modifyAffinity(target, 10);
      target.modifyAffinity(admirer, -5);
      admirer.setMood('anxious');
      target.setMood('neutral');
      
      consequences.push({
        type: 'chaos',
        description: `${target.name} is flattered but not interested. ${admirer.name} feels awkward.`
      });
      this.eventLogger.log('consequence', `${admirer.name}'s romantic gesture is politely declined`);
    } else {
      // Disaster!
      admirer.modifyAffinity(target, -10);
      target.modifyAffinity(admirer, -20);
      admirer.setMood('sad');
      target.setMood('angry');
      
      consequences.push({
        type: 'chaos',
        description: `💔 ${target.name} rejects ${admirer.name}! The atmosphere is tense.`
      });
      this.eventLogger.log('consequence', `${admirer.name}'s romantic gesture backfires spectacularly!`);
    }

    // Check for jealousy cascade
    this._checkForJealousy(admirer, target, consequences);

    return { consequences };
  }

  /**
   * Internal method to check for jealousy among other villagers
   * @private
   */
  _checkForJealousy(villager1, villager2, consequences) {
    // This is a placeholder for cascading jealousy effects
    // In a full implementation, you would check all villagers
    // who have romantic feelings for either villager1 or villager2
    // and create rivalry/jealousy consequences
    
    // TODO: Implement full jealousy cascade system
    // - Check all villagers in the world
    // - Find those with romantic relationships to villager1 or villager2
    // - Create jealousy and rivalry consequences
  }

  /**
   * Nudge two villagers to compete in an activity
   * Can strengthen friendship or create rivalry based on traits
   * 
   * @param {Villager} villager1 
   * @param {Villager} villager2 
   * @returns {Object} Result of the nudge
   */
  startCompetition(villager1, villager2) {
    this.eventLogger.log(
      'nudge',
      `You set up a friendly competition between ${villager1.name} and ${villager2.name}`,
      { villager1: villager1.name, villager2: villager2.name }
    );

    const consequences = [];
    const relationship = villager1.getRelationship(villager2);

    // Randomly determine winner
    const winner = Math.random() > 0.5 ? villager1 : villager2;
    const loser = winner === villager1 ? villager2 : villager1;

    consequences.push({
      type: 'neutral',
      description: `${winner.name} wins the competition!`
    });

    // Competitive trait affects outcome
    if (loser.hasTrait('competitive')) {
      loser.modifyAffinity(winner, -25);
      loser.setMood('angry');
      consequences.push({
        type: 'rivalry',
        description: `${loser.name} (competitive) doesn't take the loss well!`
      });
      
      if (relationship && relationship.affinity < -40) {
        consequences.push({
          type: 'rivalry',
          description: `⚡ ${loser.name} and ${winner.name} become rivals!`
        });
        this.eventLogger.log('consequence', `Competition creates a rivalry!`);
      }
    } else if (loser.hasTrait('friendly')) {
      loser.modifyAffinity(winner, 10);
      winner.modifyAffinity(loser, 10);
      loser.setMood('happy');
      winner.setMood('happy');
      consequences.push({
        type: 'positive',
        description: `${loser.name} (friendly) is a good sport. Their friendship strengthens!`
      });
    } else {
      loser.modifyAffinity(winner, -5);
      loser.setMood('neutral');
    }

    return { consequences };
  }
}
