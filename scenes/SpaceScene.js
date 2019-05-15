(function() {
	'use strict';
	/* 	'To actually be able to display anything with Three.js, we need three things:
		A scene, a camera, and a renderer so we can render the scene with the camera.' 
	   		
	   		- https://threejs.org/docs/#Manual/Introduction/Creating_a_scene 		*/

	var scene, camera, renderer;

	/* We need this stuff too */
	var container, aspectRatio,
		HEIGHT, WIDTH, fieldOfView,
		nearPlane, farPlane,
		mouseX, mouseY, windowHalfX,
		windowHalfY, stats, geometry,
		starStuff, materialOptions, stars,cube;

	// init();
	// animate();

	function init() {
		container = document.createElement('div');
		document.body.appendChild( container );
		document.body.style.overflow = 'hidden';

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 75;
		nearPlane = 1;
		farPlane = 1000;
		mouseX = 0;
		mouseY = 0;

		windowHalfX = WIDTH / 2;
		windowHalfY = HEIGHT / 2;

	/* 	fieldOfView — Camera frustum vertical field of view.
			aspectRatio — Camera frustum aspect ratio.
			nearPlane — Camera frustum near plane.
			farPlane — Camera frustum far plane.	

			- https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

		 	In geometry, a frustum (plural: frusta or frustums) 
		 	is the portion of a solid (normally a cone or pyramid) 
		 	that lies between two parallel planes cutting it. - wikipedia.		*/

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

		//Z positioning of camera

		camera.position.z = farPlane / 2;
		
		scene = new THREE.Scene({antialias:true});
		scene.fog = new THREE.FogExp2( 0x000000, 0.0003 );

		// The wizard's about to get busy.
		starForge();
		
		//check for browser Support
		if (webGLSupport()) {
			//yeah?  Right on...
			renderer = new THREE.WebGLRenderer({alpha: true});

		} else {
			//No?  Well that's okay.
			renderer = new THREE.CanvasRenderer();
		}

		renderer.setClearColor(0x000011, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize( WIDTH, HEIGHT);
		container.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.right = '0px';
		container.appendChild( stats.domElement );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onMouseMove, false );
		
	}

	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();
		
		
		//web-audi0 API stuff
		
	 //deals with pitch (and bass)
    analyser.getByteFrequencyData(pitch_array);
    //deals with volume
    analyser.getByteTimeDomainData(volume_array);

    var speed;
    for( var i = 0; i < bufferlen; i++){ 
        speed = pitch_array[i]
        cube.rotation.x += 0.0000005 * speed;
        if( speed > 180) {
        cube.rotation.y += 0.000001 * speed;
        cube.scale.x -= .0001;
        cube.scale.y -= .0001; 
        cube.scale.z -= .0001;
		  //for stars
		stars.material.color= 0xffffff;
        }
        if (speed > 255) {
        cube.rotation.x += 0.000001 * speed;
        cube.scale.x += .0001;
        cube.scale.y += .0001; 
        cube.scale.z += .0001;
		  stars.material.color= 0xeeeee;
        }
    }
	}


	function render() {
		camera.position.x += ( mouseX - camera.position.x ) * 0.005;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.005;
		camera.lookAt( scene.position );
		renderer.render(scene, camera);
	}

	function webGLSupport() {
		/* 	The wizard of webGL only bestows his gifts of power
			to the worthy.  In this case, users with browsers who 'get it'.		*/

		try {
			var canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (
				canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
			);
		} catch(e) {
			// console.warn('Hey bro, for some reason we\'re not able to use webGL for this.  No biggie, we\'ll use canvas.');
			return false;
		}
	}

	function onWindowResize() {

		// Everything should resize nicely if it needs to!
	  	var WIDTH = window.innerWidth,
	  		HEIGHT = window.innerHeight;

	  	camera.aspect = aspectRatio;
	  	camera.updateProjectionMatrix();
	  	renderer.setSize(WIDTH, HEIGHT);
	}

	function starForge() {
		/* 	Yep, it's a Star Wars: Knights of the Old Republic reference,
			are you really surprised at this point? 
													*/
		var starQty = 45000;
			geometry = new THREE.SphereGeometry(1000, 100, 50);

	    	materialOptions = {
	    		size: 1.0, //I know this is the default, it's for you.  Play with it if you want.
	    		transparency: true, 
	    		opacity: 0.7
	    	};

	    	starStuff = new THREE.PointCloudMaterial(materialOptions);

		// The wizard gaze became stern, his jaw set, he creates the cosmos with a wave of his arms

		for (var i = 0; i < starQty; i++) {		

			var starVertex = new THREE.Vector3();
			starVertex.x = Math.random() * 2000 - 1000;
			starVertex.y = Math.random() * 2000 - 1000;
			starVertex.z = Math.random() * 2000 - 1000;

			geometry.vertices.push(starVertex);

		}


		stars = new THREE.PointCloud(geometry, starStuff);
		scene.add(stars);
		
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
   	var material = new THREE.MeshNormalMaterial( {color: 0x2d6796});
   	cube = new THREE.Mesh( geometry, material );
	
   	scene.add( cube );


   	//earth
   		var geometry   = new THREE.SphereGeometry(0.5, 32, 32);
		var material  = new THREE.MeshPhongMaterial();
		var earthMesh = new THREE.Mesh(geometry, material);
		scene.add(earthMesh);
		
		material.map    = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
		material.bumpMap    = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
		material.bumpScale = 0.05;
		material.specularMap    = THREE.ImageUtils.loadTexture('images/earthspec1k.jpg');
		material.specular  = new THREE.Color('grey');
		var geometry   = new THREE.SphereGeometry(0.51, 32, 32);
		var material  = new THREE.MeshPhongMaterial({ 
			map     : new THREE.Texture(canvasCloud),
  			side        : THREE.DoubleSide,
  			opacity     : 0.8,
  			transparent : true,
  			depthWrite  : false,
		});
		var cloudMesh = new THREE.Mesh(geometry, material);
		earthMesh.add(cloudMesh);
	
		onRenderFcts.push(function(delta, now){
  		cloudMesh.rotation.y  += 1/16 * delta
		});
	}

	function onMouseMove(e) {

		mouseX = e.clientX - windowHalfX;
		mouseY = e.clientY - windowHalfY;
	}	

})();
