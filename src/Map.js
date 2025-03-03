class Map {
  constructor(camera) {
    this.camera = camera;
    this.blockSize = 0.3;
    this.block = new Cube();

    this.chunkLayout = [
      [3, 1, 0, 0, 0, 0, 1, 3],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, -1, 0],
      [0, 0, -2, 2, 3, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [3, 1, 0, 0, 0, 0, 1, 3],
    ];

    this.map = [];
    this.initMap(4, 4);
  }

  initMap(width, height) {
    let fullWidth = width * 8;
    let fullHeight = height * 8;

    this.map = Array.from({ length: fullWidth }, () =>
      Array(fullHeight).fill(0)
    );

    for (let chunkX = 0; chunkX < width; chunkX++) {
      for (let chunkY = 0; chunkY < height; chunkY++) {
        for (let x = 0; x < 8; x++) {
          for (let y = 0; y < 8; y++) {
            let worldX = chunkX * 8 + x;
            let worldY = chunkY * 8 + y;
            this.map[worldX][worldY] = this.chunkLayout[x][y];
          }
        }
      }
    }
  }

  render() {
    let stackHeight;

    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        stackHeight = this.map[x][y];

        if (stackHeight > 0) {
          for (let z = 0; z < stackHeight; z++) {
            this.block.textureNum = 0;
            if (g_NormalOn) this.block.textureNum = -3;
            this.block.matrix.translate(0, z * this.blockSize, 0);
            this.block.matrix.scale(
              -this.blockSize,
              -this.blockSize,
              -this.blockSize
            );

            this.block.matrix.translate(-x - 1, -1, -y + 1);
            this.block.render();
            this.block.matrix.setIdentity();
          }
        } else if (stackHeight < 0) {
          this.renderSpecialBlock(x, y, stackHeight);
        }
      }
    }
  }

  renderSpecialBlock(x, y, type) {
    if (type == -1) {
      // Pipe block
      this.block.textureNum = 1;
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix.translate(0, 0, 0);
      this.block.matrix.scale(
        -this.blockSize,
        -this.blockSize,
        -this.blockSize
      );

      this.block.matrix.translate(-x - 1, -1, -y + 1);
      this.block.render();
      this.block.matrix.setIdentity();

      // green top
      this.block.color = [0, 0.4, 0, 1];
      this.block.textureNum = -2;
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix.translate(0, this.blockSize, 0);
      this.block.matrix.scale(-this.blockSize, -0.001, -this.blockSize);
      this.block.matrix.translate(-x - 1, -1, -y + 1);
      this.block.render();
      this.block.matrix.setIdentity();

      // piranha plant
      let center = this.worldToPixel(x, y);

      // stem
      let pX = center.x + (3 * this.blockSize) / 8 + 0.07;
      let pZ = center.y - (3 * this.blockSize) / 8 - 0.09;
      let pY = 0.15 * Math.sin(g_seconds) + this.blockSize / 6 + 0.3;
      this.block.color = [1, 0.627, 0.267, 1];
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix.translate(pX, pY, pZ);
      this.block.matrix.scale(
        -(this.blockSize / 4),
        -0.25,
        -(this.blockSize / 4)
      );
      let stem = new Matrix4(this.block.matrix);
      this.block.render();
      this.block.matrix.setIdentity();

      // mouth
      this.block.color = [0, 0.659, 0, 1];
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix = stem;
      this.block.matrix.scale(-this.blockSize * 10, -0.8, -this.blockSize * 10);
      this.block.matrix.translate(
        -this.blockSize - 0.35,
        pY - 1,
        this.blockSize + 0.4
      );
      this.block.render();
      this.block.color = [1, 1, 1, 1];
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix = stem;
      this.block.matrix.translate(0.6, pY + 0.8, -1.05);
      this.block.matrix.scale(
        -this.blockSize * 0.8,
        -0.8,
        -this.blockSize * 3.7
      );
      this.block.render();
      this.block.matrix.setIdentity();
    } else if (type == -2) {
      // Lucky Block
      this.block.textureNum = 2;
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix.translate(0, 5 * this.blockSize, 0);
      this.block.matrix.scale(
        -this.blockSize,
        -this.blockSize,
        -this.blockSize
      );
      this.block.matrix.translate(-x - 1, -1, -y + 1);
      this.block.render();
      this.block.matrix.setIdentity();

      // top
      this.block.color = [0.862, 0.557, 0.211, 1];
      this.block.textureNum = -2;
      if (g_NormalOn) this.block.textureNum = -3;
      this.block.matrix.translate(0, 6 * this.blockSize + 0.001, 0);
      this.block.matrix.scale(-this.blockSize, -0.001, -this.blockSize);
      this.block.matrix.translate(-x - 1, -1, -y + 1);
      this.block.render();
      this.block.matrix.setIdentity();

      // bottom
      this.block.matrix.translate(0, 4.999 * this.blockSize, 0);
      this.block.matrix.scale(-this.blockSize, -0.001, -this.blockSize);
      this.block.matrix.translate(-x - 1, -1, -y + 1);
      this.block.render();
      this.block.matrix.setIdentity();
    }
  }

  addBlock() {
    let location = this.pixelToWorld(
      this.camera.eye.elements[0],
      this.camera.eye.elements[2]
    );

    if (
      location.x >= 0 &&
      location.x < 32 &&
      location.y >= 0 &&
      location.y < 32
    ) {
      this.map[location.x][location.y] += 1;
    }
  }

  removeBlock() {
    let location = this.pixelToWorld(
      this.camera.eye.elements[0],
      this.camera.eye.elements[2]
    );

    if (
      location.x >= 0 &&
      location.x < 32 &&
      location.y >= 0 &&
      location.y < 32
    ) {
      if (this.map[location.x][location.y] > 0) {
        this.map[location.x][location.y] -= 1;
      }
    }
  }

  pixelToWorld(pixelX, pixelY) {
    return {
      x: Math.floor(pixelX / this.blockSize),
      y: Math.floor(pixelY / this.blockSize),
    };
  }

  worldToPixel(worldX, worldY) {
    return {
      x: worldX * this.blockSize,
      y: worldY * this.blockSize,
    };
  }
}
