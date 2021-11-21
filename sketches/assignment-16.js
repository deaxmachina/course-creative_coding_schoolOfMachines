// 16. Frequency increases left to right
// 1D, 2D, 3D or even 4D noise if you feel like it!

const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');

// You can force a specific seed by replacing this with a string value
const defaultSeed = '';

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

// Print to console so we can see which seed is being used and copy it if desired
console.log('Random Seed:', Random.getSeed());

const settings = {
  suffix: Random.getSeed(),
  dimensions: 'A4',
  orientation: 'portrait',
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'cm'
};

const sketch = (props) => {
  const { width, height, units } = props;

  // Holds all our 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];

  

  // step size 
  let stepX = 0.3
  let stepY = 0.3

  for (let x=0; x<=width; x+=stepX) {
    for (let y=0; y<=height; y+=stepY) {
      let p = createPath()
      // create some noise in 2D
      let noiseXY = Random.noise2D(x, y, 0.1, 0.2*x)
      console.log(noiseXY)
      //p.moveTo(x, y)
      p.arc(x+noiseXY, y+noiseXY, 0.15, 0, 2*Math.PI)
      //p.lineTo(x + noiseXY, y + noiseXY)
      paths.push(p)
    }
  }
  
  




  let lines = pathsToPolylines(paths, { units });

  // Clip to bounds, using a margin in working units
  const margin = 1; // in working 'units' based on settings
  const box = [ margin, margin, width - margin, height - margin ];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPaths(lines, {
    ...props,
    lineJoin: 'round',
    lineCap: 'round',
    // in working units; you might have a thicker pen
    lineWidth: 0.07,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: 'black',
    foreground: 'white'
  });
};

canvasSketch(sketch, settings);
