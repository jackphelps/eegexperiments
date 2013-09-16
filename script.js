// variables definition

var swirl = {
      rotationSpeed: 5,
      rotationGap: 100,
      circleAmount: 10,
      lineWidth: 0,
      colorSpeed: 5,
      colorSet: 'colorDepth',
      xor: false,
      togglePreset: function() {
        if(++currentPreset >= presets.length) currentPreset = 0;
        for(var i in presets[currentPreset]) {
          swirl[i] = presets[currentPreset][i];
          controllers[i].updateDisplay();
          if(typeof controllers[i].__onFinishChange === 'function') {
            controllers[i].__onFinishChange(presets[currentPreset][i]);
          }
        }
      },
      screenshot: function() {
        window.open(canvas.toDataURL());
      }
    },
    canvas = document.getElementById('canvas'),
    ctx = this.canvas.getContext('2d'),
    currentFrame = 0,
    colorFrame = 0,
    compositeOperation = 'source-over',
    width, height, centerX, centerY, mouseX = mouseY = offsetX = offsetY = mouseDown = 0,
    colorSet = {
      complementary: [
        function() {
          return 'hsl('+(colorFrame%360|0)+',100%,50%)';
        },
        function() {
          return 'hsl('+((colorFrame+180)%360|0)+',100%,50%)';
        }
      ],
      blackAndWhite: [
        function() {
          return '#000000';
        },
        function() {
          return '#ffffff';
        }
      ],
      colorDepth: [
        function(i, j) {
          return 'hsl('+(colorFrame%360|0)+',100%,'+(100-i/j*100|0)+'%)';
        },
        function(i, j) {
          return 'hsl('+(colorFrame%360|0)+',100%,'+(i/j*100|0)+'%)';
        }
      ],
      greyScale: [
        function(i, j) {
          return 'hsl(0,0%,'+(100-i/j*100|0)+'%)';
        },
        function(i, j) {
          return 'hsl(0,0%,'+(i/j*100|0)+'%)';
        }
      ],
      doubleRainbowOMG: [
        function(i, j) {
          return 'hsl('+((colorFrame*10+360*i/j)%360|0)+',100%,50%)';
        },
        function(i, j) {
          return 'hsl('+((colorFrame*10+180+360*i/j)%360|0)+',100%,50%)';
        }
      ]
    },
    fnStrokeColor = colorSet[swirl.colorSet][0],
    fnFillColor = colorSet[swirl.colorSet][1],
    currentPreset = 0,
    presets = [
      {
        rotationGap: 50,
        lineWidth: 50,
        colorSet: 'complementary',
        xor: false
      },
      {
        rotationGap: 50,
        lineWidth: 0,
        colorSet: 'blackAndWhite',
        xor: true
      },
      {
        rotationGap: 50,
        lineWidth: 12,
        colorSet: 'colorDepth',
        xor: false
      },
      {
        rotationGap: 13,
        lineWidth: 108,
        colorSet: 'complementary',
        xor: false
      },
      {
        rotationGap: 100,
        lineWidth: 165,
        colorSet: 'blackAndWhite',
        xor: false
      },
      {
        rotationGap: 100,
        lineWidth: 100,
        colorSet: 'greyScale',
        xor: false
      },
      {
        rotationGap: 5,
        lineWidth: 0,
        colorSet: 'doubleRainbowOMG',
        xor: true
      }
    ],
    gui = new dat.GUI(),
    controllers = {
      colorSet: gui.add(swirl, 'colorSet', ['complementary', 'blackAndWhite', 'colorDepth', 'greyScale', 'doubleRainbowOMG']).onFinishChange(function(value) {
          fnStrokeColor = colorSet[value][0];
          fnFillColor = colorSet[value][1];
        }),
      xor: gui.add(swirl, 'xor').onFinishChange(function(value) {
          ctx.globalCompositeOperation = compositeOperation = value ? 'xor' : 'source-over';
        }),
      lineWidth: gui.add(swirl, 'lineWidth', 0, 200).step(1),
      rotationSpeed: gui.add(swirl, 'rotationSpeed', 0, 100),
      rotationGap: gui.add(swirl, 'rotationGap', 1, 100).step(1),
      circleAmount: gui.add(swirl, 'circleAmount', 5, 50).step(1),
      colorSpeed: gui.add(swirl, 'colorSpeed', 0, 100),
      togglePreset: gui.add(swirl, 'togglePreset'),
      screenshot: gui.add(swirl, 'screenshot')
    };

// Functions definition
    
function initEvents() {
  window.onresize = function() {
    resizeCanvas();
  }
  canvas.ontouchstart = canvas.onmousedown = function(e) {
    mouseDown = 1;
    mouseX = (e.pageX-centerX);
    mouseY = (e.pageY-centerY);
  }
  canvas.ontouchend = canvas.onmouseup = function() {
    mouseDown = 0;
  }
  canvas.ontouchmove = canvas.onmousemove = function(e) {
    mouseX = (e.pageX-centerX)*mouseDown;
    mouseY = (e.pageY-centerY)*mouseDown;
  }
}

function resizeCanvas() {
  height = window.innerHeight,
  width = window.innerWidth;
  
  canvas.height = height;
  canvas.width = width;
  
  centerX = Math.round(width/2);
  centerY = Math.round(height/2);
}
  
function drawCircle(offset, distance, width, strokeColor, fillColor, ratio) {
  var offset = offset*Math.PI*2;
  
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  
  ctx.beginPath();
  ctx.arc((centerX+offsetX*(1-ratio)+Math.cos(offset)*distance), (centerY+offsetY*(1-ratio)+Math.sin(offset)*distance), width, 0, Math.PI*2, true);
  ctx.fill();
  if(swirl.lineWidth) ctx.stroke();
}

function frame() {
  requestAnimFrame(frame);
  
  var i = circleAmount = swirl.circleAmount,
      maxWidth = Math.sqrt(centerX * centerX + centerY * centerY),
      minRatio = 1/circleAmount,
      minWidth = minRatio*maxWidth,
      distance = minWidth*swirl.rotationGap/100,
      ratio;
  
  if(swirl.xor) ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = fnFillColor(circleAmount, circleAmount);
  ctx.fillRect(0, 0, width, height);
  
  ctx.lineWidth = (swirl.lineWidth/100*minWidth);
  if(swirl.xor) ctx.globalCompositeOperation = compositeOperation;
  
  offsetX = offsetX+(mouseX-offsetX)/10;
  offsetY = offsetY+(mouseY-offsetY)/10;
  
  while(i--) {
    ratio = (i+1)/circleAmount;
    drawCircle(currentFrame*ratio, distance, maxWidth*ratio, fnStrokeColor(i, circleAmount), fnFillColor(i, circleAmount), ratio);
  }
  
  currentFrame += swirl.rotationSpeed/1000;
  colorFrame += swirl.colorSpeed/100;
}

// Execution !
    
resizeCanvas();
initEvents();
frame();