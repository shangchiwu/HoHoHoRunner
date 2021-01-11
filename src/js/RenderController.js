import * as THREE from './library/three.module.js';
import config from '../config.js';

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
    this.scene.background = new THREE.Color(config.renderController.light.background);
    
    // init light
    const directionLight = new THREE.DirectionalLight(
      new THREE.Color(config.renderController.light.directional.color),
      config.renderController.light.directional.intensity);
    directionLight.position.set(...config.renderController.light.directional.position);
    this.scene.add(directionLight);

    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(config.renderController.light.ambient.color),
      config.renderController.light.ambient.intensity);
    this.scene.add(ambientLight);

    // init camera
    this.camera = new THREE.PerspectiveCamera(
      config.renderController.camera.fov,
      window.innerWidth / window.innerHeight,
      config.renderController.camera.near,
      config.renderController.camera.far);
    this.camera.position.set(...config.renderController.camera.defaultPosition);
    this.scene.add(this.camera);

    // init renderer
    this.renderer = new THREE.WebGLRenderer({antialias: config.renderController.antialias});

    // load textures
    const loader = new THREE.TextureLoader();
    const textureSet = config.renderController.texture;
    for (const textureName in textureSet) {
      this.textures[textureName] = {};
      for (const textureType in textureSet[textureName]) {
        let texture;
        try {
          texture = await loader.loadAsync(textureSet[textureName][textureType]);
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
    // change coordinate system
    direction = (-1 * direction + 270 + 360) % 360;

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
    const segmentPerUnit = config.renderController.floor.segmentPerUnit;
    const floorPlaneGeomatry = new THREE.PlaneGeometry(sizeX, sizeY, sizeX * segmentPerUnit, sizeY * segmentPerUnit);
    const floorPlaneMaterial = this._getMaterial(config.renderController.floor.textureName, sizeX, sizeY);
    floorPlaneMaterial.displacementScale = config.renderController.floor.displacementScale;
    floorPlaneMaterial.displacementBias = config.renderController.floor.displacementBias;
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
    const { height, thickness, textureName, displacementScale, displacementBias } = config.renderController.wall;
    const direction = new THREE.Vector3(endX - startX, 0, endY - startY);
    const length = direction.length() + thickness * 0.99;
    const angle = (new THREE.Vector3(1, 0, 0)).angleTo(direction);
    const wallGeometry = new THREE.BoxGeometry(length, height, thickness);
    const wallMaterial = this._getMaterial(textureName, length, height);
    wallMaterial.displacementScale = displacementScale;
    wallMaterial.displacementBias = displacementBias;
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.matrixAutoUpdate = false;

    // move and rotate
    wallMesh.rotateY(angle);
    wallMesh.position.y = height / 2;
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
