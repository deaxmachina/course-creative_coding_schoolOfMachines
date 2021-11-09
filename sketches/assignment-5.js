// Assignment 5 (Week 1, 5)
// Gradual Change, Top to Bottom
// What is the subject of change? Scale, density, negative space, how orderly everything is? Maybe the gradual change is in the code, not in the composition? Or maybe this composition doesn’t involve code at all – could be a drawing, a video of a short performance, a speech, a letter.

const canvasSketch = require('canvas-sketch');

// Sketch parameters
const settings = {
  dimensions: [ 12, 16 ],
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
    const fill = context.createLinearGradient(
      width/2, 0, width/2, height
      );
    fill.addColorStop(0, '#1d3557');
    fill.addColorStop(1, '#e63946');

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    context.strokeStyle ='#22223b'
    // rows of lines such that for each next row the lines are more and more slanted to the right and thinner stroke
    for (let j = 0; j < 15; j++) {
      context.lineWidth = 0.13 - j/100
      for (let position=2; position<width-1; position+=0.15) {
        context.beginPath();
        context.moveTo(position, margin+j);
        context.lineTo(position-1*j/8, j+1.1);
        context.stroke();
      }  
    }

  };
};

// Start the sketch
canvasSketch(sketch, settings);