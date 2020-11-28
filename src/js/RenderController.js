import * as THREE from './library/three.module.js';

class RenderController {
  constructor() {
  }

  /** Get the DOM element of the renderer
   * @return {HTMLCanvasElement}
   */
  getRenderDom() {}

  /** Set the position of camera
   * @param {Array} position camera position in [x, y] format.
   * @param {Number} direction the direction of camera (0 ~ 359 degree).
   */
  setCamera(position, direction) {}

  /** Init the maze.
   * @param {Array} size the size of the maze in [x, y] format.
   * @param {Array} map a list of the walls in the maze.
   * [
   *   [[startX, startY], [endX, endY]], // wall 1
   *   [[startX, startY], [endX, endY]], // wall 2
   *   ...
   * ]
   */
  setMaze(size, map) {}

  /**
   * Set the size of the render window.
   * It is called when init and the size or orientation of window has been changed.
   * @param {Number} width the width of current window
   * @param {Number} height the height of current window
   */
  setWindowSize(width, height) {}

  /**
   * The render loop of the scene. This method only needs to be called once.
   */
  render() {
    //requestAnimationFrame()
    //...
  }
};

export default RenderController;
