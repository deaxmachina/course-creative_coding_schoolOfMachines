// Assignment 4 (Week 1, 4)
// At Least 99 Identical Squares

const canvasSketch = require('canvas-sketch');

// Sketch parameters
const settings = {
  dimensions: [ 12, 12 ],
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
    fill.addColorStop(0, '#22223b');
    fill.addColorStop(1, '#4a4e69');

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    // 99 concentric squares getting bigger and brighter
    //context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 100; i++) {
      context.lineWidth = 0.001*i
      context.strokeStyle = `rgba(255, 255, 255, ${i/100+0.1})`;
      const rectWidth = i/9
      context.strokeRect(0.5, 0.5, rectWidth, rectWidth);
    }
  };
};

// Start the sketch
canvasSketch(sketch, settings);