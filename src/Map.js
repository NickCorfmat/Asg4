class Map {
  constructor() {
    this.blockSize = 0.3;
    this.wall = new Cube();
    this.wall.textureNum = 1;

    this.layout = [
      [3, 1, 1, 0, 0, 1, 1, 3],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 2, 3, 0, 0, 0],
      [0, 0, 0, 1, 4, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [3, 1, 1, 0, 0, 1, 1, 3],
    ];
  }

  render() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        this.renderChunk(x, y);
      }
    }
  }

  renderChunk(chunkX, chunkY) {
    let stackHeight;

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        stackHeight = this.layout[x][y];

        if (stackHeight > 0) {
          for (let z = 0; z < stackHeight; z++) {
            this.wall.matrix.translate(0, -0.74 + z * this.blockSize, 0);
            this.wall.matrix.scale(
              this.blockSize,
              this.blockSize,
              this.blockSize
            );
            this.wall.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
            this.wall.renderfast();
            this.wall.matrix.setIdentity();
          }
        }
      }
    }
  }
}
