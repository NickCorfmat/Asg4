class Map {
  constructor() {
    this.blockSize = 0.3;
    this.block = new Cube();

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
    this.block.textureNum = 1;
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        this.renderChunk(x, y);
      }
    }

    this.block.textureNum = 2;
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        this.block.matrix.translate(0, 0.75, 0);
        this.block.matrix.scale(this.blockSize, this.blockSize, this.blockSize);
        this.block.matrix.translate(x * 6 - 12, 0, y * 6 - 12);
        this.block.renderfast();
        this.block.matrix.setIdentity();
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
            this.block.matrix.translate(0, -0.74 + z * this.blockSize, 0);
            this.block.matrix.scale(
              this.blockSize,
              this.blockSize,
              this.blockSize
            );
            this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
            this.block.renderfast();
            this.block.matrix.setIdentity();
          }
        }
      }
    }
  }
}
