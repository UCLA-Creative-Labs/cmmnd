// inda rocket scene
var count = freq = 0;

	function getStars(radius = 500, material = "YELLOW", amt = 10000) {

		let materialOptions;
		switch(material) { 
			case "YELLOW":
			materialOptions = {
				size: 1.0, 
				transparency: false, 
				opacity: 0.7,
				color: 0xeaf20c //yellow
			};
			break;
			case "ORANGE": 
			materialOptions = {
				size: 1.0, 
				transparency: false , 
				opacity: 0.7,
				color: 0xff9d00 //orange
			};
			break;
			case "WHITE": 
			materialOptions = {
				size: 1.0, 
				transparency: false , 
				opacity: 0.7,
				color: 0xa8f0ff //white
			};
			break;
			case "RED": 
			materialOptions = {
				size: 1.0, 
				transparency: false , 
				opacity: 0.7,
				color: 0xce1c1c //red
			};
			break;
		}

		let geometry = new THREE.SphereGeometry(radius,radius,50);
		let starMaterial = new THREE.PointCloudMaterial(materialOptions);

		for (var i = 0; i < amt; i++) {		

			var starVertex = new THREE.Vector3();
			starVertex.x = Math.random() * 2000 - 1000;
			starVertex.y = Math.random() * 2000 - 1000;
			starVertex.z = Math.random() * 2000 - 1000;
			geometry.vertices.push(starVertex);
			
		}
		
		return new THREE.PointCloud(geometry, starMaterial);
		//generate particles 
	}

	function getSun2() {
				//draw sun
		let sun;
		let material;
		let geometry = new THREE.SphereGeometry(20, 100, 100);
		sun = new THREE.Mesh(geometry, material);
		sun.position.set(0,0, 250);

		return sun;

	}


	function getMoon() { 

		var moonGeometry = new THREE.SphereGeometry(20, 100, 100);
		moon = new THREE.Mesh(moonGeometry);
		moon.position.set(250,50, -150);
		models.logoTexture.repeat.set( 7, 7 );
        moon.material = new THREE.MeshLambertMaterial({ 
            map: models.logoTexture, 
            color: 0xd0d5d2
		});
		return moon;

	}

	function getRingPlanet() { 
		var geometry = new THREE.RingBufferGeometry(45, 35, 32);
		var material = new THREE.MeshNormalMaterial({ 
			opacity: .9, 
			color: 0xffd700,
			side: THREE.DoubleSide
		})
		var mesh = new THREE.Mesh(geometry, material); 
		mesh.rotation.set(Math.PI/6, 0, Math.PI/5);

		var planetgeometry = new THREE.SphereBufferGeometry( 30, 32, 32 );
		var planetmaterial = new THREE.MeshBasicMaterial({ 
			color: 0x3e54e8
		})

		var planetmesh = new THREE.Mesh(planetgeometry, planetmaterial)
		var planet = new THREE.Group();

		planet.add(mesh);
		planet.add(planetmesh);

		planet.position.set(-50,0,-300);
		planet.rotation.set(Math.PI/2,0, 0)

		return planet;

	}

	/* random colors */ 
	const colorArray = [ 0x283345, 0x333236, 0x173147, 0x191970, 0x36454F, 
		  0x512888, 0x880085, 0x301934, 0x99FF99, 0xB34D4D, 0x80B300, 
		  0x809900 ];

	const threeColors = [];


	colorArray.forEach((color)=> { 
		threeColors.push(new THREE.Color(color));
	});


	function randomColor() { 
		let i = Math.floor(Math.random() * 10);
		return threeColors[i];
	}

	/* space scene definition */
	class SpaceScene { 
		constructor() { 
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

			this.controls = new THREE.OrbitControls(this.camera);
			this.controls.zoomSpeed = .5;
			this.controls.enablePan = true;

			this.stars1 = getStars(500);
			this.stars2 = getStars(520, "RED", 10000);
			this.stars3 = getStars(490, "ORANGE", 5000);
			this.stars4 = getStars(480, "WHITE", 50000);

			this.sun = getSun2();
			this.moon = getMoon();
			this.orbit = new THREE.Group();
			this.rocketOrbit = new THREE.Group();
			this.planet1 = getRingPlanet();

			this.background = true;
			this.color = new THREE.Color( 0x000 )
			/* scene setup */

			this.composer = new THREE.EffectComposer( renderer );
			this.renderPass = new THREE.RenderPass( this.scene, this.camera ); // new render 
			this.FilmPass = new THREE.FilmPass(  
				0.35,   // noise intensity
				0.1,  // scanline intensity
				648,    // scanline count
				false,  // grayscale 
			);
			this.RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader )
			this.composer.addPass( this.renderPass );
			this.FilmPass.renderToScreen = true;
			this.RGBShiftPass.renderToScreen = true;
			this.composer.addPass( this.RGBShiftPass )
			this.composer.addPass( this.FilmPass );
			this.postprocessing = true;
		}


		setScene() { 

		}
		
		initScene() { 
			document.addEventListener("click", ()=> { 
				this.scene.background = randomColor();
			})

			this.scene.background = new THREE.Color( 0x000000 );
			this.camera.position.z = 20;
			
			// models
			this.rocket = models.rocket.clone();
			this.rocket.scale.set(.2,.2,.2);
			this.rocket.position.set(-100,10,-80);
			this.satellite = models.satellite.clone();
			this.satellite.scale.set(5,5,5);
			this.satellite.rotation.set(40,0,0);
			this.satellite.position.set(-100,50,0);
			this.car = models.car.clone();
			this.car.position.set(0,0,0);
			this.car.rotation.y = Math.PI/2;
			this.archLogo = models.archLogo.clone();
			this.archLogo.scale.set(.3,.3,.3);
			this.archLogo.position.set(0, 0, 60);

			this.rocketOrbit.add(this.rocket);
			this.orbit.add(this.satellite);
			this.scene.add(this.car);

			this.orbit.add(this.planet1);
			this.orbit.add(this.archLogo);

			// initialize scene objects using common object or helper functions
			let light = new THREE.PointLight(0xFFFBE3, .3);
			light.position.set(100, 0, -60);
			this.scene.add(light);
				
			let light1 = new THREE.PointLight(0xFFFBE3, .8);
			light1.position.set(-50,200,50);
			this.scene.add(light1);

			this.orbit.add(this.stars1);
			this.orbit.add(this.stars2);
			this.orbit.add(this.stars3);
			this.orbit.add(this.stars4);
			this.orbit.add(this.sun);
			this.orbit.add(this.moon);

			this.scene.add(this.orbit);
			this.scene.add(this.rocketOrbit);
			
		}

		update(pitch_array,volume_array) {
			// update objects within the scene
			let bufferlen = pitch_array.length;
			this.car.rotation.y += .003;
			this.car.rotation.x += .005;
			this.rocketOrbit.rotation.x += .0059;
			this.rocketOrbit.rotation.z -= .007;


			this.archLogo.rotation.y += .02;
			this.archLogo.rotation.z += .01;
			

			for (var i = 0; i < volume_array.length; i++) { 
				let vol = volume_array[i];
				let norm  = vol / 255. 
	

				if ( vol > 180 ) { 
					this.orbit.rotation.y += .00003 * norm;
				}

				this.orbit.rotation.y += .00001 * norm;
			}
			
		
			for (var i = 0; i < bufferlen; i++) {

				let p = pitch_array[i] ; //normalize
				
				// freq += p/128;
				count += .000001 * p;
	
				let norm = 1.5 + Math.sin(count);
				if( pitch_array[i] > 120  ) { 
					this.stars1.scale.set(norm, norm, norm);
				}
				else if( pitch_array[i] > 80 && pitch_array[i] < 120 ) { 
					this.stars2.scale.set(norm, norm, norm);
				}
		
				else if( pitch_array[i] > 50 && pitch_array[i] < 80 ) {
					this.stars3.scale.set(norm, norm, norm);
				}
					
				else { 
					this.stars4.scale.set(norm, norm, norm);
				}
					
			}
		}

		animate() {
			const pitch_array = audio.getFreqData();
			const volume_array = audio.getVolumeData();
			this.update(pitch_array, volume_array);
		} 
		

	}
