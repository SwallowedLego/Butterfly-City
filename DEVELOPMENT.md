# Butterfly City Development Guide

## Architecture Overview

Butterfly City is built with a modular architecture that separates concerns:

### Core Systems

1. **Villager System** (`src/villager.js`)
   - Each villager is an independent entity with traits, moods, and relationships
   - Traits define personality (e.g., friendly, shy, competitive)
   - Moods change dynamically based on events
   - Relationships are bidirectional with affinity scores (-100 to 100)

2. **Nudge System** (`src/nudgeSystem.js`)
   - Handles all player interactions
   - Each nudge type has specific logic for consequences
   - Consequences cascade based on villager traits
   - Types of nudges:
     - `introduceVillagers()` - Create initial connections
     - `shareGossip()` - Bond through gossip, damage other relationships
     - `encourageRomance()` - Attempt to create romantic relationships
     - `startCompetition()` - Create friendly or hostile competition

3. **Event Logger** (`src/eventLogger.js`)
   - Tracks all game events in chronological order
   - Provides event filtering and querying
   - Outputs to console for visibility
   - Keeps last 100 events in memory

4. **Sprite Renderer** (`src/spriteRenderer.js`)
   - Text-based rendering using Unicode/emoji
   - Assigns sprites based on villager traits
   - Displays moods and relationships
   - Renders consequences from nudges

## Game Flow

```
Player Nudge → Immediate Effect → Trait-Based Modifiers → Cascading Consequences → Event Log
```

### Example Flow:
1. Player introduces Alice (friendly) to Bob (shy)
2. Immediate: Create relationship with base affinity
3. Trait modifiers: Alice +15 (friendly), Bob -10 (shy)
4. Final affinity: +5 (neutral acquaintances)
5. No cascading effects at low affinity
6. Event logged: "Alice and Bob meet"

## Extending the Game

### Adding New Traits

1. Add trait to `TRAITS` constant in `villager.js`
2. Add sprite mapping in `spriteRenderer.js`
3. Add trait-specific logic in nudge system methods
4. Consider interactions with existing traits

Example:
```javascript
// In villager.js
export const TRAITS = {
  // ... existing traits
  CREATIVE: 'creative'
};

// In spriteRenderer.js
'creative': SPRITES.VILLAGER_CREATIVE,

// In nudgeSystem.js - introduce method
if (villager1.hasTrait('creative') && villager2.hasTrait('artistic')) {
  initialAffinity += 20; // Creative and artistic people bond
}
```

### Adding New Nudge Types

1. Add method to `NudgeSystem` class
2. Log the nudge with eventLogger
3. Calculate consequences based on traits and relationships
4. Update relationship affinities
5. Change moods as appropriate
6. Return consequences array

Example template:
```javascript
myNewNudge(villager1, villager2) {
  this.eventLogger.log('nudge', 'Description of nudge', {
    villager1: villager1.name,
    villager2: villager2.name
  });

  const consequences = [];
  
  // Your logic here
  
  return { consequences };
}
```

### Adding New Moods

1. Add to `MOODS` constant in `villager.js`
2. Add sprite mapping in `spriteRenderer.js`
3. Consider when this mood should be triggered
4. Consider what actions this mood enables/prevents

## Data Structures

### Villager Object
```javascript
{
  id: "abc123xyz",           // Unique identifier
  name: "Alice",             // Display name
  traits: ["friendly", "artistic"],
  mood: "happy",
  relationships: Map {       // Map of villager.id -> relationship
    "xyz789": {
      villagerId: "xyz789",
      villagerName: "Bob",
      affinity: 45,
      type: "friend",
      history: []
    }
  },
  position: { x: 0, y: 0 },
  sprite: "😊"
}
```

### Event Object
```javascript
{
  id: 0,
  timestamp: 1640000000000,
  type: "nudge",
  description: "You introduce Alice to Bob",
  metadata: {
    villager1: "Alice",
    villager2: "Bob"
  }
}
```

### Consequence Object
```javascript
{
  type: "positive",  // positive, negative, neutral, romance, rivalry, chaos
  description: "Alice and Bob hit it off! (Affinity: 30)"
}
```

## Next Development Priorities

### Phase 1: Interactive Gameplay
- [ ] Add user input loop (prompt for nudge selection)
- [ ] Create menu system for choosing villagers and actions
- [ ] Add pause/unpause functionality

### Phase 2: Autonomous Behavior
- [ ] Villagers interact without player input
- [ ] Time-based mood decay/recovery
- [ ] Random events (villagers meet spontaneously)

### Phase 3: Visual Upgrade
- [ ] HTML5 Canvas rendering
- [ ] Sprite images instead of emoji
- [ ] Animation system
- [ ] Side-scrolling camera

### Phase 4: Content
- [ ] More nudge types (organize party, create conflict, etc.)
- [ ] Special events (weddings, fights, celebrations)
- [ ] Villager goals and desires
- [ ] Achievement system

## Testing

Currently no automated tests. To test:

```bash
npm start
```

Watch the demo output to verify:
- Villagers are created with correct traits
- Relationships form with appropriate affinity
- Traits affect relationship outcomes
- Moods change based on events
- Consequences are logged

## Performance Considerations

- Current implementation handles 5-10 villagers easily
- For 50+ villagers, consider:
  - Optimizing relationship lookups
  - Limiting active villagers (only those on screen)
  - Event log pruning
  - Spatial partitioning for position queries

## Code Style

- ES6 modules
- JSDoc comments for all public methods
- Descriptive variable names
- Constants in UPPER_CASE
- Classes in PascalCase
- Methods in camelCase
