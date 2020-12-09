import * as THREE from './library/three.module.js';

class RenderController {
  //let ccc = 'ss';
  const scene = new THREE.Scene();
  this.scene.background = new THREE.Color('black');
  const light = new THREE.DirectionalLight(new THREE.Color('white'));
  const camera = new THREE.CubeCamera(0.1, 1000, 256);
  const renderer = new WebGLRenderer({alpha: true, antialias: true});
  this.renderer.shadowMap.enabled = true;
  //const container = document.getElementById('hohohorunner-container');
  const space = {
    geometry : new THREE.BoxGeometry(1, 1, 1),
    material : new THREE.MeshBasicMaterial({color: 0x00ff00}),
    mesh : new THREE.Mesh(geometry, material)
  }
  //container.appendChild(renderer.domElement);
  constructor() {
	
  }

  /*retccc() {
	return ccc;
  }*/
  /** Get the DOM element of the renderer
   * @return {HTMLCanvasElement}
   */
  getRenderDom() {
	return renderer.domElement;
  }

  /** Set the position of camera
   * @param {Array} position camera position in [x, y] format.
   * @param {Number} direction the direction of camera (0 ~ 359 degree).
   */
  setCamera(position, direction) {
	this.camera.position.x = position[0];
	this.camera.position.z = position[1];
	this.camera.position.y = position[2];
	this.camera.lookAt(direction);
	this.scene.add(this.camera);
  }

  /** Init the maze.
   * @param {Array} size the size of the maze in [x, y] format.
   * @param {Array} map a list of the walls in the maze.
   * [
   *   [[startX, startY], [endX, endY]], // wall 1
   *   [[startX, startY], [endX, endY]], // wall 2
   *   ...
   * ]
   */
  setMaze(size, map) {
	this.space.geometry = new THREE.BoxGeometry(size[0], size[1], 1);
	let i = 0;
	for(i in map){
	  let wall = new THREE.OBJLoader();
	  let x = map[i][0][0], y = map[i][0][1], z = map[i][0][2];
	  let x_scale = map[i][1][0] - map[i][0][0], y_scale = map[i][1][1] - map[i][0][1], z_scale = map[i][1][2] - map[i][0][2];
      wall.load('wall.obj', (obj, x, y, z) => {
	  obj.scale.set(x_scale, y_scale, z_scale);
	  obj.position.set(x, y, z);
	  scene.add(obj);
      });
	}
	this.scene.add(this.space.mesh);
  }

  /**
   * Set the size of the render window.
   * It is called when init and the size or orientation of window has been changed.
   * @param {Number} width the width of current window
   * @param {Number} height the height of current window
   */
  setWindowSize(width, height) {
	this.renderer.setSize(width, height);
  }
  

  /**
   * The render loop of the scene. This method only needs to be called once.
   */
  animate() {
	this.camera.update(this.renderer, this.scene);
	this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(animate);
    //...
  }
}

export default RenderController;
