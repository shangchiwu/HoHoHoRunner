import * as THREE from './library/three.module.js';

const texturePath = {
  brickWall: {
    map: './texture/Brick_Wall_017_basecolor.jpg',
    normalMap: './texture/Brick_Wall_017_normal.jpg',
    // displacementMap: './texture/Brick_Wall_017_height.jpg',
  },
  rockGround: {
    map: './texture/rocks_ground_08_diff_1k.jpg',
    normalMap: './texture/rocks_ground_08_nor_1k.jpg',
    displacementMap: './texture/rocks_ground_08_disp_1k.jpg',
  }
};

class RenderController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.textures = {};
  }

  /**
   * Init the entire renderer
   */
  async init() {
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
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 10000);
    this.camera.position.y = 0.5;
    this.scene.add(this.camera);

    // init renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    // load textures
    const loader = new THREE.TextureLoader();
    for (const textureName in texturePath) {
      this.textures[textureName] = {};
      for (const textureType in texturePath[textureName]) {
        let texture;
        try {
          texture = await loader.loadAsync(texturePath[textureName][textureType]);
        } catch {
          throw new LoadTextureError(`Cannot load map '${textureType}' of texture '${textureName}'.`);
        }
        this.textures[textureName][textureType] = texture;
      }
    }
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
    const floorPlaneGeomatry = new THREE.PlaneGeometry(sizeX, sizeY, sizeX * 20, sizeY * 20);
    const floorPlaneMaterial = this._getMaterial('rockGround', sizeX, sizeY);
    floorPlaneMaterial.displacementScale = 0.4;
    floorPlaneMaterial.displacementBias = -0.1;
    const floorPlaneMesh = new THREE.Mesh(floorPlaneGeomatry, floorPlaneMaterial);
    floorPlaneMesh.matrixAutoUpdate = false;
    floorPlaneMesh.rotateX(-1 * Math.PI / 2);
    floorPlaneMesh.position.x = sizeX / 2;
    floorPlaneMesh.position.z = sizeY / 2;
    floorPlaneMesh.updateMatrix();
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

  /**
   * Make and add a wall to the scene.
   * @param {number[][]} param0 The wall in the format of [startX, startY], [endX, endY]].
   */
  _placeWall([[startX, startY], [endX, endY]]) {
    // make mesh
    const wallHeigh = 1;
    const wallThickness = 0.1;
    const direction = new THREE.Vector3(endX - startX, 0, endY - startY);
    const length = direction.length() + wallThickness * 0.99;
    const angle = (new THREE.Vector3(1, 0, 0)).angleTo(direction);
    const wallGeometry = new THREE.BoxGeometry(length, wallHeigh, wallThickness);
    const wallMaterial = this._getMaterial('brickWall', length, wallHeigh);
    wallMaterial.displacementScale = 0.01;
    wallMaterial.displacementBias = -0.002;
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.matrixAutoUpdate = false;

    // move and rotate
    wallMesh.rotateY(angle);
    wallMesh.position.y = wallHeigh / 2;
    wallMesh.position.x += startX + direction.x / 2;
    wallMesh.position.z += startY + direction.z / 2;
    wallMesh.updateMatrix();

    // add to scene
    this.scene.add(wallMesh);
  }

  /**
   * Generate a material by a specific texture and size.
   * @param {string} textureName The name of material to use.
   * @param {number} u The u size of the material.
   * @param {number} v The v size of the material.
   * @return {THREE.Material} The generated material.
   */
  _getMaterial(textureName, u, v) {
    const material = new THREE.MeshPhongMaterial();
    for (const textureType in this.textures[textureName]) {
      const texture = this.textures[textureName][textureType].clone();
      texture.matrixAutoUpdate = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(u, v);
      texture.needsUpdate = true;
      texture.updateMatrix();
      material[textureType] = texture;
    }
    return material;
  }
}

class LoadTextureError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoadTextureError';
  }
}

export default RenderController;
export { LoadTextureError };
