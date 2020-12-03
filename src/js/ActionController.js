class ActionController {
  /**
   * Class constructor.
   */
  constructor() {
    /** @protected {Object} */
    this._state = null;
  }

  /**
   * Set the state of the user.
   * @param {Object} state The new state of the user.
   */
  setState(state) {
    this._state = state;
  }

  /**
   * Get the state of the user.
   * @returns {Object} The state of the user.
   */
  getState() {
    return this._state;
  }
}

export default ActionController;
