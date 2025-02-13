class Camera {
  constructor() {
    this.eye = new Vector3([0, 0, 3]);
    this.at = new Vector3([0, 0, -100]);
    this.up = new Vector3([0, 1, 0]);

    this.stepSize = 0.1;
  }

  forward() {
    let f = new Vector3(this.at.elements);
    f.sub(this.eye).normalize();
    f.mul(this.stepSize);
    this.eye.add(f);
    this.at.add(f);
  }

  back() {
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    f.mul(this.stepSize);
    this.eye.add(f);
    this.at.add(f);
  }

  left() {
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    let s = Vector3.cross(f, this.up).normalize();
    s.mul(this.stepSize);
    this.eye.add(s);
    this.at.add(s);
  }

  right() {
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    let s = Vector3.cross(this.up, f).normalize();
    s.mul(this.stepSize);
    this.eye.add(s);
    this.at.add(s);
  }

  panLeft() {
    let alpha = 5; // Rotation angle in degrees
    let radians = (alpha * Math.PI) / 180;
    let f = new Vector3(this.at.elements);
    f.sub(this.eye).normalize();

    let cosA = Math.cos(radians);
    let sinA = Math.sin(radians);
    let ux = this.up.x,
      uy = this.up.y,
      uz = this.up.z;

    let rotationMatrix = [
      [
        cosA + ux * ux * (1 - cosA),
        ux * uy * (1 - cosA) - uz * sinA,
        ux * uz * (1 - cosA) + uy * sinA,
      ],
      [
        uy * ux * (1 - cosA) + uz * sinA,
        cosA + uy * uy * (1 - cosA),
        uy * uz * (1 - cosA) - ux * sinA,
      ],
      [
        uz * ux * (1 - cosA) - uy * sinA,
        uz * uy * (1 - cosA) + ux * sinA,
        cosA + uz * uz * (1 - cosA),
      ],
    ];

    let f_prime = new Vector3([
      rotationMatrix[0][0] * f.x +
        rotationMatrix[0][1] * f.y +
        rotationMatrix[0][2] * f.z,
      rotationMatrix[1][0] * f.x +
        rotationMatrix[1][1] * f.y +
        rotationMatrix[1][2] * f.z,
      rotationMatrix[2][0] * f.x +
        rotationMatrix[2][1] * f.y +
        rotationMatrix[2][2] * f.z,
    ]);

    this.at.set(this.eye).add(f_prime);
  }

  panLeft() {}

  panRight() {}
}
