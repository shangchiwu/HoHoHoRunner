class ApiWrapper {
  /**
   * Class constructor.
   * @param {string} baseUrl - The base URL of the API
   */
  constructor(baseUrl) {
    /** @member {string} */
    this.userId = '';

    this._baseUrl = baseUrl;
    this._axios = axios.create({
      baseURL: this._baseUrl
    });
  }

  /**
   * Get text from App Inventor.
   * @returns {string} The text set by App Inventor.
   * @throws If cannot find API of App Inventor.
   */
  getAppInventorWebviewString() {
    if (window.AppInventor === undefined)
      throw new Error('Cannot find AppInventor API');
    else
      return window.AppInventor.getWebViewString();
  }

  /**
   * Send text to App Inventor.
   * @param {string} str - The text to be send.
   * @throws If cannot find API of App Inventor.
   */
  setAppInventorWebviewString(str) {
    if (window.AppInventor === undefined)
      throw new Error('Cannot find AppInventor API');
    else
      window.AppInventor.setWebViewString(str);
  }

  /**
   * Get the id of the user in this session.
   * Must call this before access any other API.
   * @returns {string} The id of the user in this session.
   */
  async getUserId() {
    const res = await this._axios.post('/', {
      action: 'getUserId'
    });
    this.userId = res.id;
    return res.id;
  }

  /**
   * Get the maze data.
   * @returns The size and walls of the maze.
   */
  async getMaze() {
    const res = await this._axios.post('/', {
      action: 'getMaze',
      id: this.userId
    });
    return {
      size: res.size,
      map: res.maze
    };
  }

  /**
   * Get the current state of the user.
   * @returns {object} The position of the user in [x, y], and direction in degree.
   */
  async getPosition() {
    const res = await this._axios.post('/', {
      action: 'getPosition',
      id: this.userId
    });
    return {
      position: res.position.map(parseFloat),
      direction: parseFloat(res.direction)
    }
  }
}

export default ApiWrapper;
