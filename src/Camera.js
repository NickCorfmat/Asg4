class Camera {
  constructor() {
    this.eye = new Vector3([0, 0, 3]);
    this.at = new Vector3([0, 0, -100]);
    this.up = new Vector3([0, 1, 0]);
  }

  forward() {
    var f = this.at.sub(this.eye);
    f.normalize();
    this.at.add(f);
    this.eye.add(f);
  }

  back() {
    var f = this.eye.sub(this.at);
    f.normalize();
    this.at.add(f);
    this.eye.add(f);
  }

  left() {
    var f = this.eye.sub(this.at);
    f.normalize();
    var s = Vector3.cross(f, this.up);
    s.normalize();
    this.at.add(s);
    this.eye.add(s);
  }

  right() {
    var f = this.at.sub(this.eye);
    f.normalize();
    var s = Vector3.cross(this.up, f);
    s.normalize();
    this.at.add(s);
    this.eye.add(s);
  }
}
