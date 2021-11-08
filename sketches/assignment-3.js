// Assignment 3 (Week 1, 3)
// Somewhere Between Order and Chaos

const canvasSketch = require('canvas-sketch');

// Sketch parameters
const settings = {
  dimensions: 'a4',
  pixelsPerInch: 300,
  units: 'in'
};

// Artwork function
const sketch = () => {
  return ({ context, width, height }) => {
    // Margin in inches
    const margin = 1 / 4;

    // Off-white background
    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    // Gradient foreground
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, '#7400b8');
    fill.addColorStop(1, '#80ffdb');

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    // Triangular clipping region 
    context.fillStyle = 'white'
    context.beginPath();
    context.moveTo(width/2, height/6);
    context.lineTo(width/2+3.5, height/6+7);
    context.lineTo(width/2-3.5, height/6+7);
    context.fill()
    context.clip()

    // Draw lines starting from center and random length and dir
    context.strokeStyle = 'rgba(116,0,184,0.4)'
    context.strokeStyle = 'rgba(72, 191, 227,0.5)';
    context.lineCap = "round" 
    for (let i = 0; i < 100; i++) {
      context.lineWidth = Math.random()*0.3
      context.beginPath()
      context.moveTo(width/2, height/2)
      context.lineTo(width*Math.random(), height*Math.random())
      context.stroke()
    }
  };
};

// Start the sketch
canvasSketch(sketch, settings);