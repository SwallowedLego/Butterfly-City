/**
 * ASCII Art and Visual Assets for Butterfly City
 * 
 * Use these for splash screens, banners, and decorations
 */

export const ASCII_ART = {
  TITLE_BANNER: `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██████╗ ██╗   ██╗████████╗████████╗███████╗██████╗ ███████╗██╗  ██╗       ║
║   ██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝██║  ██║       ║
║   ██████╔╝██║   ██║   ██║      ██║   █████╗  ██████╔╝█████╗  ██║  ██║       ║
║   ██╔══██╗██║   ██║   ██║      ██║   ██╔══╝  ██╔══██╗██╔══╝  ██║  ██║       ║
║   ██████╔╝╚██████╔╝   ██║      ██║   ███████╗██║  ██║██║     ███████║       ║
║   ╚═════╝  ╚═════╝    ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝       ║
║                                                                              ║
║                         ██████╗██╗████████╗██╗   ██╗                        ║
║                        ██╔════╝██║╚══██╔══╝╚██╗ ██╔╝                        ║
║                        ██║     ██║   ██║    ╚████╔╝                         ║
║                        ██║     ██║   ██║     ╚██╔╝                          ║
║                        ╚██████╗██║   ██║      ██║                           ║
║                         ╚═════╝╚═╝   ╚═╝      ╚═╝                           ║
║                                                                              ║
║                    🦋 Where tiny nudges create big stories 🦋               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`,

  SIMPLE_TITLE: `
    ╔═══════════════════════════════════════╗
    ║     🦋  BUTTERFLY CITY  🦋           ║
    ║  A Social Nudge Simulation Game      ║
    ╚═══════════════════════════════════════╝
`,

  DIVIDER_BUTTERFLY: `
    🦋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🦋
`,

  GAME_OVER: `
    ╔═══════════════════════════════════════╗
    ║          GAME SESSION ENDED           ║
    ║                                       ║
    ║      Thanks for playing! 🦋          ║
    ╚═══════════════════════════════════════╝
`,

  VILLAGER_CARD_TEMPLATE: (name, sprite, traits, mood) => `
    ┌─────────────────────────────┐
    │  ${sprite}  ${name.padEnd(20)} │
    ├─────────────────────────────┤
    │  Mood: ${mood.padEnd(18)} │
    │  Traits:                    │
    │    ${traits.join(', ').substring(0, 23).padEnd(23)} │
    └─────────────────────────────┘
`,

  RELATIONSHIP_ICONS: {
    friend: '💚',
    romance: '💖',
    rival: '⚡',
    neutral: '➖'
  },

  MOOD_ICONS: {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    excited: '🤩',
    anxious: '😰',
    neutral: '😐',
    'love-struck': '😍',
    jealous: '😒'
  },

  PARTICLE_EFFECTS: {
    hearts: '💕💕💕',
    sparkles: '✨✨✨',
    anger: '💢💢💢',
    sweat: '💦💦💦',
    stars: '⭐⭐⭐',
    flowers: '🌸🌺🌸',
    fire: '🔥🔥🔥',
    broken_heart: '💔💔💔'
  },

  SCENE_ELEMENTS: {
    tree: '🌳',
    house: '🏠',
    cafe: '☕',
    park: '🌳',
    bench: '🪑',
    fountain: '⛲',
    streetlight: '💡',
    flower: '🌸'
  }
};

/**
 * Display a title screen
 */
export function showTitleScreen() {
  console.clear();
  console.log(ASCII_ART.TITLE_BANNER);
}

/**
 * Display a simple header
 */
export function showSimpleHeader() {
  console.log(ASCII_ART.SIMPLE_TITLE);
}

/**
 * Display a divider
 */
export function showDivider() {
  console.log(ASCII_ART.DIVIDER_BUTTERFLY);
}

/**
 * Display a villager card
 */
export function showVillagerCard(villager) {
  console.log(ASCII_ART.VILLAGER_CARD_TEMPLATE(
    villager.name,
    villager.sprite,
    villager.traits,
    villager.mood
  ));
}

/**
 * Show particle effect animation (simple console version)
 */
export function showParticleEffect(effectType, duration = 1000) {
  const effect = ASCII_ART.PARTICLE_EFFECTS[effectType] || '✨✨✨';
  console.log(`\n    ${effect}\n`);
}

/**
 * Create a simple scene with decorative elements
 */
export function createScene(description) {
  console.log('\n' + '='.repeat(80));
  console.log(`  Scene: ${description}`);
  console.log('  🌳    🏠    ☕    🌳    ⛲    🌸');
  console.log('='.repeat(80) + '\n');
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎨 Butterfly City - Visual Assets Demo 🎨\n');
  
  showTitleScreen();
  
  setTimeout(() => {
    showSimpleHeader();
    showDivider();
    
    console.log('\nParticle Effects:');
    console.log('Hearts:', ASCII_ART.PARTICLE_EFFECTS.hearts);
    console.log('Sparkles:', ASCII_ART.PARTICLE_EFFECTS.sparkles);
    console.log('Anger:', ASCII_ART.PARTICLE_EFFECTS.anger);
    
    showDivider();
    
    createScene('The Village Park');
    
    console.log('\nSample Villager Card:');
    const sampleVillager = {
      name: 'Alice',
      sprite: '😊',
      traits: ['friendly', 'artistic'],
      mood: 'happy'
    };
    showVillagerCard(sampleVillager);
    
    console.log('\n' + ASCII_ART.GAME_OVER);
  }, 1000);
}
