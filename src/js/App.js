import ApiWrapper from './apiWrapper.js';
import RenderController from './RenderController.js';
import ServerActionController from './ServerActionController.js';
import config from '../config.js';

class App {
  constructor() {
    this._apiWrapper = null;
    this._serverActionController = null;
    this._renderController = null;
    this._userState = null;
    this._stateUpdateHandler = null;
  }

  /**
   * Run entire application.
   * @async
   */
  async run() {
    await this._initApi();
    await this._initActionController();
    await this._initRenderController();
    this._startGameLoop();
  }

  /**
   * Init server side and AppInventor.
   * @async
   */
  async _initApi() {
    this._apiWrapper = new ApiWrapper(config.server.apiBaseUrl);
    const userId = await this._apiWrapper.getUserId();
    try {
      this._apiWrapper.setAppInventorWebviewString(userId);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  /**
   * Init action controller.
   * @async
   */
  async _initActionController() {
    this._serverActionController = new ServerActionController(this._apiWrapper);
    this._serverActionController.setUpdateInterval(config.server.positionUpdateInterval);

    // fetch first state from server.
    await this._serverActionController.update();
    this._userState = this._serverActionController.getState();
  }

  /**
   * Init render routine.
   * @async
   */
  async _initRenderController() {
    this._renderController = new RenderController();
    await this._renderController.init();

    // set size of render window
    this._resizeWindow();
    window.addEventListener('resize', () => { this._resizeWindow(); });
    window.addEventListener('orientationchange', () => { this._resizeWindow(); });

    // mount render canvas
    const renderDom = this._renderController.getRenderDom();
    document.querySelector('#hohohorunner-container').appendChild(renderDom);

    // set scene
    const maze = await this._apiWrapper.getMaze();
    this._renderController.setMaze(maze.size, maze.map);
    const state = this._userState;
    this._renderController.setCamera(state.position, state.direction);
  }

  /**
   * Resize handler for the render canvas.
   */
  _resizeWindow() {
    this._renderController.setWindowSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Start the loop of render and fetch data from server.
   */
  _startGameLoop() {
    // set state update handler
    this._stateUpdateHandler = state => {
      this._renderController.setCamera(state.position, state.direction);
    };
    this._serverActionController.addUpdateListener(this._stateUpdateHandler);

    // start position update routine
    this._serverActionController.start();

    // start render loop
    this._renderController.animate();
  }
}

export default App;
