# Contributing to Butterfly City

Thank you for your interest in contributing to Butterfly City! This guide will help you get started.

## Ways to Contribute

1. **Add New Features**
   - New villager traits
   - New nudge types
   - New relationship mechanics
   - Game modes or challenges

2. **Improve Existing Systems**
   - Enhance the sprite system
   - Add visual rendering (Canvas/WebGL)
   - Improve AI behavior
   - Optimize performance

3. **Documentation**
   - Add more examples
   - Improve tutorials
   - Create video guides
   - Write blog posts

4. **Bug Fixes**
   - Fix issues in relationship calculations
   - Improve edge cases
   - Handle errors gracefully

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/my-new-feature`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Code Style

### JavaScript Style
- Use ES6 modules (`import`/`export`)
- Use `const` and `let`, avoid `var`
- Descriptive variable names: `villagerAffinity` not `va`
- Classes in PascalCase: `NudgeSystem`
- Methods in camelCase: `introduceVillagers()`
- Constants in UPPER_CASE: `TRAITS.FRIENDLY`

### Comments
- JSDoc for all public methods
- Inline comments for complex logic
- TODO comments for future improvements

Example:
```javascript
/**
 * Calculate relationship affinity based on traits
 * @param {Villager} villager1 - First villager
 * @param {Villager} villager2 - Second villager
 * @returns {number} Initial affinity score (-100 to 100)
 */
function calculateAffinity(villager1, villager2) {
  let affinity = 0;
  
  // Friendly trait gives positive boost
  if (villager1.hasTrait(TRAITS.FRIENDLY)) {
    affinity += 15;
  }
  
  // TODO: Add more trait interactions
  
  return affinity;
}
```

## Adding New Traits

1. Add to `TRAITS` constant in `villager.js`:
```javascript
export const TRAITS = {
  // ... existing traits
  MUSICAL: 'musical'
};
```

2. Add sprite mapping in `spriteRenderer.js`:
```javascript
const spriteMap = {
  // ... existing sprites
  'musical': '🎵'
};
```

3. Add trait logic to relevant nudge methods in `nudgeSystem.js`:
```javascript
// In introduceVillagers method
if (villager1.hasTrait(TRAITS.MUSICAL) && villager2.hasTrait(TRAITS.MUSICAL)) {
  initialAffinity += 20; // Musical villagers bond
}
```

4. Document the trait in README.md

## Adding New Nudge Types

1. Add method to `NudgeSystem` class:
```javascript
/**
 * Your new nudge description
 * @param {Villager} villager1
 * @param {Villager} villager2
 * @returns {Object} Result with consequences
 */
myNewNudge(villager1, villager2) {
  // Log the nudge
  this.eventLogger.log('nudge', 'Description', {
    villager1: villager1.name,
    villager2: villager2.name
  });

  const consequences = [];
  
  // Your logic here
  
  // Log significant consequences
  if (/* something important */) {
    this.eventLogger.log('consequence', 'What happened');
  }
  
  return { consequences };
}
```

2. Add usage example to `examples.js`

3. Update README.md with nudge type description

## Testing Your Changes

Since there are no automated tests yet, test manually:

1. Run the demo: `npm start`
2. Create test scenarios in a new file
3. Verify edge cases (empty relationships, extreme affinity values)
4. Check that events are logged correctly
5. Ensure moods change appropriately

Example test file:
```javascript
// test-my-feature.js
import ButterflyCity from './src/index.js';
import { TRAITS } from './src/villager.js';

const game = new ButterflyCity();

// Test your feature
const v1 = game.createVillager('Test1', [TRAITS.MUSICAL]);
const v2 = game.createVillager('Test2', [TRAITS.MUSICAL]);

const result = game.nudgeSystem.myNewNudge(v1, v2);
console.log('Result:', result);

game.render();
```

## Pull Request Guidelines

### PR Title
Use descriptive titles:
- ✅ "Add musical trait and jam session nudge"
- ✅ "Fix affinity calculation for shy villagers"
- ❌ "Update code"
- ❌ "Changes"

### PR Description
Include:
1. What you changed
2. Why you changed it
3. How to test it
4. Screenshots (if visual changes)

Example:
```markdown
## What Changed
Added new "organize_concert" nudge type that brings musical villagers together.

## Why
Musical villagers had no special interactions, this adds depth to their gameplay.

## How to Test
1. Create 2+ villagers with MUSICAL trait
2. Call game.nudgeSystem.organizeConcert(host, [attendees])
3. Observe affinity increases and special consequences

## Screenshots
N/A (text-based output)
```

## Common Mistakes to Avoid

1. **Don't modify affinity without checking relationship exists**
   ```javascript
   // ❌ Bad
   villager.modifyAffinity(other, 10);
   
   // ✅ Good
   if (villager.getRelationship(other)) {
     villager.modifyAffinity(other, 10);
   }
   ```

2. **Don't forget to log significant events**
   ```javascript
   // ❌ Bad
   relationship.type = 'romance';
   
   // ✅ Good
   relationship.type = 'romance';
   this.eventLogger.log('consequence', 'Romance blooms!');
   ```

3. **Don't make affinity changes without bounds checking**
   ```javascript
   // The modifyAffinity method already bounds check, but if setting directly:
   
   // ❌ Bad
   relationship.affinity = relationship.affinity + 200; // Could exceed 100
   
   // ✅ Good
   villager.modifyAffinity(other, 200); // Automatically clamped to 100
   ```

4. **Don't forget to update both sides of relationship**
   ```javascript
   // ✅ Usually you want both sides
   villager1.modifyAffinity(villager2, 10);
   villager2.modifyAffinity(villager1, 10);
   ```

## Ideas for Contributions

### Easy (Good First Issues)
- Add new villager traits (chef, dancer, gamer, etc.)
- Add more mood states
- Create new example scenarios
- Improve documentation
- Add more emoji sprites

### Medium
- Implement save/load system
- Add autonomous villager behavior
- Create interactive input loop
- Add villager memories
- Implement time/day system

### Hard
- HTML5 Canvas rendering
- Animation system
- Pathfinding for villager movement
- Advanced AI for autonomous behavior
- Multiplayer support

### Expert
- Full game engine integration (Phaser/PixiJS)
- Procedural story generation
- Machine learning for villager behavior
- Network multiplayer
- Mobile app version

## Questions?

- Check existing code and comments
- Read DEVELOPMENT.md for architecture
- Look at examples.js for patterns
- Open an issue for discussion

## Code of Conduct

Be respectful, constructive, and helpful. This is a learning project meant to be fun and educational!

Happy coding! 🦋
