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