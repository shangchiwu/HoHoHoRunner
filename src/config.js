export default {
  server: {
    apiBaseUrl: '/api',
    positionUpdateInterval: 100
  },
  renderController: {
    antialias: true,
    camera: {
      fov: 90,
      near: 0.01,
      far: 10000,
      defaultPosition: [0, 0.5, 0]
    },
    light: {
      background: 0x2a6bdc,
      directional: {
        color: 'white',
        intensity: 1,
        position: [3, 10, 4]
      },
      ambient: {
        color: 'white',
        intensity: 0.8
      }
    },
    texture: {
      brickWall: {
        map: './texture/Brick_Wall_017_basecolor.jpg',
        normalMap: './texture/Brick_Wall_017_normal.jpg',
        // displacementMap: './texture/Brick_Wall_017_height.jpg'
      },
      rockGround: {
        map: './texture/rocks_ground_08_diff_1k.jpg',
        normalMap: './texture/rocks_ground_08_nor_1k.jpg',
        displacementMap: './texture/rocks_ground_08_disp_1k.jpg'
      }
    },
    floor: {
      textureName: 'rockGround',
      segmentPerUnit: 20,
      displacementScale: 0.4,
      displacementBias: -0.1
    },
    wall: {
      textureName: 'brickWall',
      height: 1,
      thickness: 0.1,
      displacementScale: 0.01,
      displacementBias: -0.002
    }
  }
}