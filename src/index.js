/**
 * BUTTERFLY CITY - Main Game Entry Point
 * 
 * A semi-god town simulation where tiny social nudges spiral into harmony, heartbreak, or total chaos
 * 
 * This starter implementation demonstrates:
 * - Villager system with traits, moods, and relationships
 * - Nudge system for player interactions
 * - Event logging to track cascading consequences
 * - Simple text-based sprite rendering
 * 
 * NEXT STEPS TO BUILD A COMPLETE GAME:
 * 
 * 1. GAME LOOP & INPUT
 *    - Add real-time or turn-based game loop
 *    - Implement player input system (keyboard/mouse)
 *    - Create UI for selecting villagers and nudge actions
 * 
 * 2. WORLD SIMULATION
 *    - Add autonomous villager behavior (they interact without player nudges)
 *    - Implement time system (day/night cycles)
 *    - Add villager schedules and routines
 *    - Create locations (homes, park, cafe, etc.)
 * 
 * 3. GRAPHICS & RENDERING
 *    - Replace text rendering with HTML5 Canvas or game engine
 *    - Create sprite images for villagers and environments
 *    - Add animations for actions and emotions
 *    - Implement side-scrolling camera system
 * 
 * 4. ADVANCED GAMEPLAY
 *    - Add more nudge types (organize events, spread rumors, etc.)
 *    - Implement villager memories of past events
 *    - Create random events and scenarios
 *    - Add win/lose conditions or scoring system
 *    - Implement save/load game state
 * 
 * 5. CONTENT EXPANSION
 *    - More villager traits and combinations
 *    - More relationship types (family, professional, etc.)
 *    - Special story events and quests
 *    - Unlockable nudge abilities
 * 
 * 6. POLISH
 *    - Sound effects and music
 *    - Particle effects for emotions
 *    - Tutorial system
 *    - Settings and accessibility options
 */

import { Villager, TRAITS, MOODS } from './villager.js';
import { EventLogger } from './eventLogger.js';
import { NudgeSystem } from './nudgeSystem.js';
import { SpriteRenderer } from './spriteRenderer.js';

/**
 * ButterflyCity - Main game class
 */
class ButterflyCity {
  constructor() {
    this.eventLogger = new EventLogger();
    this.nudgeSystem = new NudgeSystem(this.eventLogger);
    this.spriteRenderer = new SpriteRenderer();
    this.villagers = [];
  }

  /**
   * Create a new villager and add to the city
   */
  createVillager(name, traits, mood = MOODS.NEUTRAL) {
    const villager = new Villager(name, traits, mood);
    this.spriteRenderer.assignSpriteByTrait(villager);
    
    // Position villagers in a line for now
    villager.setPosition(this.villagers.length * 100, 100);
    
    this.villagers.push(villager);
    this.eventLogger.log('game', `${name} joins Butterfly City!`, { villager: name });
    
    return villager;
  }

  /**
   * Get a villager by name
   */
  getVillager(name) {
    return this.villagers.find(v => v.name === name);
  }

  /**
   * Render the current game state
   */
  render() {
    this.spriteRenderer.renderScene(this.villagers);
  }

  /**
   * Run a demonstration of the game
   */
  runDemo() {
    console.log('\n🦋 WELCOME TO BUTTERFLY CITY 🦋\n');
    console.log('A town where your tiny nudges create big consequences...\n');
    
    // Create initial villagers
    console.log('=== Creating Villagers ===\n');
    
    const alice = this.createVillager('Alice', [TRAITS.FRIENDLY, TRAITS.ARTISTIC], MOODS.HAPPY);
    const bob = this.createVillager('Bob', [TRAITS.SHY, TRAITS.BOOKISH], MOODS.NEUTRAL);
    const carol = this.createVillager('Carol', [TRAITS.ROMANTIC, TRAITS.GOSSIP], MOODS.EXCITED);
    const dave = this.createVillager('Dave', [TRAITS.COMPETITIVE, TRAITS.ATHLETIC], MOODS.NEUTRAL);
    const eve = this.createVillager('Eve', [TRAITS.PEACEMAKER, TRAITS.FRIENDLY], MOODS.HAPPY);
    
    this.render();

    // Demonstrate various nudges
    console.log('\n=== NUDGE 1: Introduce Alice and Bob ===\n');
    const result1 = this.nudgeSystem.introduceVillagers(alice, bob);
    this.spriteRenderer.renderConsequences(result1.consequences);
    this.render();

    console.log('\n=== NUDGE 2: Introduce Carol and Dave ===\n');
    const result2 = this.nudgeSystem.introduceVillagers(carol, dave);
    this.spriteRenderer.renderConsequences(result2.consequences);
    this.render();

    console.log('\n=== NUDGE 3: Carol gossips to Alice about Bob ===\n');
    const result3 = this.nudgeSystem.shareGossip(carol, alice, bob);
    this.spriteRenderer.renderConsequences(result3.consequences);
    this.render();

    console.log('\n=== NUDGE 4: Encourage romance between Carol and Dave ===\n');
    const result4 = this.nudgeSystem.encourageRomance(carol, dave);
    this.spriteRenderer.renderConsequences(result4.consequences);
    this.render();

    console.log('\n=== NUDGE 5: Introduce Eve to everyone ===\n');
    const result5 = this.nudgeSystem.introduceVillagers(eve, alice);
    this.spriteRenderer.renderConsequences(result5.consequences);
    
    const result6 = this.nudgeSystem.introduceVillagers(eve, bob);
    this.spriteRenderer.renderConsequences(result6.consequences);
    
    this.render();

    console.log('\n=== NUDGE 6: Dave and Bob compete ===\n');
    // First introduce them
    this.nudgeSystem.introduceVillagers(dave, bob);
    const result7 = this.nudgeSystem.startCompetition(dave, bob);
    this.spriteRenderer.renderConsequences(result7.consequences);
    this.render();

    console.log('\n=== NUDGE 7: Eve tries to gossip (but she\'s a peacemaker!) ===\n');
    const result8 = this.nudgeSystem.shareGossip(eve, carol, dave);
    this.spriteRenderer.renderConsequences(result8.consequences);
    this.render();

    // Show event history
    console.log('\n=== EVENT HISTORY ===\n');
    this.eventLogger.printRecentEvents(20);

    console.log('\n=== FINAL STATE ===\n');
    this.render();

    console.log('\n🎮 DEMO COMPLETE! 🎮\n');
    console.log('This demonstrates the basic systems of Butterfly City:');
    console.log('- Villagers with unique traits and moods');
    console.log('- Relationship system with affinity scores');
    console.log('- Nudge system for player interactions');
    console.log('- Cascading consequences based on personality traits');
    console.log('- Event logging to track the story');
    console.log('- Simple sprite rendering system');
    console.log('\nSee the comments in index.js for next steps to build a full game!\n');
  }
}

// Run the demo when this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const game = new ButterflyCity();
  game.runDemo();
}

export default ButterflyCity;
