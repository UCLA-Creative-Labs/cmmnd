ok so before u work a lot on ur scene tmrw i'd recommend looking at this branch
https://github.com/UCLA-Creative-Labs/cmmnd/tree/transition_scenes
the way scene transitioning is gunna work is through the audiocontroller, 
when the currentScene being rendered is changed by the audiocontroller, 
the current requestAnimationFrame(render) will cancel and render a new scene
i'm not entirely sure about how we'll get transitions in, but we can worry about that later

objects.js 
i put all my objects that used loaders here (texture,mtl,obj loaders) and would recommend you do that too

index.html
i added a loading manager that should wait until all loaded resources are finished loading to begin playing
audio and showing the scene, this way, you can define variables to common objects such as car and load them 
then add them to the scene once all the loading is finished. i defined these variables in index.html under common objects 

_____.js // scene
* it will be easier to transition scenes if you guys have your scenes wrapped in a class 
like this, index.html will just be calling SpaceScene.animate() and SpaceScene.scene() in the render loop
and initScene() once 

* here's an example class definition
```
/* space scene definition */
class SpaceScene { 
	constructor() { 
		this.scene = new THREE.Scene();
	}

	setCar(obj) { 
		// set position of passed in car object from common objects
	}
	
	initScene() { 
		// initialize scene objects using common object or helper functions
		// add objects to this.scene
	}

	update(pitch_array) {
		// update objects within the scene
	}

	animate() {
        const pitch_array = audio.getFreqData();
		this.update(pitch_array);
		// calls update
    }

}

```

