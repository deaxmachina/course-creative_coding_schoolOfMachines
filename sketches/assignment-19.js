// ### 19. Every time you call lineTo(), you also have to call arc()

// Where is the arc placed in relation to the line? 
// Is it a full circle, or a partial one? What about its scale?

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

  // 1. go round a circle and just draw arcs
  const step = 0.02
  const radiusStart = 9
  let radiusEnd = 4
  const centerX = width/2
  const centerY = height/2
  for (let angle=0; angle<=2*Math.PI; angle+=step) {
    let xStart = radiusStart*Math.cos(angle) + centerX
    let yStart = radiusStart*Math.sin(angle) + centerY

    radiusEnd = radiusEnd+Random.range(-0.5, 0.5)
    console.log(radiusEnd)
    let xEnd = radiusEnd*Math.cos(angle) + centerX
    let yEnd = radiusEnd*Math.sin(angle) + centerY

    let p = createPath()
    p.moveTo(xStart, yStart)
    p.lineTo(xEnd, yEnd)
    p.arc(xEnd-Random.range(0, 0.5), yEnd-Random.range(0, 0.5), 0.1, 0, 2*Math.PI)
    paths.push(p)
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
    // in working units; you might have a thicker pen
    lineWidth: 0.07,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: '#14213d',
    foreground: '#f2e9e4'
  });
};

canvasSketch(sketch, settings);
