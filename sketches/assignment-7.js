// Assignment 7 (Week 1, 7)
// Broken Grid

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 2048, 2048 ]
};
const margin = 150

// Artwork function
const sketch = () => {
  return ({ context, width, height }) => {
    // Background
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    // Create points as array of grid coords and props
    const createGrid = (count=60) => {
      const points = []
      for (let x = 0; x < count; x++ ) {
        for (let y = 0; y < count; y++) {
          // get coords which are between 0 and 1 
          const u = x/(count - 1)
          const v = y/(count - 1)
          points.push({
            colour: '#f94144',
            position: [ u, v ],
            radius: 12*Math.random()
          })
        }  
      }
      return points
    }
    // get the data - experiment with the number of point
    const points = createGrid(150)
    
    // draw a random arc for each point
    points.forEach((data) => {
      const { position, radius, colour } = data
      const [u, v] = position
      // interpolate from margin and not from top 
      const x = lerp(margin, width-margin, u)
      const y = lerp(margin, height-margin, v)
      // draw circles for the points
      context.beginPath()
      context.arc(x, y, radius, 0, 2*Math.PI*Math.random(), true)
      context.fillStyle = colour
      context.strokeStyle = colour
      context.lineWidth = 5
      context.lineCap = 'round'
      //context.fill()
      context.stroke()

    })
    
  };
};

// Start the sketch
canvasSketch(sketch, settings);