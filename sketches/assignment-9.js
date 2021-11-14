// Week 2, Assignment 2 (9)
// Triple nested loops
//  A for inside of a for inside of a for (inside of a for?). Prompt Credit: Piter Pasma & Genuary 2021

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

  // Draw random arcs
  const count = 450;
  const stepChange = 3
  const radius = 1.4

  const createConcentricCircles = (x, y) => {
    for (let r = 0; r < radius; r+=0.2) {
      const p = createPath()
      p.arc(x, y, r, 
        0, 
        //2 * Math.PI * Math.random()
        Math.min(3*Math.PI/2, 2 * Math.PI * Math.random())
        )
      paths.push(p)
    }
  }
  
  for (let x=radius*2; x<width-radius*2; x+=2) {
    for (let y=radius*2; y<height-radius; y+=2) {
      createConcentricCircles(x, y)
    }
  }
  

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
    foreground: '#ff006e',
    //foreground: 'white',
    background: 'black',
    // in working units; you might have a thicker pen
    lineWidth: 0.1,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);
