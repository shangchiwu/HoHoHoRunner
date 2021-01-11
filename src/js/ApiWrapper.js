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
   * @throws {ApiAccessError} If cannot find API of App Inventor.
   */
  getAppInventorWebviewString() {
    let data;
    try {
      data = window.AppInventor.getWebViewString();
    } catch {
      throw new ApiAccessError(`Cannot access 'getWebViewString' AppInventor API`);
    }
    return data;
  }

  /**
   * Send text to App Inventor.
   * @param {string} str - The text to be send.
   * @throws {ApiAccessError} If cannot find API of App Inventor.
   */
  setAppInventorWebviewString(str) {
    try {
      window.AppInventor.setWebViewString(str);
    } catch {
      throw new ApiAccessError(`Cannot access 'setWebViewString' AppInventor API`);
    }
  }

  /**
   * Get the id of the user in this session.
   * Must call this before access any other API.
   * @async
   * @returns {Promise<string>} The id of the user in this session.
   * @throws {ApiAccessError} If network error or incorrect API format.
   */
  async getUserId() {
    let res;
    try {
      res = await this._axios.post('', {
        action: 'getUserId'
      });
    } catch {
      throw new ApiAccessError(`Cannot access 'getUserId' API.`);
    }
    this.userId = res.data.id;
    return this.userId;
  }

  /**
   * Get the maze data.
   * @async
   * @returns {Promise<Object>} The size and walls of the maze.
   * @throws {ApiAccessError} If network error or incorrect API format.
   */
  async getMaze() {
    let res;
    try {
      res = await this._axios.post('', {
        action: 'getMaze',
        id: this.userId
      });
    } catch {
      throw new ApiAccessError(`Cannot access 'getMaze' API.`);
    }
    return {
      size: res.data.size,
      map: res.data.map
    };
  }

  /**
   * Get the current state of the user.
   * @async
   * @returns {Promise<Object>} The position of the user in [x, y], and direction in degree.
   * @throws {ApiAccessError} If net error or incorrect API format.
   */
  async getPosition() {
    let res;
    try {
      res = await this._axios.post('', {
        action: 'getPosition',
        id: this.userId
      });
    } catch {
      throw new ApiAccessError(`Cannot access 'getPosition' API.`);
    }
    return {
      position: res.data.position,
      direction: res.data.direction
    }
  }
}

class ApiAccessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiAccessError';
  }
}

export default ApiWrapper;
export { ApiAccessError };
