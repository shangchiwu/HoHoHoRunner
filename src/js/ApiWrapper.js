class ApiWrapper {
  /**
   * Class constructor.
   * @param {string} baseUrl - The base URL of the API
   */
  constructor(baseUrl) {
    /** @member {string} */
    this.userId = getUserId();
  }

  /**
   * Get text from App Inventor.
   * @returns {string} The text set by App Inventor.
   * @throws If cannot find API of App Inventor.
   */
  getAppInventorWebviewString() {}

  /**
   * Send text to App Inventor.
   * @param {string} str - The text to be send.
   * @throws If cannot find API of App Inventor.
   */
  setAppInventorWebviewString(str) {}

  /**
   * Get the id of the user in this session.
   * This method will be called in constructor.
   * @returns {string} The id of the user in this session.
   */
  getUserId() {}

  /**
   * Get the maze data.
   * @returns The size and walls of the maze.
   */
  getMaze() {}

  /**
   * Get the current state of the user.
   * @returns {object} The position of the user in [x, y], and direction in degree.
   */
  getPosition() {}
}

export default ApiWrapper;
