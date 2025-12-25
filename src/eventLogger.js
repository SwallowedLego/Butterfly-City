/**
 * EventLogger tracks all events that occur in Butterfly City
 * This allows players to see the cascade of consequences from their nudges
 */
export class EventLogger {
  constructor() {
    this.events = [];
    this.maxEvents = 100; // Keep last 100 events
    this.listeners = new Set();
  }

  /**
   * Log a new event
   * @param {string} type - Event type ('nudge', 'relationship_change', 'mood_change', 'consequence')
   * @param {string} description - Human-readable description
   * @param {Object} metadata - Additional event data
   */
  log(type, description, metadata = {}) {
    const event = {
      id: this.events.length,
      timestamp: Date.now(),
      type: type,
      description: description,
      metadata: metadata
    };

    this.events.push(event);

    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Notify subscribers (UI hooks, analytics, etc.)
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        // Avoid crashing the logger because of a subscriber failure
        console.error('EventLogger subscriber error:', err);
      }
    });

    // Also print to console for visibility
    console.log(`[${type.toUpperCase()}] ${description}`);

    return event;
  }

  /**
   * Get recent events
   * @param {number} count - Number of recent events to retrieve
   * @returns {Array} Recent events
   */
  getRecentEvents(count = 10) {
    return this.events.slice(-count);
  }

  /**
   * Get all events of a specific type
   * @param {string} type - Event type to filter by
   * @returns {Array} Filtered events
   */
  getEventsByType(type) {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get all events
   * @returns {Array} All logged events
   */
  getAllEvents() {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = [];
  }

  /**
   * Subscribe to new events (useful for UIs)
   * @param {(event: object) => void} listener
   * @returns {() => void} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  /**
   * Remove an event listener
   * @param {(event: object) => void} listener
   */
  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Print a formatted event log to console
   * @param {number} count - Number of recent events to display
   */
  printRecentEvents(count = 10) {
    console.log('\n=== Recent Events ===');
    const recent = this.getRecentEvents(count);
    recent.forEach((event, index) => {
      console.log(`${index + 1}. [${event.type}] ${event.description}`);
    });
    console.log('=====================\n');
  }
}
