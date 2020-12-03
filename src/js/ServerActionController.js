import ActionController from './ActionController.js';
import ApiWrapper from './ApiWrapper.js';

class ServerActionController extends ActionController {
  /**
   * Class constructor.
   * @param {ApiWrapper} apiWrapper The wrapper of backend API.
   */
  constructor(apiWrapper) {}

  /**
   * Indicate whether the update routine is running.
   * @type {boolean}
   */
  get isRunning() {}

  /**
   * Get the update rate of the state. i.e. requests per second.
   * @type {number}
   */
  get requestPerSecond() {}

  /**
   * Set the update interval of the user state.
   * @param {number} interval The interval between every request in microsecond.
   */
  setUpdateInterval(interval) {}

  /**
   * Start the update loop.
   */
  start() {}

  /**
   * Stop the update loop.
   */
  stop() {}

  /**
   * Force to request a state update from server.
   */
  async update() {}
}

export default ServerActionController;
