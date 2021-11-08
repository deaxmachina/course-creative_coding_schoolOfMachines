// Assignment 1 (Week 1, 1)
// Order, 9 or 99 lines
// Your call if you wanna work with 9 or 99!

const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');

// You can force a specific seed by replacing this with a string value
const defaultSeed = ''

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
  const { context, width, height, units } = props;

  // Holds all our 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];

  // Triangle facing right and down
  let p = createPath()
  p.moveTo(0, 0)
  for (let i = 0; i < 98; i++) {
    let increment = i/4
    p.lineTo(0, increment)
    p.moveTo(increment, increment*1.2)
  }
  paths.push(p)

  // Triangle facing left and down
  let p2 = createPath()
  p2.moveTo(width-2, 2)
  for (let i = 1; i < 10; i++) {
    const increment = i/2
    p2.lineTo(0, height/increment)
    p2.moveTo(width-2, 2)
  }
  paths.push(p2)
    

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
    foreground: '#ee6c4d',
    background: '#293241',
    // in working units; you might have a thicker pen
    lineWidth: 0.1,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);