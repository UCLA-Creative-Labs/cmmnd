# Creative Labs X CMMND Collaborative Project, UCLA Spring 2019
# Music visualizer for the CMMND EP

## TODO
  - superclass for scenes that handles the postprocessing 
  - display loading text under cmmnd logo in loading screen (getting 100 donuts... etc)
  - sunset scene morph
  - scene merging*** (works)
    - fix positioning bug
  - update camera positions (reset?? why r they doing this)
  - optimization 
  https://stackoverflow.com/questions/47807069/three-js-loading-big-obj-file-about-300-mb-will-crash-the-browser-and-take-m/47847417#47847417
  - textures/models are too big? 

## Finished scenes
  - cmmnd  
  - intersection 
  - space
  


## Implementation
Scene Handling 

Each Scene will be a separate class instance, the transitions to these scenes are
handled by the audiocontroller class which plays each track in order or according to user actions.


## Web Audio API 
There are only several things you need to worry about when working with the Web Audio API

The Analyser: this is what parses all the audio into audio data, it gives us two arrays

  1. pitch_array: determines the pitch (high frequency) and bass (low frequency)
  2. volume_array: determines the volume (from the amplitude)

We'll basically be using these to produce the dynamic, real time effects in the scene. Everytime animate() is called (each new frame), these two buffers will be filled with audio data from whatever source we specify, all that's left to us is to link the elements in the array to variables that we can then use to scale, rotate, etc. our shapes.

Here's an example of drawing a sine wave from mdn

```
...

function draw() {

  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
draw();

```

### Other semi-important things: 

analyser.fftsize: basically determines the amount of data values you have to play around with 
analyser.smoothingTimeConstant: double value from 0 to 1 that will smooth your set of values over time (smoother audiodata) (default is .8)

It might be helpful to change some variables around and get the cube to move differently to get a feel for how 
the audio data will be converted to movement etc. later on.

i think that's it but [here's](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) the mdn documentation for the analyser if you need more info 

More complex [beat detection](http://joesul.li/van/beat-detection-using-web-audio/)


## Scene integration
When each song ends, a new song is played and a new scene is rendered. 
Each scene is an object  with init and animate functions

## To Be Continued
Because this was our first three.js app, there were a lot of things we didn't fully implement due to time and performance. 
With this in mind, these are some of the features + optimizations we learned about when working on the project, 
researching three.js, and exploring the field of graphics that can be used to make the site faster and more dynamic. 
These can be implemented in later versions or just kept for future reference.  

- Instancing 
- Low poly models
- BufferGeometry > Geometry : less overhead 

And a couple notes for organization and better practices going forward
- using npm and webpack for bundling
- 