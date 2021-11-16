// Week 2, 6 (Assignment 13)
// One imperfect circle
// x = cos(angle), y = sin(angle * 2)? Just throwing ideas out there.

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

  const paths = [];

  const p = createPath()
  // circle in the center of the page 
  let centerX = width/2
  let centerY = height/2

  // step is the angle increment for drawing each point 
  let step = 0.05 // in radians 

  // start angle at 0 and increment by step radians 
  let r = 0;
  for (let angle = 0; angle <= 2 * Math.PI; angle = angle + step) {
    // want the x and y coord for the point 
    let x = Math.cos(angle) + centerX
    // imperfect circle
    let y = Math.sin(angle * 1.5) + centerY
    // draw a circle of gradually increasing radius at each point
    p.arc(x, y, 3+r, 0, 2*Math.PI)
    r += 0.08*Math.random() // increment the radius by a bit
  }
  paths.push(p)


  let lines = pathsToPolylines(paths, { units });
  const margin = 1; // in working 'units' based on settings
  const box = [ margin, margin, width - margin, height - margin ];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPaths(lines, {
    ...props,
    lineJoin: 'round',
    lineCap: 'round',
    background: '#14213d',
    foreground: '#f4f1de',
    // in working units; you might have a thicker pen
    lineWidth: 0.05,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);
