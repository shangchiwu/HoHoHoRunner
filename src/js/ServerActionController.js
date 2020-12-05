import ActionController from './ActionController.js';
import ApiWrapper from './ApiWrapper.js';

class ServerActionController extends ActionController {
  /**
   * Class constructor.
   * @param {ApiWrapper} apiWrapper The wrapper of backend API.
   */
  constructor(apiWrapper) {
    super();
    this._apiWrapper = apiWrapper;
    this._updateInterval = 500;
    this._updateTimer = null;
    this._lastUpdateTimestamp = null;
    this._avgUpdateInterval = null;
    this._avgNetworkDelay = null;
  }

  /**
   * Indicate whether the update routine is running.
   * @type {boolean}
   */
  get isRunning() {
    return this._updateTimer === null;
  }

  /**
   * The exupdate rate of the state. i.e. requests per second. (exponential smoothed)
   * @type {number}
   */
  get averageRequestPerSecond() {
    if (this._avgUpdateInterval === null)
      return 0;
    return 1000 / this._avgUpdateInterval;
  }

  /**
   * The average of network delay. (exponential smoothed)
   * @type {number}
   */
  get averageNetworkDelay() {
    return this._avgNetworkDelay;
  }

  /**
   * Set the update interval of the user state.
   * @param {number} interval The interval between every request in microsecond.
   */
  setUpdateInterval(interval) {
    this._updateInterval = interval;
  }

  /**
   * Start the update loop.
   */
  start() {
    this._lastUpdateTimestamp = null;
    this._avgNetworkDelay = null;
    this.update();
  }

  /**
   * Stop the update loop.
   */
  stop() {
    if (this._updateTimer !== null) {
      clearTimeout(this._updateTimer);
      this._updateTimer = null;
    }
  }

  /**
   * Force to request a state update from server.
   */
  async update() {
    // schedule next update
    const nextUpdateTimer = setTimeout(() => { this.update(); }, this._updateInterval);

    // clear original scheduled timer
    clearTimeout(this._updateTimer);
    this._updateTimer = nextUpdateTimer;

    // fetch new state
    const sendTimestamp = performance.now();
    const newState = await this._apiWrapper.getPosition();
    const networkDelay = performance.now() - sendTimestamp;

    // check whether current update is canceled
    if (this._updateTimer !== nextUpdateTimer)
      return;
    
    // update state
    this._state = newState;

    // compute statistics
    const now = performance.now();
    if (this._lastUpdateTimestamp !== null) {
      const interval = now - this._lastUpdateTimestamp;
      if (this._avgUpdateInterval === null)
        this._avgUpdateInterval = interval;
      else
        this._avgUpdateInterval = this._avgUpdateInterval + 0.8 * (interval - this._avgUpdateInterval);
    }
    this._lastUpdateTimestamp = now;

    if (this._avgNetworkDelay === null)
      this._avgNetworkDelay = networkDelay;
    else
      this._avgNetworkDelay = this._avgNetworkDelay + 0.8 * (networkDelay - this._avgNetworkDelay);
  }
}

export default ServerActionController;
