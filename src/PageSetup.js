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
        animateLight = false;
        renderScene();
      }
    });

  document
    .getElementById("lightSliderY")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[1] = this.value / 100;
        animateLight = false;
        renderScene();
      }
    });

  document
    .getElementById("lightSliderZ")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightPos[2] = this.value / 100;
        animateLight = false;
        renderScene();
      }
    });

  document
    .getElementById("lightSliderRed")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightColor[0] = this.value / 255;
        gl.uniform3fv(u_lightColor, g_lightColor);
        renderScene();
      }
    });

  document
    .getElementById("lightSliderGreen")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightColor[1] = this.value / 255;
        gl.uniform3fv(u_lightColor, g_lightColor);
        renderScene();
      }
    });

  document
    .getElementById("lightSliderBlue")
    .addEventListener("mousemove", function (ev) {
      if (ev.buttons == 1) {
        g_lightColor[2] = this.value / 255;
        gl.uniform3fv(u_lightColor, g_lightColor);
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

  document
    .getElementById("animate-light-button")
    .addEventListener("click", () => {
      animateLight = true;
    });
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML.");
    return;
  }

  htmlElm.innerHTML = text;
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
