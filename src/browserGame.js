import ButterflyCity from './index.js';
import { TRAITS, MOODS } from './villager.js';

/**
 * Lightweight browser renderer for Butterfly City.
 * Uses canvas + vanilla JS to keep the prototype dependency-free.
 */
const DEFAULT_VILLAGERS = [
  { name: 'Alice', traits: [TRAITS.FRIENDLY, TRAITS.ARTISTIC], mood: MOODS.HAPPY },
  { name: 'Bob', traits: [TRAITS.SHY, TRAITS.BOOKISH], mood: MOODS.NEUTRAL },
  { name: 'Carol', traits: [TRAITS.ROMANTIC, TRAITS.GOSSIP], mood: MOODS.EXCITED },
  { name: 'Dave', traits: [TRAITS.COMPETITIVE, TRAITS.ATHLETIC], mood: MOODS.NEUTRAL },
  { name: 'Eve', traits: [TRAITS.PEACEMAKER, TRAITS.FRIENDLY], mood: MOODS.HAPPY }
];

const EFFECT_FROM_CONSEQUENCE = {
  romance: 'hearts',
  rivalry: 'anger',
  chaos: 'fire',
  negative: 'tears',
  positive: 'sparkles'
};

class BrowserGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.city = new ButterflyCity();
    this.villagers = [];
    this.visualState = new Map();
    this.screenPositions = new Map();
    this.worldWidth = 2400;
    this.groundY = this.canvas.height - 70;
    this.cameraX = 0;
    this.lastTime = performance.now();
    this.houses = this._buildHouses();
    this.selectedPrimary = null;
    this.selectedSecondary = null;
    this.selectedSubject = null;

    this.eventFeed = document.getElementById('event-feed');
    this.villagerList = document.getElementById('villager-list');
    this.selectionLabel = document.getElementById('selection-label');
    this.hint = document.getElementById('hint');
    this.subjectSelect = document.getElementById('subject-select');

    this._spawnInitialVillagers();
    this._bindUI();
    this.city.eventLogger.subscribe((event) => this._pushEvent(event));

    requestAnimationFrame((time) => this._loop(time));
  }

  _buildHouses() {
    const houses = [];
    for (let i = 0; i < 6; i++) {
      houses.push({
        x: 140 + i * 380 + Math.random() * 60,
        width: 140 + Math.random() * 40,
        height: 120 + Math.random() * 30,
        color: `hsl(${20 + i * 30}, 60%, 65%)`
      });
    }
    return houses;
  }

  _spawnInitialVillagers() {
    DEFAULT_VILLAGERS.forEach((data, index) => {
      const villager = this.city.createVillager(
        data.name,
        data.traits,
        data.mood
      );
      const startX = 120 + index * 180;
      const startY = this.groundY - 10;
      villager.setPosition(startX, startY);

      this.villagers.push(villager);
      this.visualState.set(villager.id, {
        x: startX,
        y: startY,
        targetX: startX,
        speed: 55 + Math.random() * 35,
        idleTimer: 1 + Math.random() * 2,
        effect: null
      });
    });
    this._refreshVillagerUI();
  }

  _bindUI() {
    this.canvas.addEventListener('click', (ev) => this._handleCanvasClick(ev));

    document
      .getElementById('btn-introduce')
      .addEventListener('click', () => this._runIntroduce());
    document
      .getElementById('btn-gossip')
      .addEventListener('click', () => this._runGossip());
    document
      .getElementById('btn-romance')
      .addEventListener('click', () => this._runRomance());
    document
      .getElementById('btn-compete')
      .addEventListener('click', () => this._runCompetition());
    this.subjectSelect.addEventListener('change', (ev) => {
      const chosen = this.villagers.find((v) => v.id === ev.target.value);
      if (chosen) this.selectedSubject = chosen;
    });
  }

  _handleCanvasClick(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;
    const clickY = ev.clientY - rect.top;

    const hit = this.villagers.find((villager) => {
      const pos = this.screenPositions.get(villager.id);
      if (!pos) return false;
      return (
        clickX >= pos.x - 14 &&
        clickX <= pos.x + 14 &&
        clickY >= pos.y - 40 &&
        clickY <= pos.y
      );
    });

    if (hit) {
      this._selectVillager(hit);
      this._refreshVillagerUI();
    }
  }

  _loop(timestamp) {
    const delta = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;
    this._update(delta);
    this._render();
    requestAnimationFrame((t) => this._loop(t));
  }

  _update(delta) {
    this.villagers.forEach((villager) => {
      const state = this.visualState.get(villager.id);

      state.idleTimer -= delta;
      if (state.idleTimer <= 0) {
        const randomHouse = this.houses[Math.floor(Math.random() * this.houses.length)];
        state.targetX = randomHouse.x + randomHouse.width / 2 + (Math.random() * 40 - 20);
        state.idleTimer = 2.5 + Math.random() * 2.5;
      }

      const dir = Math.sign(state.targetX - state.x);
      if (Math.abs(state.targetX - state.x) > 2) {
        state.x += dir * state.speed * delta;
      }

      if (state.effect) {
        state.effect.timer -= delta;
        if (state.effect.timer <= 0) state.effect = null;
      }

      villager.setPosition(state.x, state.y);
    });

    if (this.selectedPrimary) {
      this.cameraX = Math.max(
        0,
        Math.min(
          this.selectedPrimary.position.x - this.canvas.width / 2,
          this.worldWidth - this.canvas.width
        )
      );
    }
  }

  _renderBackground() {
    const { ctx } = this;
    const sky = ctx.createLinearGradient(0, 0, 0, this.groundY);
    sky.addColorStop(0, '#bce5ff');
    sky.addColorStop(1, '#9ed5ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#7ac36a';
    ctx.fillRect(0, this.groundY, this.canvas.width, 80);

    this.houses.forEach((house) => {
      const x = house.x - this.cameraX;
      ctx.fillStyle = house.color;
      ctx.fillRect(x, this.groundY - house.height, house.width, house.height);
      ctx.fillStyle = '#333';
      ctx.fillRect(x + house.width / 2 - 12, this.groundY - 30, 24, 30);
      ctx.fillStyle = '#eee';
      ctx.fillRect(x + house.width / 2 - 20, this.groundY - house.height + 20, 12, 16);
      ctx.fillRect(x + house.width / 2 + 8, this.groundY - house.height + 20, 12, 16);
    });
  }

  _renderVillager(villager) {
    const state = this.visualState.get(villager.id);
    const { ctx } = this;
    const screenX = state.x - this.cameraX;
    const screenY = this.groundY - 8;

    this.screenPositions.set(villager.id, { x: screenX, y: screenY });

    const primaryTrait = villager.traits[0] || 'default';
    const color = this._colorForTrait(primaryTrait);

    ctx.save();
    ctx.translate(screenX, screenY);

    ctx.fillStyle = color;
    ctx.fillRect(-12, -34, 24, 26); // body
    ctx.fillStyle = '#f6e7d7';
    ctx.fillRect(-10, -46, 20, 12); // head

    ctx.fillStyle = '#000';
    ctx.fillRect(-6, -42, 4, 3);
    ctx.fillRect(2, -42, 4, 3);

    const moodColor = this._moodTint(villager.mood);
    ctx.strokeStyle = moodColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(-14, -48, 28, 42);

    if (
      (this.selectedPrimary && this.selectedPrimary.id === villager.id) ||
      (this.selectedSecondary && this.selectedSecondary.id === villager.id)
    ) {
      ctx.strokeStyle = '#ffef7a';
      ctx.lineWidth = 3;
      ctx.strokeRect(-16, -50, 32, 46);
    }

    const effect = state.effect;
    if (effect) {
      this._renderEffect(ctx, effect.type);
    }

    ctx.restore();
  }

  _renderEffect(ctx, type) {
    ctx.save();
    if (type === 'hearts') {
      ctx.fillStyle = '#ff6fa9';
      ctx.font = '16px sans-serif';
      ctx.fillText('💕', -8, -56);
    } else if (type === 'anger') {
      ctx.fillStyle = '#ff3b30';
      ctx.font = '18px sans-serif';
      ctx.fillText('💢', -6, -56);
    } else if (type === 'tears') {
      ctx.fillStyle = '#4da6ff';
      ctx.font = '18px sans-serif';
      ctx.fillText('😢', -8, -56);
    } else if (type === 'fire') {
      ctx.fillStyle = '#ff9f0a';
      ctx.font = '18px sans-serif';
      ctx.fillText('🔥', -8, -56);
    } else {
      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.fillText('✨', -8, -56);
    }
    ctx.restore();
  }

  _render() {
    this._renderBackground();
    this.villagers.forEach((villager) => this._renderVillager(villager));
  }

  _pushEvent(event) {
    const div = document.createElement('div');
    div.className = `log-line log-${event.type}`;
    div.textContent = `[${event.type}] ${event.description}`;
    this.eventFeed.prepend(div);
    while (this.eventFeed.childElementCount > 18) {
      this.eventFeed.removeChild(this.eventFeed.lastElementChild);
    }
  }

  _refreshVillagerUI() {
    this.villagerList.innerHTML = '';
    this.subjectSelect.innerHTML = '';

    this.villagers.forEach((villager) => {
      const card = document.createElement('button');
      card.className = 'villager-card';
      card.innerHTML = `<strong>${villager.name}</strong><span>${villager.traits.join(', ')}</span><small>Mood: ${villager.mood}</small>`;
      card.addEventListener('click', () => this._selectVillager(villager));
      this.villagerList.appendChild(card);

      const option = document.createElement('option');
      option.value = villager.id;
      option.textContent = villager.name;
      this.subjectSelect.appendChild(option);
    });

    this.selectedSubject = this.selectedSubject || this.villagers[0];
    this.subjectSelect.value = this.selectedSubject.id;

    this._updateSelectionLabel();
  }

  _updateSelectionLabel() {
    const primary = this.selectedPrimary ? this.selectedPrimary.name : 'None';
    const secondary = this.selectedSecondary ? this.selectedSecondary.name : 'None';
    this.selectionLabel.textContent = `Selected: ${primary} ${secondary !== 'None' ? ' + ' + secondary : ''}`;
  }

  _selectVillager(villager) {
    if (!this.selectedPrimary || this.selectedPrimary.id === villager.id) {
      this.selectedPrimary = villager;
    } else if (!this.selectedSecondary || this.selectedSecondary.id === villager.id) {
      this.selectedSecondary = villager;
    } else {
      this.selectedPrimary = villager;
      this.selectedSecondary = null;
    }
    this.selectedSubject = this.selectedSubject || villager;
    this._updateSelectionLabel();
  }

  _runIntroduce() {
    const pair = this._ensurePair();
    if (!pair) return;
    const result = this.city.nudgeSystem.introduceVillagers(pair.a, pair.b);
    this._markEffect(pair.a, pair.b, result.consequences);
    this._pullTogether(pair.a, pair.b);
  }

  _runGossip() {
    const pair = this._ensurePair();
    if (!pair) return;
    const subject = this._ensureSubject(pair);
    if (!subject) return;
    const result = this.city.nudgeSystem.shareGossip(pair.a, pair.b, subject);
    this._markEffect(pair.a, pair.b, result.consequences);
    this._pullTogether(pair.a, pair.b, subject);
  }

  _runRomance() {
    const pair = this._ensurePair();
    if (!pair) return;
    const result = this.city.nudgeSystem.encourageRomance(pair.a, pair.b);
    this._markEffect(pair.a, pair.b, result.consequences);
    this._pullTogether(pair.a, pair.b);
  }

  _runCompetition() {
    const pair = this._ensurePair();
    if (!pair) return;
    const result = this.city.nudgeSystem.startCompetition(pair.a, pair.b);
    this._markEffect(pair.a, pair.b, result.consequences);
    this._pullTogether(pair.a, pair.b);
  }

  _ensurePair() {
    if (!this.selectedPrimary || !this.selectedSecondary) {
      this._flashHint('Select two villagers (click canvas or list).');
      return null;
    }
    return { a: this.selectedPrimary, b: this.selectedSecondary };
  }

  _ensureSubject(pair) {
    let subject = this.selectedSubject;
    if (subject && subject.id !== pair.a.id && subject.id !== pair.b.id) {
      return subject;
    }
    subject = this.villagers.find(
      (v) => v.id !== pair.a.id && v.id !== pair.b.id
    );
    if (!subject) {
      this._flashHint('Need a different villager as gossip subject.');
      return null;
    }
    this.selectedSubject = subject;
    this.subjectSelect.value = subject.id;
    return subject;
  }

  _pullTogether(a, b, c) {
    const targets = [a, b, c].filter(Boolean);
    const center =
      targets.reduce((sum, villager) => sum + this.visualState.get(villager.id).x, 0) /
      targets.length;
    targets.forEach((villager) => {
      const state = this.visualState.get(villager.id);
      state.targetX = center + (Math.random() * 24 - 12);
      state.idleTimer = 2;
    });
  }

  _markEffect(a, b, consequences) {
    const villagers = [a, b];
    consequences.forEach((c) => {
      const effectType = EFFECT_FROM_CONSEQUENCE[c.type];
      if (effectType) villagers.forEach((v) => this._setEffect(v, effectType));
    });
  }

  _setEffect(villager, type) {
    const state = this.visualState.get(villager.id);
    state.effect = { type, timer: 1.8 };
  }

  _flashHint(text) {
    this.hint.textContent = text;
    this.hint.classList.add('active');
    setTimeout(() => this.hint.classList.remove('active'), 1600);
  }

  _colorForTrait(trait) {
    const palette = {
      [TRAITS.FRIENDLY]: '#6fcf97',
      [TRAITS.SHY]: '#9b9b9b',
      [TRAITS.ARTISTIC]: '#c084fc',
      [TRAITS.ATHLETIC]: '#56ccf2',
      [TRAITS.BOOKISH]: '#f2c94c',
      [TRAITS.REBELLIOUS]: '#eb5757',
      [TRAITS.ROMANTIC]: '#f78fb3',
      [TRAITS.COMPETITIVE]: '#f2994a',
      [TRAITS.GOSSIP]: '#bb6bd9',
      [TRAITS.PEACEMAKER]: '#6ddccf',
      default: '#8ecae6'
    };
    return palette[trait] || palette.default;
  }

  _moodTint(mood) {
    const tints = {
      [MOODS.HAPPY]: '#ffe066',
      [MOODS.SAD]: '#8ab4f8',
      [MOODS.ANGRY]: '#ff6b6b',
      [MOODS.EXCITED]: '#ffb347',
      [MOODS.ANXIOUS]: '#b0c4de',
      [MOODS.NEUTRAL]: '#d0d7de',
      [MOODS.LOVE_STRUCK]: '#ff9ecd',
      [MOODS.JEALOUS]: '#b5e48c'
    };
    return tints[mood] || '#d0d7de';
  }
}

// Bootstrap once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new BrowserGame();
});
