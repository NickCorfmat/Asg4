// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;
    varying vec2 v_UV;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
      v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
      v_VertPos = u_ModelMatrix * a_Position;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform sampler2D u_Sampler8;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_lightColor;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform bool u_spotlightOn;
  uniform vec3 u_spotlightPos;
  uniform vec3 u_spotDirection;
  uniform float u_spotCosineCutoff;
  uniform float u_spotExponent;

  void main() {
    vec4 baseColor;
    if (u_whichTexture == -3) {
      baseColor = vec4((v_Normal + 1.0) / 2.0, 1.0); // Use normal diffuse
    } else if (u_whichTexture == -2) {
      baseColor = u_FragColor;                   // Use Color
    } else if (u_whichTexture == -1) {
      baseColor = vec4(v_UV, 1.0, 1.0);          // Use UV debug color
    } else if (u_whichTexture == 0) {
      baseColor = texture2D(u_Sampler0, v_UV);   // Use texture0
    } else if (u_whichTexture == 1) {
      baseColor = texture2D(u_Sampler1, v_UV);   // Use texture1
    } else if (u_whichTexture == 2) {
      baseColor = texture2D(u_Sampler2, v_UV);   // Use texture2
    } else if (u_whichTexture == 3) {
      baseColor = texture2D(u_Sampler3, v_UV);   // Use texture3
    } else if (u_whichTexture == 4) {
      baseColor = texture2D(u_Sampler4, v_UV);   // Use texture4
    } else if (u_whichTexture == 5) {
      baseColor = texture2D(u_Sampler5, v_UV);   // Use texture5
    } else if (u_whichTexture == 6) {
      baseColor = texture2D(u_Sampler6, v_UV);   // Use texture6
    } else if (u_whichTexture == 7) {
      baseColor = texture2D(u_Sampler7, v_UV);   // Use texture7
    } else if (u_whichTexture == 8) {
      baseColor = texture2D(u_Sampler8, v_UV);   // Use texture8
    } else {
      baseColor = vec4(1, 0.2, 0.2, 1);          // Error, put Redish
    }

    // Light toggling feature derived from ChatGPT
    if (!u_lightOn) {
      gl_FragColor = baseColor;
      return;
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E, R), 0.0), 10.0);

    // Point light
    vec3 pointDiffuse = baseColor.rgb * u_lightColor * nDotL * 0.7;
    vec3 pointAmbient = baseColor.rgb * u_lightColor * 0.5;

    // Spotlight - calculations derived from section 7.2.6 of https://math.hws.edu/graphicsbook/c7/s2.html
    vec3 spotDiffuse = vec3(0.0);
    float spotFactor = 0.0;
    if (u_spotlightOn) {
      vec3 lightVector = u_spotlightPos - vec3(v_VertPos);
      vec3 L = normalize(lightVector);
  
      vec3 D = normalize(-u_spotDirection); 
      float spotCosine = dot(D, L);
  
      if (spotCosine >= u_spotCosineCutoff) {
        spotFactor = pow(spotCosine, u_spotExponent);
      }
  
      spotDiffuse = baseColor.rgb * u_lightColor * spotFactor * 1.7;
    }

    gl_FragColor = vec4(specular + pointDiffuse + pointAmbient + spotDiffuse, 1.0);
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_Sampler0;
let u_whichTexture;
let u_lightPos;
let g_NormalOn = false;
let g_lightPos = [4.6, 6, 4.6];
let g_lightColor = [1, 1, 1];
let u_lightColor;
let u_cameraPos;
let u_lightOn;
let g_lightOn = true;
let animateLights = true;
let g_spotlightOn = true;
let u_spotlightOn;
let g_spotlightPos = [6, 3, 4.6];
let u_spotlightPos;
let u_spotCosineCutoff;
let u_spotDirection;
let u_spotExponent;

// camera settings
let camera = new Camera();
let rotateSensitivity = 0.15;

let map = new Map(camera);
const textures = [
  "brick.jpg",
  "pipe.jpg",
  "lucky.jpg",
  "backdrop.jpg",
  "goomba.jpg",
  "castle.jpg",
  "princess.jpg",
  "shell.jpg",
];

// diagnostics
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  // Set up action for the HTML UI elements
  addActionsForHtmlUI();

  initTextures();

  requestAnimationFrame(tick);
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;

  updateAnimations();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimations() {
  if (animateLights) {
    // Point light
    g_lightPos[0] = 3 * Math.cos(g_seconds / 2) + 5;
    g_lightPos[1] = 6;
    g_lightPos[2] = 3 * Math.sin(g_seconds / 2) + 5;

    // Spotlight
    g_spotlightPos[0] = 5;
    g_spotlightPos[1] = Math.sin(g_seconds / 2) + 3;
    g_spotlightPos[2] = 4.6;
  }
}

function keydown(ev) {
  if (ev.keyCode == 87) {
    // Up
    camera.forward();
  } else if (ev.keyCode == 83) {
    // Down
    camera.back();
  } else if (ev.keyCode == 65) {
    // Left
    camera.left();
  } else if (ev.keyCode == 68) {
    // Right
    camera.right();
  } else if (ev.keyCode == 81) {
    // Q
    camera.pan(5);
  } else if (ev.keyCode == 69) {
    // E
    camera.pan(-5);
  } else if (ev.keyCode == 70) {
    // F
    map.addBlock();
  } else if (ev.keyCode == 71) {
    // G
    map.removeBlock();
  }
}

function renderScene() {
  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the projection matrix
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projMat.elements);

  // Pass the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMat.elements);

  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  let radians = 30 * (Math.PI / 180);

  gl.uniform1i(u_spotlightOn, g_spotlightOn);
  gl.uniform3f(
    u_spotlightPos,
    g_spotlightPos[0],
    g_spotlightPos[1],
    g_spotlightPos[2]
  );
  gl.uniform3f(u_spotDirection, 0.0, -1.0, 0.0);
  gl.uniform1f(u_spotCosineCutoff, Math.cos(radians));
  gl.uniform1f(u_spotExponent, 90.0);

  gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // lights
  let pointLight = new Cube();
  pointLight.color = [2, 2, 0, 1];
  pointLight.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  pointLight.matrix.scale(-0.2, -0.2, -0.2);
  pointLight.render();

  let spotlight = new Cube();
  spotlight.color = [0.94, 0.2, 1, 1];
  spotlight.matrix.translate(
    g_spotlightPos[0],
    g_spotlightPos[1],
    g_spotlightPos[2]
  );
  spotlight.matrix.scale(-0.2, -0.2, -0.2);
  spotlight.render();

  map.render();

  // skybox
  let sky = new Cube();
  sky.textureNum = 3;
  if (g_NormalOn) sky.textureNum = -3;
  sky.matrix.scale(-10, -10, -10);
  sky.matrix.translate(-1, -0.999, 0.05);
  sky.render();
  sky.matrix.setIdentity();
  sky.textureNum = -2;
  if (g_NormalOn) sky.textureNum = -3;
  sky.color = [0.635, 0.682, 0.996, 1.0];
  sky.matrix.scale(-10, 0.1, -10);
  sky.matrix.translate(-1, 99, 0.05);
  sky.render();
  sky.matrix.setIdentity();
  sky.textureNum = 5;
  if (g_NormalOn) sky.textureNum = -3;
  sky.matrix.translate(0, -0.001, 0);
  sky.matrix.scale(-10, -10, 0.1);
  sky.matrix.translate(-1, -1, -4.5);
  sky.render();
  sky.matrix.setIdentity();

  // ground
  let ground = new Cube();
  ground.color = [0.478, 0.741, 0.216, 1.0];
  if (g_NormalOn) ground.textureNum = -3;
  ground.matrix.translate(0, -0.001, 9.5);
  ground.matrix.scale(-10, -0.01, -10);
  ground.matrix.translate(-1, 0, 1);
  ground.render();

  // primitive objects
  let sphere = new Sphere();
  sphere.color = [0, 0, 0, 1];
  if (g_NormalOn) sphere.textureNum = -3;
  sphere.matrix.translate(4.8, 4.6, 3);
  sphere.matrix.scale(0.5, 0.5, 0.5);
  sphere.render();

  let cube = new Cube();
  cube.color = [0, 0, 1, 1];
  if (g_NormalOn) cube.textureNum = -3;
  cube.matrix.translate(5.8, 4.2, 3.6);
  cube.matrix.scale(0.8, 0.8, 0.8);
  cube.render();

  // goombas
  let goomba = new Cube();
  goomba.textureNum = 4;
  if (g_NormalOn) goomba.textureNum = -3;
  for (let i = 0; i < 6; i++) {
    let gX = 20 * Math.cos(0.25 * g_seconds) + 20;
    let gY = -1;
    let gZ = i * 1500 + 10;

    goomba.matrix.scale(0.27, -0.27, 0.001);
    if (i % 2 == 0) {
      gX = 20 * Math.sin(0.25 * g_seconds) + 20;
      goomba.matrix.translate(gX, gY, gZ);
    } else {
      goomba.matrix.translate(gX, gY, gZ);
    }
    goomba.render();
    goomba.matrix.setIdentity();
  }

  // shells
  let shell = new Cube();
  shell.textureNum = 7;
  if (g_NormalOn) shell.textureNum = -3;
  for (let i = 0; i < 6; i++) {
    let sX = 20 * Math.sin(0.3 * -g_seconds) + 20;
    let sY = -1;
    let sZ = i * 1500 + 5;

    shell.matrix.scale(0.27, -0.27, 0.001);
    if (i % 2 == 0) {
      sX = 20 * Math.cos(0.3 * g_seconds) + 20;
      shell.matrix.translate(sX, sY, sZ);
    } else {
      shell.matrix.translate(sX, sY, sZ);
    }
    shell.render();
    shell.matrix.setIdentity();
  }

  // princess peach
  let pY = 0.1 * Math.sin(4 * g_seconds) + 3.6;
  let princess = new Cube();
  princess.textureNum = 6;
  if (g_NormalOn) princess.textureNum = -3;
  princess.matrix.translate(0, pY + 0.5, -0.44);
  princess.matrix.scale(-0.5, -0.5, 0.001);
  princess.matrix.translate(-11.8, 0, 0);
  princess.render();
  princess.matrix.setIdentity();
  princess.textureNum = -2;
  if (g_NormalOn) princess.textureNum = -3;
  princess.color = [0.635, 0.682, 0.996, 1.0];
  princess.matrix.translate(0, pY + 0.9, -0.439);
  princess.matrix.scale(-0.5, -0.1, 0.002);
  princess.matrix.translate(-11.8, 3.2, 0);
  princess.render();

  // Check the time at the end of the function, and display on web page
  var duration = performance.now() - startTime;
  var fps = 1000 / duration;

  sendTextToHTML(
    `ms: ${Math.floor(duration)} fps: ${Math.floor(fps)}`,
    "numdot"
  );
}
