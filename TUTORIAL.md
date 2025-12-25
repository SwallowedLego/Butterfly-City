# Quick Start Tutorial

## Your First 5 Minutes with Butterfly City

### Step 1: Run the Demo (30 seconds)

```bash
npm start
```

This will show you a complete demo with 5 villagers and various nudges. Watch how:
- Traits affect initial relationships
- Moods change based on events
- Consequences cascade from simple actions

### Step 2: Create Your First Villager (2 minutes)

Create a new file `my-game.js`:

```javascript
import ButterflyCity from './src/index.js';
import { TRAITS, MOODS } from './src/villager.js';

const game = new ButterflyCity();

// Create a villager with specific traits
const hero = game.createVillager('Hero', [TRAITS.FRIENDLY, TRAITS.BRAVE], MOODS.HAPPY);
const sidekick = game.createVillager('Sidekick', [TRAITS.SHY, TRAITS.LOYAL], MOODS.NEUTRAL);

// Show the current state
game.render();
```

Run it:
```bash
node my-game.js
```

### Step 3: Make Your First Nudge (2 minutes)

Add to `my-game.js`:

```javascript
// Introduce them
const result = game.nudgeSystem.introduceVillagers(hero, sidekick);
game.spriteRenderer.renderConsequences(result.consequences);

// See the results
game.render();
```

### Step 4: Create Drama (1 minute)

```javascript
// Add a third villager
const rival = game.createVillager('Rival', [TRAITS.COMPETITIVE, TRAITS.JEALOUS]);

// Create a love triangle
game.nudgeSystem.introduceVillagers(hero, rival);
game.nudgeSystem.encourageRomance(rival, sidekick);

// Watch the chaos unfold!
game.render();
game.eventLogger.printRecentEvents();
```

## Common Patterns

### Pattern 1: Check Relationship Before Acting

```javascript
const alice = game.getVillager('Alice');
const bob = game.getVillager('Bob');

const relationship = alice.getRelationship(bob);
if (relationship && relationship.affinity > 50) {
  // They're good friends, safe to encourage romance
  game.nudgeSystem.encourageRomance(alice, bob);
}
```

### Pattern 2: Loop Through All Villagers

```javascript
// Find all shy villagers
const shyVillagers = game.villagers.filter(v => v.hasTrait(TRAITS.SHY));

// Introduce them to a friendly villager
const friendlyOne = game.villagers.find(v => v.hasTrait(TRAITS.FRIENDLY));
shyVillagers.forEach(shy => {
  game.nudgeSystem.introduceVillagers(shy, friendlyOne);
});
```

### Pattern 3: Create Custom Scenarios

```javascript
function createLoveStory(game) {
  const romantic1 = game.createVillager('Romeo', [TRAITS.ROMANTIC, TRAITS.ARTISTIC]);
  const romantic2 = game.createVillager('Juliet', [TRAITS.ROMANTIC, TRAITS.SHY]);
  const obstacle = game.createVillager('Paris', [TRAITS.COMPETITIVE, TRAITS.WEALTHY]);
  
  // Set up the triangle
  game.nudgeSystem.introduceVillagers(romantic1, romantic2);
  game.nudgeSystem.encourageRomance(romantic1, romantic2);
  
  game.nudgeSystem.introduceVillagers(obstacle, romantic2);
  game.nudgeSystem.encourageRomance(obstacle, romantic2);
  
  // Drama!
  return game;
}

const myGame = createLoveStory(new ButterflyCity());
myGame.render();
```

## Understanding Traits

### Social Traits
- **Friendly** - Starts with +15 affinity, makes friends easily
- **Shy** - Starts with -10 affinity, slower to warm up
- **Gossip** - 50% more effective at gossiping, bonds through sharing rumors

### Emotional Traits
- **Romantic** - Falls in love easily, may get love-struck on first meeting
- **Competitive** - Hates losing, may become rivals after competition
- **Peacemaker** - Disapproves of gossip and conflict

### Interest Traits
- **Artistic** - Bonds with other artistic/creative villagers
- **Athletic** - Enjoys competitions and physical activities
- **Bookish** - Prefers intellectual conversations

## Understanding Affinity

Affinity Scale:
- **80-100**: Soulmates/Best friends forever
- **60-79**: Romance or close friendship
- **20-59**: Good friends
- **0-19**: Friendly acquaintances
- **-1 to -19**: Slight tension
- **-20 to -39**: Dislike
- **-40 to -59**: Rivals
- **-60 to -100**: Enemies

## Tips for Creating Interesting Stories

1. **Mix Opposite Traits**: Pair shy with friendly, competitive with peacemaker
2. **Create Clusters**: Groups of 3-4 villagers create more interesting dynamics
3. **Use Gossip Strategically**: It bonds some while dividing others
4. **Romance Creates Drama**: Especially with rivals or existing relationships
5. **Competition Reveals Character**: Competitive villagers show their true colors

## Next Steps

1. Check out `src/examples.js` for more advanced patterns
2. Read `DEVELOPMENT.md` for architecture details
3. Add your own custom nudge types to `nudgeSystem.js`
4. Create custom traits in `villager.js`
5. Build a proper game loop with user input

## Troubleshooting

**Q: Villagers aren't forming relationships**
A: Make sure to introduce them first with `introduceVillagers()`

**Q: Romance nudge fails**
A: Check affinity - needs to be positive. Introduce them first!

**Q: How do I see event history?**
A: Use `game.eventLogger.printRecentEvents()` or `getAllEvents()`

**Q: Can I modify relationships directly?**
A: Yes! Use `villager.modifyAffinity(otherVillager, delta)` for fine control

**Q: How do I create custom sprites?**
A: Edit `villager.sprite` property to any emoji or character

## Have Fun!

Butterfly City is all about experimentation. Try different combinations, create chaos, orchestrate romance, or build a peaceful community. Every nudge creates ripples - see where they take you! 🦋
