# Creative Labs X CMMND Collaborative Project, UCLA Spring 2019
# Music visualizer for the CMMND EP

## TODO
  - add loading bar 
  - initscene on loading
  - sunset scene
  - gif -> video that loops
    - https://www.google.com/search?q=convert+gif+to+video&oq=convert+gif+to+video&aqs=chrome.0.0l6.3464j0j9&sourceid=chrome&ie=UTF-8
  - scene merging*** (works)
    - fix positioning bug
    - reset car inbetween scenes 
  - post processing effect
  - play audio in succession (done)
  - loading manager (wait for car to load before beginning scene)
    - on load to play audio

  - optimization 
  https://stackoverflow.com/questions/47807069/three-js-loading-big-obj-file-about-300-mb-will-crash-the-browser-and-take-m/47847417#47847417
  - textures/models are too big? 

  
## Implementation
Scene Handling 

Each Scene will be a separate class instance, the transitions to these scenes are
handled by the audiocontroller class and will be masked by some transition postprocessing shader. 

Two ways
  1. Render a new scene for each scene
  2. Switch out the objecs for each scene

Using timer to track time between scenes and initiate scene changes. Keep checking timer throughout 
Timer will hold default scene progression (extend THREE.Clock ??)

```
var au = document.createElement('audio');
au.addEventListener('loadedmetadata',function(){
    au.setAttribute('data-time',au.duration);
},false);

```

## Web Audio API 
There are only several things you need to worry about for the Web Audio API

The Analyser: this is what parses all the audio into audio data, it gives us two arrays

  1. frequency_array: determines the pitch (high frequency) and bass (low frequency)
  2. volume_array: determines the volume (from the amplitude)

We'll basically be using these two arrays to produce the dynamic, real time effects in the scene. Everytime animate() is called (each new frame), these two arrays will be filled with audio data from whatever source we specify, all that's left to us is to link the elements in the array to variables that we can then use to scale, rotate, etc. our shapes

For now, I just have the cube rotating based on the 'pitch' (the frequency data) 

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

Other semi-important things: 

analyser.fftsize: basically determines the amount of data values you have to play around with 
analyser.smoothingTimeConstant: double value from 0 to 1 that will smooth your set of values over time (smoother audiodata) (default is .8)

It might be helpful to change some variables around and get the cube to move differently to get a feel for how 
the audio data will be converted to movement etc. later on.

i think that's it but [here's](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) the mdn documentation for the analyser if you need more info 

More complex [beat detection](http://joesul.li/van/beat-detection-using-web-audio/)

## Orbitcontrols 
Three.js has a built-in [orbit control system]( )

## Car animation
Three.js has a built in [animation system](https://threejs.org/docs/#manual/en/introduction/Animation-system)

## Shader Effects
- [VHS quality grain](https://www.youtube.com/watch?v=9eFVeErnUzg)
- shape distortion with [fractal brownian motion](https://thebookofshaders.com/13/)
- text distortion sine wave


## Scene integration
When each song ends, a new song is played and a new scene is rendered. 
Each scene is an object  with init and animate functions

