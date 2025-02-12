class Map {
  constructor() {
    this.blockSize = 0.3;

    this.layout = [
      [4, 4, 0, 0, 0, 0, 4, 4],
      [4, 0, 0, 0, 0, 0, 0, 4],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 3, 0, 0, 0],
      [0, 0, 0, 1, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [4, 0, 0, 0, 0, 0, 0, 4],
      [4, 4, 0, 0, 0, 0, 4, 4],
    ];
  }

  render() {
    let wall = new Cube();
    wall.textureNum = 1;

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        this.drawMapChunk(wall, x, y);
      }
    }
  }

  drawMapChunk(wall, chunkX, chunkY) {
    let stackHeight;

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        stackHeight = this.layout[x][y];

        if (stackHeight > 0) {
          for (let z = 0; z < stackHeight; z++) {
            wall.matrix.translate(0, -0.75 + z * this.blockSize, 0);
            wall.matrix.scale(this.blockSize, this.blockSize, this.blockSize);
            wall.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
            wall.renderfast();
            wall.matrix.setIdentity();
          }
        }
      }
    }
  }
}
