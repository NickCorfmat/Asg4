class Map {
  constructor(camera) {
    this.camera = camera;
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

            let worldX = chunkX * 8 + x;
            let worldY = chunkY * 8 + y;

            this.block.matrix.translate(worldX, 0, worldY);
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
    let worldX = chunkX * 8 + x;
    let worldY = chunkY * 8 + y;

    if (type == -1) {
      // Pipe block
      this.block.textureNum = 1;
      this.block.matrix.translate(0, -0.74, 0);
      this.block.matrix.scale(this.blockSize, this.blockSize, this.blockSize);

      this.block.matrix.translate(worldX, 0, worldY);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // green top
      this.block.color = [0, 0.4, 0, 1];
      this.block.textureNum = -2;
      this.block.matrix.translate(0, -0.74 + this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);

      this.block.matrix.translate(worldX, 0, worldY);
      this.block.renderfast();
      this.block.matrix.setIdentity();
    } else if (type == -2) {
      // Lucky Block
      this.block.textureNum = 2;
      this.block.matrix.translate(0, -0.74 + 4 * this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, this.blockSize, this.blockSize);
      this.block.matrix.translate(worldX, 0, worldY);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // top
      this.block.color = [0.862, 0.557, 0.211, 1];
      this.block.textureNum = -2;
      this.block.matrix.translate(0, -0.74 + 5 * this.blockSize + 0.001, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);
      this.block.matrix.translate(worldX, 0, worldY);
      this.block.renderfast();
      this.block.matrix.setIdentity();

      // bottom
      this.block.matrix.translate(0, -0.74 + 3.999 * this.blockSize, 0);
      this.block.matrix.scale(this.blockSize, 0.001, this.blockSize);
      this.block.matrix.translate(worldX, 0, worldY);
      this.block.renderfast();
      this.block.matrix.setIdentity();
    }
  }

  addBlock() {
    console.log("add");
    let forward = new Vector3(this.camera.at.elements);
    forward.sub(this.camera.eye).normalize(); // Get the direction the camera is facing

    // Calculate the grid position in front of the camera
    let targetX = Math.round(this.camera.eye.x + forward.x);
    let targetY = Math.round(this.camera.eye.z + forward.z);

    console.log(targetX, targetY);

    if (
      targetX >= 0 &&
      targetX < this.layout.length &&
      targetY >= 0 &&
      targetY < this.layout[0].length
    ) {
      console.log(targetX, targetY);
      this.layout[targetX][targetY] += 1; // Add a brick block on top
    }
  }

  removeBlock() {
    console.log("delete");
    let forward = new Vector3(this.camera.at.elements);
    forward.sub(this.camera.eye).normalize();

    let targetX = Math.round(this.camera.eye.x + forward.x);
    let targetY = Math.round(this.camera.eye.z + forward.z);

    console.log(targetX, targetY);

    if (
      targetX >= 0 &&
      targetX < this.layout.length &&
      targetY >= 0 &&
      targetY < this.layout[0].length
    ) {
      console.log(targetX, targetY);
      if (this.layout[targetX][targetY] > 0) {
        this.layout[targetX][targetY] -= 1; // Remove the top block
      }
    }
  }
}
