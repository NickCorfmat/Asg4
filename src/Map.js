class Map {
  constructor() {
    this.blockSize = 0.3;
    this.block = new Cube();

    this.layout = [
      [3, 1, 1, 0, 0, 1, 1, 3],
      [1, 0, 0, 0, 0, 0, -2, 1],
      [1, 0, -2, 0, 0, 0, 0, 1],
      [0, 0, 0, 2, 3, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0],
      [1, 0, -1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, -2, 1],
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
            this.block.textureNum = 0;
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
        } else if (stackHeight < 0) {
          this.renderSpecialBlock(x, y, chunkX, chunkY, stackHeight);
        }
      }
    }
  }

  renderSpecialBlock(x, y, chunkX, chunkY, type) {
    if (type == -1) {
      // Pipe block
      this.block.textureNum = 1;
      this.block.matrix.translate(0, -0.74, 0);
      this.block.matrix.scale(this.blockSize, this.blockSize, this.blockSize);
      this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // green top
      this.block.color = [0, 0.4, 0, 1];
      this.block.textureNum = -2;
      this.block.matrix.translate(0, -0.74 + this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);
      this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
      this.block.renderfast();
      this.block.matrix.setIdentity();
    } else if (type == -2) {
      // Lucky Block
      this.block.textureNum = 2;
      this.block.matrix.translate(0, -0.74 + 4 * this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, this.blockSize, this.blockSize);
      this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // top
      this.block.color = [0.862, 0.557, 0.211, 1];
      this.block.textureNum = -2;
      this.block.matrix.translate(0, -0.74 + 4 * this.blockSize + 0.001, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);
      this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // bottom
      this.block.matrix.translate(0, -0.74 + 3.999 * this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);
      this.block.matrix.translate(x - chunkX * 8, 0, y - chunkY * 8);
      this.block.renderfast();
      this.block.matrix.setIdentity();
    }
  }
}
