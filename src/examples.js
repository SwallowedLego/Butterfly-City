/**
 * EXAMPLES - How to extend Butterfly City
 * 
 * This file demonstrates how to add new features to the game
 */

import ButterflyCity from './index.js';
import { TRAITS, MOODS } from './villager.js';

// Example 1: Creating a custom game scenario
function customScenario() {
  const game = new ButterflyCity();
  
  console.log('\n=== Custom Scenario: High School Drama ===\n');
  
  // Create a specific cast of characters
  const jock = game.createVillager('Jake', [TRAITS.ATHLETIC, TRAITS.COMPETITIVE], MOODS.EXCITED);
  const nerd = game.createVillager('Nina', [TRAITS.BOOKISH, TRAITS.SHY], MOODS.NEUTRAL);
  const artist = game.createVillager('Aria', [TRAITS.ARTISTIC, TRAITS.ROMANTIC], MOODS.HAPPY);
  const rebel = game.createVillager('Rex', [TRAITS.REBELLIOUS, TRAITS.GOSSIP], MOODS.NEUTRAL);
  
  game.render();
  
  // Create drama!
  console.log('\n--- The jock and artist meet at an art show ---');
  let result = game.nudgeSystem.introduceVillagers(jock, artist);
  game.spriteRenderer.renderConsequences(result.consequences);
  
  console.log('\n--- The nerd and artist bond over creativity ---');
  result = game.nudgeSystem.introduceVillagers(nerd, artist);
  game.spriteRenderer.renderConsequences(result.consequences);
  
  console.log('\n--- Love triangle? The jock makes a move ---');
  result = game.nudgeSystem.encourageRomance(jock, artist);
  game.spriteRenderer.renderConsequences(result.consequences);
  
  console.log('\n--- The rebel spreads rumors ---');
  game.nudgeSystem.introduceVillagers(rebel, nerd);
  result = game.nudgeSystem.shareGossip(rebel, nerd, jock);
  game.spriteRenderer.renderConsequences(result.consequences);
  
  game.render();
  game.eventLogger.printRecentEvents(15);
}

// Example 2: Adding a new custom nudge type
// You could add this to nudgeSystem.js
function exampleNewNudgeType(nudgeSystem, eventLogger) {
  /**
   * Organize a group activity for multiple villagers
   * Brings people together or creates awkwardness
   */
  function organizeGroupEvent(host, attendees, eventType = 'party') {
    eventLogger.log(
      'nudge',
      `${host.name} organizes a ${eventType} with ${attendees.length} attendees`,
      { host: host.name, attendees: attendees.map(v => v.name) }
    );

    const consequences = [];
    
    // Host gains social standing
    host.setMood(MOODS.EXCITED);
    consequences.push({
      type: 'positive',
      description: `${host.name} feels proud of hosting!`
    });
    
    // Attendees interact with each other
    for (let i = 0; i < attendees.length; i++) {
      for (let j = i + 1; j < attendees.length; j++) {
        const v1 = attendees[i];
        const v2 = attendees[j];
        
        // If they don't know each other, introduce them
        if (!v1.getRelationship(v2)) {
          v1.setRelationship(v2, 10, 'neutral');
          v2.setRelationship(v1, 10, 'neutral');
          
          consequences.push({
            type: 'positive',
            description: `${v1.name} and ${v2.name} meet at the ${eventType}`
          });
        } else {
          // Strengthen existing relationship
          v1.modifyAffinity(v2, 5);
          v2.modifyAffinity(v1, 5);
        }
      }
    }
    
    // Special: shy people feel overwhelmed at large events
    attendees.forEach(attendee => {
      if (attendee.hasTrait(TRAITS.SHY) && attendees.length > 3) {
        attendee.setMood(MOODS.ANXIOUS);
        consequences.push({
          type: 'chaos',
          description: `${attendee.name} (shy) feels overwhelmed by the crowd!`
        });
      }
    });
    
    return { consequences };
  }
  
  // Add to nudge system
  nudgeSystem.organizeGroupEvent = organizeGroupEvent.bind(null, nudgeSystem);
  
  return organizeGroupEvent;
}

// Example 3: Creating a simple game loop with player choices
async function interactiveGameLoop() {
  // Note: This requires a proper input system
  // For Node.js, you could use readline or prompts library
  
  console.log('\n=== Interactive Mode (Conceptual) ===\n');
  console.log('In a full implementation, you would:');
  console.log('1. Display current villagers and their moods');
  console.log('2. Show available nudge options');
  console.log('3. Wait for player input');
  console.log('4. Execute chosen nudge');
  console.log('5. Show consequences');
  console.log('6. Repeat\n');
  
  console.log('Example menu:');
  console.log('=================');
  console.log('1. Introduce two villagers');
  console.log('2. Share gossip');
  console.log('3. Encourage romance');
  console.log('4. Start competition');
  console.log('5. View all villagers');
  console.log('6. View event history');
  console.log('7. Quit');
  console.log('=================');
  console.log('\nTo implement this, add readline or prompts package:');
  console.log('npm install prompts');
  console.log('\nThen use prompts to get user input and execute actions.');
}

// Example 4: Adding autonomous behavior
function exampleAutonomousBehavior(game) {
  console.log('\n=== Autonomous Behavior Example ===\n');
  console.log('Villagers could act on their own:');
  
  // Villagers with high affinity might seek each other out
  game.villagers.forEach(villager => {
    villager.getRelationshipSummary().forEach(rel => {
      if (rel.affinity > 50 && Math.random() > 0.7) {
        console.log(`${villager.name} seeks out ${rel.name} to spend time together`);
        // In a full implementation: modify affinity, create events
      }
    });
  });
  
  // Gossips spread rumors automatically
  const gossipers = game.villagers.filter(v => v.hasTrait(TRAITS.GOSSIP));
  gossipers.forEach(gossiper => {
    if (Math.random() > 0.8 && gossiper.relationships.size >= 2) {
      console.log(`${gossiper.name} spontaneously starts gossiping!`);
      // In a full implementation: pick random target and listener
    }
  });
  
  // Rivals might start conflicts
  game.villagers.forEach(villager => {
    villager.getRelationshipSummary().forEach(rel => {
      if (rel.type === 'rival' && Math.random() > 0.9) {
        console.log(`${villager.name} and ${rel.name} have a confrontation!`);
        // In a full implementation: create conflict event
      }
    });
  });
}

// Example 5: Save/Load system (conceptual)
function exampleSaveLoad() {
  console.log('\n=== Save/Load System (Conceptual) ===\n');
  
  console.log('To save game state, serialize villagers and events:');
  console.log(`
  const gameState = {
    villagers: game.villagers.map(v => ({
      id: v.id,
      name: v.name,
      traits: v.traits,
      mood: v.mood,
      position: v.position,
      sprite: v.sprite,
      relationships: Array.from(v.relationships.entries())
    })),
    events: game.eventLogger.getAllEvents()
  };
  
  // Save to file
  fs.writeFileSync('savegame.json', JSON.stringify(gameState, null, 2));
  `);
  
  console.log('\nTo load game state, deserialize and reconstruct:');
  console.log(`
  const gameState = JSON.parse(fs.readFileSync('savegame.json'));
  
  // Reconstruct villagers
  const villagers = gameState.villagers.map(data => {
    const v = new Villager(data.name, data.traits, data.mood);
    v.id = data.id;
    v.position = data.position;
    v.sprite = data.sprite;
    v.relationships = new Map(data.relationships);
    return v;
  });
  `);
}

// Run examples
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎮 BUTTERFLY CITY - EXTENSION EXAMPLES 🎮\n');
  
  // Uncomment to run different examples:
  
  customScenario();
  
  // interactiveGameLoop();
  
  // const game = new ButterflyCity();
  // exampleAutonomousBehavior(game);
  
  // exampleSaveLoad();
  
  console.log('\n✨ Check the source code of this file to see how each example works! ✨\n');
}
