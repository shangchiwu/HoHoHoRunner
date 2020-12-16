import * as THREE from './library/three.module.js';

class RenderController {
  constructor() {
    // init scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a6bdc);
    
    // init light
    const directionLight = new THREE.DirectionalLight(new THREE.Color('white'));
    directionLight.position.z = 1;
    this.scene.add(directionLight);
    const ambientLight = new THREE.AmbientLight(new THREE.Color('white'));
    this.scene.add(ambientLight);

    // init camera
    this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.01, 10000);
    this.camera.position.y = 0.5;
    this.scene.add(this.camera);

    // init renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.shadowMap.enabled = true;
  }

  /** Get the DOM element of the renderer
   * @return {HTMLCanvasElement}
   */
  getRenderDom() {
	  return this.renderer.domElement;
  }

  /** Set the position of camera
   * @param {number[]} position camera position in [x, y] format.
   * @param {number} direction the direction of camera (0 ~ 359 degree).
   */
  setCamera([x, y], direction) {
    // move camera
    this.camera.position.x = x;
    this.camera.position.z = y;

    // compute look at
    const lookPoint = new THREE.Vector3(0, 0, -1)
      .applyAxisAngle(THREE.Object3D.DefaultUp, -1 * THREE.Math.degToRad(direction))
      .add(this.camera.position);
    this.camera.lookAt(lookPoint);
    this.camera.updateProjectionMatrix();
  }

  /** Init the maze.
   * @param {number[]} size the size of the maze in [x, y] format.
   * @param {number[][][]} map a list of the walls in the maze.
   * [
   *   [[startX, startY], [endX, endY]], // wall 1
   *   [[startX, startY], [endX, endY]], // wall 2
   *   ...
   * ]
   */
  setMaze([sizeX, sizeY], map) {
    // init floor
    const floorPlaneGeomatry = new THREE.PlaneGeometry(sizeX, sizeY);
    const floorPlaneMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const floorPlaneMesh = new THREE.Mesh(floorPlaneGeomatry, floorPlaneMaterial);
    floorPlaneMesh.rotateX(-1 * Math.PI / 2);
    floorPlaneMesh.position.x = sizeX / 2;
    floorPlaneMesh.position.z = sizeY / 2;
    this.scene.add(floorPlaneMesh);

    // add wall
    map.forEach(wall => this._placeWall(wall));
  }

  /**
   * Set the size of the render window.
   * It is called when init and the size or orientation of window has been changed.
   * @param {number} width the width of current window
   * @param {number} height the height of current window
   */
  setWindowSize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * The render loop of the scene. This method only needs to be called once.
   */
  animate() {
    requestAnimationFrame(() => { this.animate(); });
    this.renderer.render(this.scene, this.camera);
  }

  _placeWall([[startX, startY], [endX, endY]]) {
    // make mesh
    const wallHeigh = 1;
    const wallThickness = 0.1;
    const direction = new THREE.Vector3(endX - startX, 0, endY - startY);
    const length = direction.length();
    const angle = (new THREE.Vector3(1, 0, 0)).angleTo(direction);
    const wallGeometry = new THREE.BoxGeometry(length + wallThickness, wallHeigh, wallThickness);
    const wallMaterial = new THREE.MeshPhongMaterial({color: 0xcc8833});
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    // move and rotate
    wallMesh.rotateY(angle);
    wallMesh.position.y = wallHeigh / 2;
    wallMesh.position.x += startX + direction.x / 2;
    wallMesh.position.z += startY + direction.z / 2;

    // add to scene
    this.scene.add(wallMesh);
  }
}

export default RenderController;
