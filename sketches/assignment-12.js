// Assignment 12 (Week 2, Assignment 5)
// 9 or 99 circles (and nothing else)
const canvasSketch = require('canvas-sketch');
const { renderPaths, createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const { clipPolylinesToBox } = require('canvas-sketch-util/geometry');
const Random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math')

const margin = 8

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


  const createGrid = () => {
    const points = []
    const count = 3
    for (let x = 0; x < count; x++ ) {
      for (let y = 0; y < count; y++) {
        // get coords which are between 0 and 1 
        const u = x/(count - 1)
        const v = y/(count - 1)
        points.push({
          color: 'black',
          position: [ u, v ],
          radius: Math.random()*5
        })
      }  
    }
    return points
  }

  const points = createGrid()

  points.forEach(data => {
    const { position, radius, color } = data
    const [u, v] = position

    // interpolate from margin and not from top 
    const x = lerp(margin, width-margin, u)
    const y = lerp(margin, height-margin, v)

    const p = createPath()
    p.arc(x, y, radius, 0, 2 * Math.PI)
    paths.push(p)
  })


  // Convert the paths into polylines so we can apply line-clipping
  // When converting, pass the 'units' to get a nice default curve resolution
  let lines = pathsToPolylines(paths, { units });

  // Clip to bounds, using a margin in working units
  const box = [ 1, 1, width - 1, height - 1 ];
  lines = clipPolylinesToBox(lines, box);

  // The 'penplot' util includes a utility to render
  // and export both PNG and SVG files
  return props => renderPaths(lines, {
    ...props,
    lineJoin: 'round',
    lineCap: 'round',
    // in working units; you might have a thicker pen
    lineWidth: 0.5,
    background: 'black',
    foreground: 'white',
    // Optimize SVG paths for pen plotter use
    optimize: true
  });
};

canvasSketch(sketch, settings);
