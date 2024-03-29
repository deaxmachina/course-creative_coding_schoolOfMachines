// Assignment 10 (Week 2, Assignment 3)
//  No straight lines
// And no grids, if you feel up for it.

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

  // Bezier curves with slight variation of control points
  let cubicBezier = createPath()
  const a = { x: 0, y: 0 } // start
  const b = { x: width, y: height } // end 
  const c = { x: width+10, y: 10 } // control 1 
  const d = { x: -width+10, y: height-10 } // control 2
  cubicBezier.moveTo(a.x, a.y)
  // cubicBezier.bezierCurveTo(c.x, c.y, d.x, d.y, b.x, b.y)
  // paths.push(cubicBezier)

  const possibleSteps = [0, 1/2]
  for (let i = 0; i < 40; i++) {
    cubicBezier.moveTo(a.x, a.y)
    //if (Random.value() < 0.3) continue
    cubicBezier.bezierCurveTo(
      c.x+i*Random.pick([0, 1, 2]), Random.pick([0, 0.5]), 
      d.x-i*Random.pick([0, 1, 2]), d.y+Random.pick([0, 0.5]), 
      b.x, b.y)
    paths.push(cubicBezier)
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
    foreground: 'white',
    background: 'black',
    lineWidth: 0.03,
    optimize: true
  });
};

canvasSketch(sketch, settings);
