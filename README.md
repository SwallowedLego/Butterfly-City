# 🦋 Butterfly City 🦋

A semi-god town simulation where tiny social nudges spiral into harmony, heartbreak, or total chaos

## Overview

Butterfly City is a 2D side-scroller simulation game where you play as an invisible force, gently nudging villagers to interact. Watch as small interventions create cascading consequences - friendships bloom, romances ignite, rivalries form, and chaos ensues!

## Features

✨ **Dynamic Villagers**
- Unique personality traits (friendly, shy, competitive, romantic, etc.)
- Moods that change based on events
- Complex relationship system with affinity scores
- Individual emoji sprites reflecting their primary trait

💫 **Nudge System**
- Introduce villagers to each other
- Encourage romantic gestures
- Share gossip (for better or worse)
- Set up friendly competitions
- Watch consequences cascade based on personality traits

📜 **Event Logging**
- Track every interaction and consequence
- See how your nudges ripple through the community
- Review the story of your town

🎮 **Simple Sprite System**
- Text-based visualization using emoji
- See villager moods at a glance
- Track relationships (friends 💚, romance 💖, rivals ⚡)

## Quick Start

### Prerequisites
- Node.js 18+ (for ES6 module support)

### Installation

```bash
# Clone the repository
git clone https://github.com/SwallowedLego/Butterfly-City.git
cd Butterfly-City

# No dependencies needed - pure JavaScript!
```

### Run the Demo

```bash
npm start
```

This runs an interactive demo showing:
- 5 villagers with different personality combinations
- Various nudge types and their consequences
- How traits affect relationship outcomes
- Cascading effects (romance, rivalry, friendship)
- Complete event history

## Game Mechanics

### Villager Traits

Each villager has traits that determine their behavior:

- **Friendly** 😊 - Forms positive relationships easily
- **Shy** 😳 - More cautious in new relationships
- **Romantic** 💝 - Prone to developing romantic feelings
- **Competitive** 🏆 - Doesn't take losing well
- **Gossip** 💬 - Gossip is more effective
- **Peacemaker** ☮️ - Disapproves of gossip and conflict
- **Artistic** 🎨 - Bonds with other creative types
- **Athletic** ⚽ - Enjoys physical activities
- **Bookish** 📚 - Prefers intellectual pursuits
- **Rebellious** 😎 - Unpredictable and independent

### Relationship Types

- **Friend** (💚) - Positive affinity (20-60)
- **Romance** (💖) - Strong positive affinity (60+) with romantic intent
- **Rival** (⚡) - Negative affinity (-40 or worse)
- **Neutral** (➖) - Acquaintances (-20 to 20)

Affinity ranges from -100 (enemies) to +100 (soulmates)

### Nudge Types

1. **Introduce Villagers**
   - Creates initial relationship
   - Affinity based on trait compatibility
   - May trigger love at first sight for romantic types

2. **Share Gossip**
   - Bonds gossiper and listener
   - Damages relationship with subject
   - Can create rivalries
   - Peacemakers disapprove

3. **Encourage Romance**
   - Success depends on existing affinity
   - Can lead to romance or awkwardness
   - May trigger jealousy cascades

4. **Start Competition**
   - Random winner determined
   - Competitive types become rivals if they lose
   - Friendly types bond regardless of outcome

## Project Structure

```
Butterfly-City/
├── src/
│   ├── index.js          # Main game entry point & demo
│   ├── villager.js       # Villager class with traits, moods, relationships
│   ├── nudgeSystem.js    # Player interaction system
│   ├── eventLogger.js    # Event tracking and history
│   └── spriteRenderer.js # Text-based visualization
├── package.json
├── README.md
└── DEVELOPMENT.md        # Architecture & extension guide
```

## Example Output

```
🦋 WELCOME TO BUTTERFLY CITY 🦋

=== Creating Villagers ===

================================================================================
                                 BUTTERFLY CITY
================================================================================

😊 Alice 😊 [happy]
   Traits: friendly, artistic
   Relationships:

🦋 Bob 😐 [neutral]
   Traits: shy, bookish
   Relationships:

💝 Carol 🤩 [excited]
   Traits: romantic, gossip
   Relationships:
...

=== NUDGE 1: Introduce Alice and Bob ===
[NUDGE] You introduce Alice to Bob

--- CONSEQUENCES ---
1. ✅ Alice and Bob hit it off! (Affinity: 30)
-------------------
...
```

## Next Steps

This is a **starter implementation** with core systems in place. To build a full game:

### Short Term
- [ ] Add interactive menu for player input
- [ ] More nudge types (organize party, break up relationship, etc.)
- [ ] Save/load game state
- [ ] More villager traits and combinations

### Medium Term
- [ ] Autonomous villager behavior (they interact without nudges)
- [ ] Time system with day/night cycles
- [ ] Villager schedules and routines
- [ ] Locations (homes, cafe, park, etc.)
- [ ] Goals and achievements

### Long Term
- [ ] HTML5 Canvas or game engine integration (Phaser, PixiJS)
- [ ] Actual sprite graphics and animations
- [ ] Side-scrolling camera system
- [ ] Sound effects and music
- [ ] Special story events and quests

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed architecture and extension guide.

## Contributing

This is a starter repo meant for learning and experimentation. Feel free to:
- Add new traits and behaviors
- Create new nudge types
- Improve the rendering system
- Add autonomous villager AI
- Build a proper game loop

## License

MIT License - Feel free to use this as a starting point for your own projects!

## Credits

Created as a demonstration of:
- Object-oriented game design
- Emergent gameplay from simple rules
- Cascading consequence systems
- Social simulation mechanics

---

*"In Butterfly City, every choice creates ripples. What kind of town will you create?"* 🦋
