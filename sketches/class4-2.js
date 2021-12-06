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

const rectangleSubdivision = (x, y, width, height, depth, maxDepth, p) => {
  // Stopping condition: If our current recursion  depth is 
  // larger than the max depth we want to get to, we just 
  // draw the subdivision we've arrived and stop calling the function
  if (depth > maxDepth) return 

  // Move the x and y coords a bit randomly 
  // depending on the current i.e. previous iteration x and y 
  x = x + Random.noise3D(x, y, depth, 0.75, 1)
  y = y + Random.noise3D(x, y, depth, 0.02, 0.2)

  // Draw the rect specified by the current coords 
  p.moveTo(x, y)
  p.lineTo(x + width, y)  
  p.lineTo(x + width, y + height) // SWAP B
  p.lineTo(x, y + height) // SWAP A
  p.lineTo(x, y)

  // Draw 4 rectanges 
  // Top left quarter 
  if (Random.range(0, 1) < 0.9) rectangleSubdivision(x, y, width/2, height/2, depth+1, maxDepth, p)
  // Top-right quarter
  if (Random.range(0, 1) < 0.7) rectangleSubdivision(x + width / 2, y, width / 2, height / 2, depth + 1, maxDepth, p)
  // Bottom-left quarter
  if (Random.range(0, 1) < 0.8) rectangleSubdivision(x, y + height / 2, width / 2, height / 2, depth + 1, maxDepth, p)
  // Bottom-right quarter
  if (Random.range(0, 1) < 0.85) rectangleSubdivision(x + width / 2, y + height / 2, width / 2, height / 2, depth + 1, maxDepth, p)

}

const sketch = (props) => {
  const { width, height, units } = props;

  // Holds all our 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];
  const p = createPath()
  rectangleSubdivision(0, 0, width, height, 0, 7, p)
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
    lineWidth: 0.03,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: '#565264',
    foreground: '#a6808c'
  });
};

canvasSketch(sketch, settings);
