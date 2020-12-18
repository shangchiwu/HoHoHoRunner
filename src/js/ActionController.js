class ActionController {
  /**
   * Class constructor.
   */
  constructor() {
    /** @protected {Object} */
    this._state = null;
    this._callbacks = [];
  }

  /**
   * Set the state of the user and run callbacks.
   * @param {Object} state The new state of the user.
   */
  setState(state) {
    this._state = state;
    for (const callback of this._callbacks)
      callback(this._state);
  }

  /**
   * Get the state of the user.
   * @returns {Object} The state of the user.
   */
  getState() {
    return this._state;
  }
  
  /**
   * Add a callback to listen to the changes of the state.
   * The new state will be passed through the first parameter of the callback.
   * @param {function(Object)} callback The handler to be add.
   */
  addUpdateListener(callback) {
    this._callbacks.push(callback);
  }
  
  /**
   * Remove a callback which listen to the changes of the state.
   * @param {function(Object)} callback The handler to be removed.
   */
  removeUpdateListener(callback) {
    const index = this._callbacks.indexOf(callback);
    if (index !== -1)
      this._callbacks.splice(index, 1);
  }
}

export default ActionController;
