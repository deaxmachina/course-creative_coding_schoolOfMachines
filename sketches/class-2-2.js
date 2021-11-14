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

  // Draw bezier curves
  // let quadraticBezier = createPath()
  // quadraticBezier.moveTo(2, 2)
  // quadraticBezier.quadraticCurveTo(8, 2, 8, 8)
  // paths.push(quadraticBezier)

  // let cubicBezier = createPath()
  // cubicBezier.moveTo(8, 2)
  // cubicBezier.bezierCurveTo(8, 8, 16, 2, 16, 8)
  // paths.push(cubicBezier)

  let p = createPath()
  let step = 1 

  // First diagonal
  for (let x = 0; x <= width; x += step) {
    for (let y = 0; y <= height; y += step) {
      // draw a point 
      //p.arc(x, y, 10, 0, Math.PI)
      // Point A - the origin 
      let A = { x: x, y: y }
      // Point B - the destination: bottom right of grid cell 
      let B = { x: x + step, y: y + step }
      // Point C - control point
      // choose at random one of the other two corner of the square 
      let C = Random.pick([
        { x: x, y: y + step }, // bottom left of grid cell
        { x: x + step, y: y } // top right of  grid cell
      ])

      p.moveTo(A.x, A.y)
      p.quadraticCurveTo(C.x, C.y, B.x, B.y)
    }

    // Second diagonal 
    for (let x = 0; x <= width; x += step) {
      for (let y = 0; y <= height; y += step) {
        // Point A - the origin 
        let A = { x: x, y: y }
        // Point B - destination 
        let B = { x: x - step, y: y + step }
        // Point C - control point 
        let C = Random.pick([
          { x: x - step, y: y }, // top left 
          { x: x, y: y + step } // bottom right
        ])

        p.moveTo(A.x, A.y)
        p.quadraticCurveTo(C.x, C.y, B.x, B.y)
      }
    }
  }
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
    lineWidth: 0.08,
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);
