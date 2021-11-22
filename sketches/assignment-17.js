// Assignment 17 
// noise(x) * sin(x)
// What's the relationship between the noise frequency and the sine frequency? What about the amplitudes? Does the noise lead and the sine follow, or viceversa?

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


  // Draw a circle from scratch 
  const drawCircle = (centerX, centerY, radius) => {
    const p = createPath()
    let step = 0.02
  
    for (let angle = 0; angle <= 2 * Math.PI; angle = angle + step) {    
      let x = Math.cos(angle) * radius + centerX
      let y = Math.sin(angle) * radius + centerY
  
      // And we add noise to our x and y coordinates.
      // Note how we're using "angle" as the first parameter of the noise.
      let noiseX = x + Random.noise1D(angle*radius, 1, 0.5)
      let noiseY = y + Random.noise1D(angle*radius, 1, 0.5)

      let noiseXY = Random.noise2D(x, y, 0.3, 0.3)

      if (angle == 0) p.moveTo(noiseX, noiseY)
      else p.lineTo(x + noiseXY, y + noiseXY)
    }
  
    return p
  }

  for (let i = 0; i < 10; i+=0.5) {
    let p = drawCircle(width / 2, height / 2, i)
    paths.push(p)
  }


  for (let x = 0; x < width; x+=0.3) {
    for (let y = 0; y < height; y+=0.3) {
      let p = createPath()
      let noiseX = Random.noise1D(x, 1, 10)*Math.cos(x)
      p.moveTo(x, y + noiseX)
      p.lineTo(x + 0.1, y + noiseX + 0.1)
      paths.push(p)
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
    // in working units; you might have a thicker pen
    lineWidth: 0.08,
    // Optimize SVG paths for pen plotter use
    optimize: true,
    background: '#000',
    foreground: '#fff'
  });
};

canvasSketch(sketch, settings);
