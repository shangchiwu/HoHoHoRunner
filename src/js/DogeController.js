class DogeController {
  /**
   * Constructor
   * @param {number} sizeX The x size of the maze.
   * @param {number} sizeY The y size of the maze.
   * @param {number} radius The radius of meet-circle.
   */
  constructor(sizeX, sizeY, radius) {
    this._position = [
      this._randomIntRange(0, sizeX - 1) + 0.5,
      this._randomIntRange(0, sizeY - 1) + 0.5
    ];
    this._position = [1.5, 2.5];
    this._radius = radius;
    this._isMet = false;
  }

  get position() {
    return this._position;
  }

  get isMet() {
    return this._isMet;
  }

  check(userX, userY) {
    const result = this._radius * this._radius >
      (this._position[0] - userX) * (this._position[0] - userX) +
      (this._position[1] - userY) * (this._position[1] - userY)
    this._isMet |= result;
    return result;
  };

  _randomIntRange(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
  }
}

export default DogeController;
