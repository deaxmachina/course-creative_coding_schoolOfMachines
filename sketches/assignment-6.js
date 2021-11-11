// Assignment 6 (Week 1, 6)
// 99 lines and 99 points

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')

const settings = {
  dimensions: [ 2048, 2048 ]
};

const toCircle = (x, y, length, angle) => {
  const radians = angle / 180 * Math.PI;
  const endX = x + length * Math.cos(radians);
  const endY = y - length * Math.sin(radians);
  return {radians, endX, endY}
}

// Artwork function
const sketch = () => {
  return ({ context, width, height }) => {
    // Background
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    // Draw line around a circle
    const drawAngledLine = function(x, y, length, angle) {
      const {radians, endX, endY} = toCircle(x, y, length, angle)
      context.strokeStyle ='#ebebeb'
      context.lineWidth = 5
      context.lineCap = "round"
      context.beginPath();
      context.moveTo(x, y)
      context.lineTo(endX, endY);
      context.closePath();
      context.stroke();
    }

    // Draw dot in a circle
    const drawDot = function(x, y, length, angle) {
      const {radians, endX, endY} = toCircle(x, y, length, angle)
      //context.strokeStyle ='#ebebeb'
      context.strokeStyle ='rgba(255, 255, 255, 0.8)'
      context.lineWidth = 15
      context.beginPath();
      context.moveTo(endX, endY)
      context.lineCap = "round"
      context.lineTo(endX+10, endY+10);
      context.closePath();
      context.stroke();
    }

    // Draw 99 lines around a circle with fixed radius 
    // also 99 dots in a circle with radius capped at a fixed value 
    // thus most of the dots lie on the same radius but some go off randomly
    for (let i = 0; i < 100; i++) {
      const length = width/2 * Math.random()
      const radius = Math.abs(random.noise2D(i, i*10)) * 1000
      // draw lines
      drawAngledLine(width/2, height/2, 500, i*3.6)
      // draw dots
      drawDot(width/2, height/2, 
        Math.max(700, (width-1100) * Math.random()), 
        i*3.6)
    }
    
  };
};

// Start the sketch
canvasSketch(sketch, settings);