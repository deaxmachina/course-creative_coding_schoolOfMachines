// 20. Illusion of depth
// Does it come from the contrast of scale? Or maybe shading?

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
  // dimensions: 'A3',
  // orientation: 'portrait',
  dimensions: [ 30, 30 ],
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'cm'
};

const sketch = (props) => {
  const { width, height, units } = props;

  // Holds all our 'path' objects
  // which could be from createPath, or SVGPath string, or polylines
  const paths = [];

  // Goal: Make concentric circles 
  // 1. Make a single circle out of lines going inwards 
  const centerX = width/2
  const centerY = height/2

  const step = 0.01
  const makeCircle = (innerRadius, outerRadius, step) => {
    for (let angle=0; angle<=2*Math.PI; angle+=step) {
      let xInner = innerRadius*Math.cos(angle) + centerX 
      let yInner = innerRadius*Math.sin(angle) + centerY
  
      let xOuter = outerRadius*Math.cos(angle) + centerX//+Random.noise1D(angle, 1, 0.5) 
      let yOuter = outerRadius*Math.sin(angle) + centerY//+Random.noise1D(angle, 1, 0.5)
      let p = createPath()
      p.moveTo(xInner, yInner)
      p.lineTo(
        xOuter+Random.noise1D(angle, 1.5, 0.5), 
        yOuter+Random.noise1D(angle, 1.5, 0.5))
      paths.push(p)
    }
  }
  for (let radius=1; radius<=12; radius++) {
    makeCircle(radius, radius+1, step)
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
    lineWidth: 0.06,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: '#006466', //'#b5179e' '#f72585',
    foreground: '#4d194d' //'#3f37c9' '#480ca8'
  });
};

canvasSketch(sketch, settings);
