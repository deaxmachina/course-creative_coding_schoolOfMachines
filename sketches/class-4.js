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

const drawCircles = (x, y, radius, p) => {
  if (radius < 0.25) return // stopping condition
  p.moveTo(x+radius, y) // to move to the right start
  p.arc(x, y, radius, 0, 2*Math.PI)
  // call the function again with a smaller radius 
  drawCircles(x, y, radius-0.5, p)
}

const drawRectangles = (x, y, width, height, depth, p) => {

  if (depth > 7) return 

  x = x + Random.noise3D(x, y, depth, 0.75, 1)
  y = y + Random.noise3D(x, y, depth, 0.05, 0.2)

  p.moveTo(x, y)
  p.lineTo(x + width, y)
  p.lineTo(x + width, y + height)
  p.lineTo(x, y + height)
  p.lineTo(x, y)


  if (Random.range(0, 1) < 0.8) {
    drawRectangles(x, y, width/2, height/2, depth+1, p)
  }
  if (Random.range(0, 1) < 0.9) {
    drawRectangles(x+width/2, y, width/2, height/2, depth+1, p)
  }
  if (Random.range(0, 1) < 0.7) {
    drawRectangles(x, y+height/2, width/2, height/2, depth+1, p)
  }
  //drawRectangles(x+width/2, y+height/2, width/2, height/2, depth+1, p)
  drawRectangles(x+width/2, y+width/2, width/2, height/2, depth+1, p)
}


const sketch = (props) => {
  const { width, height, units } = props;

  // Holds all our 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];

  const p = createPath()
  //drawCircles(width/2, height/2, 15, p)
  drawRectangles(1, 1, width-2, height-2, 1, p)
  paths.push(p)

  // Convert the paths into polylines so we can apply line-clipping
  // When converting, pass the 'units' to get a nice default curve resolution
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
    lineWidth: 0.02,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: 'black', 
    foreground: 'white'
  });
};

canvasSketch(sketch, settings);
