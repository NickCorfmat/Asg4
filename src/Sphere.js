class Sphere {
  constructor() {
    this.type = "sphere";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;

    this.cubeVerts32 = new Float32Array([]);
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    let d = Math.PI / 25;
    let dd = Math.PI / 25;

    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < 2 * Math.PI; r += d) {
        let p1 = [
          Math.sin(t) * Math.cos(r),
          Math.sin(t) * Math.sin(r),
          Math.cos(t),
        ];
        let p2 = [
          Math.sin(t + dd) * Math.cos(r),
          Math.sin(t + dd) * Math.sin(r),
          Math.cos(t + dd),
        ];
        let p3 = [
          Math.sin(t) * Math.cos(r + dd),
          Math.sin(t) * Math.sin(r + dd),
          Math.cos(t),
        ];
        let p4 = [
          Math.sin(t + dd) * Math.cos(r + dd),
          Math.sin(t + dd) * Math.sin(r + dd),
          Math.cos(t + dd),
        ];

        let uv1 = [t / Math.PI, r / (2 * Math.PI)];
        let uv2 = [(t + dd) / Math.PI, r/(2 * Math.PI)];
        let uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
        let uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

        let v = [];
        let uv = [];

        v = v.concat(p1);
        uv = uv.concat(uv1);
        v = v.concat(p2);
        uv = uv.concat(uv2);
        v = v.concat(p4);
        uv = uv.concat(uv4);

        gl.uniform4f(u_FragColor, 1, 1, 1, 1);
        drawTriangle3DUVNormal(v, uv, v);

        v = [];
        uv = [];
        v = v.concat(p1);
        uv = uv.concat(uv1);
        v = v.concat(p4);
        uv = uv.concat(uv4);
        v = v.concat(p3);
        uv = uv.concat(uv3);

        gl.uniform4f(u_FragColor, 1, 1, 1, 1);
        drawTriangle3DUVNormal(v, uv, v);
      }
    }
  }
}
