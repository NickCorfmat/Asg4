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
    uniform vec3 u_cameraPos;
    varying vec4 v_VertPos;
    uniform bool u_lightOn;
    
    void main() {
      if (u_whichTexture == -3) {
        gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0); // Use normal diffuse
      } else if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;                   // Use Color
      } else if (u_whichTexture == -1) {
       gl_FragColor = vec4(v_UV, 1.0, 1.0);           // Use UV debug color
      } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);   // Use texture0
      } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);   // Use texture1
      } else if (u_whichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);   // Use texture2
      } else if (u_whichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);   // Use texture3
      } else if (u_whichTexture == 4) {
        gl_FragColor = texture2D(u_Sampler4, v_UV);   // Use texture4
      } else if (u_whichTexture == 5) {
        gl_FragColor = texture2D(u_Sampler5, v_UV);   // Use texture5
      } else if (u_whichTexture == 6) {
        gl_FragColor = texture2D(u_Sampler6, v_UV);   // Use texture6
      } else if (u_whichTexture == 7) {
        gl_FragColor = texture2D(u_Sampler7, v_UV);   // Use texture7
      } else if (u_whichTexture == 8) {
        gl_FragColor = texture2D(u_Sampler8, v_UV);   // Use texture8
      } else {
        gl_FragColor = vec4(1, 0.2, 0.2, 1);          // Error, put Redish
      }

      vec3 lightVector = u_lightPos - vec3(v_VertPos);
      float r = length(lightVector);

      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);

      // Reflection
      vec3 R = reflect(-L, N);

      // Eye
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

      // Specular
      float specular = pow(max(dot(E, R), 0.0), 10.0);

      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;

      if (u_lightOn) {
        if (u_whichTexture == 0) {
          gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
        } else {
          gl_FragColor = vec4(diffuse + ambient, 1.0);
        }
      }
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
let g_lightPos = [0, 1, -2];
let g_cameraPos;
let u_lightOn;
let g_lightOn = false;

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

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Retrieve WebGl rendering context
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get WebGL context.");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders (compile + install shaders)
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders.");
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position.");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV.");
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log("Failed to get the storage location of a_Normal.");
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor.");
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if (!u_lightPos) {
    console.log("Failed to get the storage location of u_lightPos.");
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
  if (!u_cameraPos) {
    console.log("Failed to get the storage location of u_cameraPos.");
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
  if (!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn.");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_NormalMatrix) {
    console.log("Failed to get the storage location of u_NormalMatrix");
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix.");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix.");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture.");
    return;
  }

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  gl.uniformMatrix4fv(u_NormalMatrix, false, identityM.elements);
}

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  document.addEventListener("keydown", keydown);

  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener("mousedown", (ev) => {
    if (ev.button === 0) {
      isDragging = true;
      lastX = ev.clientX;
      lastY = ev.clientY;
      document.body.style.cursor = "none";
    }
  });

  document.addEventListener("mousemove", (ev) => {
    if (isDragging) {
      let deltaX = ev.clientX - lastX;
      let deltaY = ev.clientY - lastY;

      camera.pan(deltaX * rotateSensitivity);
      camera.tilt(-deltaY * rotateSensitivity);

      lastX = ev.clientX;
      lastY = ev.clientY;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.cursor = "default";
  });

  document
    .getElementById("lightSliderX")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[0] = this.value / 100;
        renderScene();
      }
    });

  document
    .getElementById("lightSliderY")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[1] = this.value / 100;
        renderScene();
      }
    });

  document
    .getElementById("lightSliderZ")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[2] = this.value / 100;
        renderScene();
      }
    });

  document.getElementById("play-button").addEventListener("click", () => {
    let audio = document.getElementById("music");
    audio.play();
  });

  document.getElementById("normal-on-button").addEventListener("click", () => {
    g_NormalOn = true;
  });

  document.getElementById("normal-off-button").addEventListener("click", () => {
    g_NormalOn = false;
  });

  document.getElementById("light-on-button").addEventListener("click", () => {
    g_lightOn = true;
  });

  document.getElementById("light-off-button").addEventListener("click", () => {
    g_lightOn = false;
  });
}

function initTextures() {
  for (let i = 0; i < textures.length; i++) {
    let image = new Image();
    if (!image) {
      console.log("Failed to create the image object");
      return false;
    }

    image.onload = function () {
      sendTextureToGLSL(image, i);
    };

    image.src = `../assets/${textures[i]}`;
  }

  return true;
}

function sendTextureToGLSL(image, index) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl["TEXTURE" + index]);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler" + index), index);
}

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
  g_lightPos[0] =  5 * Math.cos(g_seconds / 2) + 5;
}

function handleClicks(ev) {
  // Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // Draw every shape that is supposed to be in the canvas
  renderScene();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
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

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  map.render();

  // backdrop
  var sky = new Cube();
  sky.textureNum = 3;
  if (g_NormalOn) sky.textureNum = -3;
  sky.matrix.scale(-10, -10, -10);
  sky.matrix.translate(-1, -0.999, 0.05);
  sky.render();
  sky.matrix.setIdentity();
  sky.textureNum = -2;
  if (g_NormalOn) sky.textureNum = -3;
  sky.color = [0.635, 0.682, 0.996, 1.0];
  sky.matrix.translate(0, 9.9, 0);
  sky.matrix.scale(-10, 0.01, 10);
  sky.matrix.translate(0, 0, 0.955);
  sky.render();
  sky.matrix.setIdentity();
  sky.textureNum = 5;
  if (g_NormalOn) sky.textureNum = -3;
  sky.matrix.translate(0, -0.001, 0);
  sky.matrix.scale(10, 10, 0.1);
  sky.matrix.translate(0, 0, -4.45);
  sky.render();
  sky.matrix.setIdentity();

  // world ground
  var ground = new Cube();
  if (g_NormalOn) ground.textureNum = -3;
  ground.color = [0.478, 0.741, 0.216, 1.0];
  ground.matrix.translate(0, -0.001, 9.5);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(0, 0, 0);
  ground.render();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);

  gl.uniform1i(u_lightOn, g_lightOn);

  let light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.render();

  let sphere = new Sphere();
  sphere.color = [0, 0, 0, 1];
  if (g_NormalOn) sphere.textureNum = -3;
  sphere.matrix.translate(2, 3, 2);
  sphere.render();

  // goombas
  var goomba = new Cube();
  goomba.textureNum = 4;
  if (g_NormalOn) ground.textureNum = -3;
  for (let i = 0; i < 6; i++) {
    let gX = 20 * Math.cos(0.25 * g_seconds) + 20;
    let gY = 0;
    let gZ = i * 1500 + 10;

    goomba.matrix.scale(0.27, 0.27, 0.001);
    if (i % 2 == 0) {
      gX = 20 * Math.sin(0.25 * g_seconds) + 20;
      goomba.matrix.translate(gX, gY, gZ);
    } else {
      goomba.matrix.translate(gX, gY, gZ);
    }
    //goomba.normalMatrix.setInverseOf(goomba.matrix).transpose();
    goomba.render();
    goomba.matrix.setIdentity();
  }

  // // shells
  // var shell = new Cube();
  // shell.textureNum = 7;
  // if (g_NormalOn) ground.textureNum = -3;
  // for (let i = 0; i < 6; i++) {
  //   let sX = 20 * Math.sin(0.3 * -g_seconds) + 20;
  //   let sY = 0;
  //   let sZ = i * 1500 + 5;

  //   shell.matrix.scale(0.27, 0.27, 0.001);
  //   if (i % 2 == 0) {
  //     sX = 20 * Math.cos(0.3 * g_seconds) + 20;
  //     shell.matrix.translate(sX, sY, sZ);
  //   } else {
  //     shell.matrix.translate(sX, sY, sZ);
  //   }
  //   shell.render();
  //   shell.matrix.setIdentity();
  // }

  // // princess peach
  // let pY = 0.1 * Math.sin(4 * g_seconds) + 3.6;
  // var princess = new Cube();
  // princess.textureNum = 6;
  // if (g_NormalOn) ground.textureNum = -3;
  // princess.matrix.translate(0, pY, -0.44);
  // princess.matrix.scale(0.5, 0.5, 0.001);
  // princess.matrix.translate(8.2, 0, 0);
  // princess.render();
  // princess.matrix.setIdentity();
  // princess.textureNum = -2;
  // if (g_NormalOn) ground.textureNum = -3;
  // princess.color = [0.635, 0.682, 0.996, 1.0];
  // princess.matrix.translate(0, pY + 0.4, -0.439);
  // princess.matrix.scale(0.5, 0.1, 0.002);
  // princess.matrix.translate(8.2, 0, 0);
  // princess.render();

  // Check the time at the end of the function, and display on web page
  var duration = performance.now() - startTime;
  var fps = 1000 / duration;

  sendTextToHTML(
    `ms: ${Math.floor(duration)} fps: ${Math.floor(fps)}`,
    "numdot"
  );
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML.");
    return;
  }

  htmlElm.innerHTML = text;
}
