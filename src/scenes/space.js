// inda rocket scene
var count = freq = 0;

	function getStars(radius = 500, material = "YELLOW", amt = 10000) {

		let materialOptions;
		switch(material) { 
			case "YELLOW":
			materialOptions = {
				size: 1.0, 
				transparency: false , 
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
		textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/337424/realsun.jpg',function(Texture){
			console.log('mat loaded');
				
			sun.material = new THREE.MeshLambertMaterial( {
				map: Texture
				});
		});
		sun = new THREE.Mesh(geometry, material);
		sun.position.set(0,0, 250);


		// add sprite within the sun
		let spriteMaterial = new THREE.SpriteMaterial(
			{
				map: new THREE.ImageUtils.loadTexture("./assets/images/glow.png")
				, useScreenCoordinates: false
				, color: 0xffffee
				, transparent: false
				, blending: THREE.AdditiveBlending
			});
		let sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(150, 150, 1.0);
		sun.add(sprite); // This centers the glow at the sun.

		return sun;

	}


	function getMoon() { 

		var moonGeometry = new THREE.SphereGeometry(20, 100, 100);
		moon = new THREE.Mesh(moonGeometry);
		moon.position.set(250,50, -150);
		getLogoTexture(moon, 7);

		return moon

	}


	/* space scene definition */
	class SpaceScene { 
		constructor() { 
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

			this.stars1 = getStars(500);
			this.stars2 = getStars(520, "RED", 10000);
			this.stars3 = getStars(490, "ORANGE", 5000);
			this.stars4 = getStars(480, "WHITE", 50000);

			this.sun = getSun2();
			this.moon = getMoon();
			this.orbit = new THREE.Group();
			/* scene setup */
		}

		setCar(obj) { 
			obj.rotation.y = Math.PI/2;
			return obj;
			// set position of passed in car object
		}
		
		initScene() { 

			this.scene.background = new THREE.Color( 0x000000 );
			this.camera.position.z = 20;
			
			this.scene.add(this.setCar(car));
			car.position.set(0,0,0)
			// initialize scene objects using common object or helper functions
			// add objects to this.scene
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
			
		}

		update(pitch_array) {
			// update objects within the scene
			let bufferlen = pitch_array.length;
			car.rotation.y += .002;
			car.rotation.x += .005;
			
			this.orbit.rotation.y += .005;
		
			logo.rotation.y += .02;
			logo.rotation.z += .01;
		
			for (var i = 0; i < bufferlen; i++) {

				let p = pitch_array[i] ; //normalize
				
				// freq += p/128;
				count += .000001 * p;
				// cmmndCar.rotation.z += p/2560000.;
		
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
			this.update(pitch_array);
				//renamve
		} 
		

	}
