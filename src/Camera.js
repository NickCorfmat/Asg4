class Camera {
  constructor() {
    this.eye = new Vector3([0, 0, 3]);
    this.at = new Vector3([0, 0, -100]);
    this.up = new Vector3([0, 1, 0]);
  }

  forward() {
    console.log("forward");
    let f = new Vector3(this.at.elements);
    f.sub(this.eye).normalize();
    this.eye.add(f);
    this.at.add(f);
  }

  back() {
    console.log("back");
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    this.eye.add(f);
    this.at.add(f);
  }

  left() {
    console.log("left");
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    let s = Vector3.cross(f, this.up).normalize();
    this.eye.add(s);
    this.at.add(s);
  }

  right() {
    console.log("right");
    let f = new Vector3(this.eye.elements);
    f.sub(this.at).normalize();
    let s = Vector3.cross(this.up, f).normalize();
    this.eye.add(s);
    this.at.add(s);
  }

  turnLeft() {
    console.log("turn left");
  }

  turnRight() {
    console.log("turn right");
  }
}
