// // Earth params
// var pointLight, sun, moon, earth, earthOrbit, ring, controls, scene, camera, renderer, scene;
// var planetSegments = 48;
// var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", "./assets/images/earth.jpg", 1, planetSegments);
// var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "./assets/images/moon.jpg", 0.5, planetSegments);
// var orbitData = {value: 200, runOrbit: true, runRotation: true};
// var clock = new THREE.Clock(); 

var  sphere, sun, textureCube, loader, light, light1;
// //for the sun
// let metadata = {
//         urls: {
//             github: 'https://github.com/bradyhouse/house/tree/master/fiddles/three/fiddle-0009-Sun',
//             sun: {
//                 surfaceMaterial: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/sunSurfaceMaterial.jpg',
//                 atmosphereMaterial: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/297733/sunAtmosphereMaterial.png'
//             }
//         }
//     };
// function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
//     return {
//         orbitRate: myOrbitRate
//         , rotationRate: myRotationRate
//         , distanceFromAxis: myDistanceFromAxis
//         , name: myName
//         , texture: myTexture
//         , size: mySize
//         , segments: mySegments
//     };
// }
// function getMaterial(type, color, myTexture) {
//     var materialOptions = {
//         color: color === undefined ? 'rgb(255, 255, 255)' : color,
//         map: myTexture === undefined ? null : myTexture
//     };

//     switch (type) {
//         case 'basic':
//             return new THREE.MeshBasicMaterial(materialOptions);
//         case 'lambert':
//             return new THREE.MeshLambertMaterial(materialOptions);
//         case 'phong':
//             return new THREE.MeshPhongMaterial(materialOptions);
//         case 'standard':
//             return new THREE.MeshStandardMaterial(materialOptions);
//         default:
//             return new THREE.MeshBasicMaterial(materialOptions);
//     }
// }
// function getSphere(material, size, segments) {
//     var geometry = new THREE.SphereGeometry(size, segments, segments);
//     var obj = new THREE.Mesh(geometry, material);
//     obj.castShadow = true;

//     return obj;
// }
// function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
//     var myMaterial;
//     var passThisTexture;

//     if (myData.texture && myData.texture !== "") {
//         passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
//     }
//     if (myMaterialType) {
//         myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
//     } else {
//         myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
//     }

//     myMaterial.receiveShadow = true;
//     myMaterial.castShadow = true;
//     var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
//     myPlanet.receiveShadow = true;
//     myPlanet.name = myData.name;
//     scene.add(myPlanet);
//     myPlanet.position.set(x, y, z);

//     return myPlanet;
// }
// function movePlanet(myPlanet, myData, myTime, stopRotation) {
//     if (orbitData.runRotation && !stopRotation) {
//         myPlanet.rotation.y += myData.rotationRate;
//     }
//     if (orbitData.runOrbit) {
//         myPlanet.position.x = Math.cos(myTime 
//                 * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
//                 * myData.distanceFromAxis;
//         myPlanet.position.z = Math.sin(myTime 
//                 * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
//                 * myData.distanceFromAxis;
//     }
// }
// function moveMoon(myMoon, myPlanet, myData, myTime) {
//     movePlanet(myMoon, myData, myTime);
//     if (orbitData.runOrbit) {
//         myMoon.position.x = myMoon.position.x + myPlanet.position.x;
//         myMoon.position.z = myMoon.position.z + myPlanet.position.z;
//     }
// }
	
		//animate function
		function animate() {
			requestAnimationFrame( animate );
			camera.lookAt( scene.position );
			//sphere.visible = false;
			cube.rotation.x+=0.005;
			cube.rotation.y+=0.005;
			controls.update();
			renderer.render( scene, camera );
		}
		//add objects to the scene
		function spaceScene(){	
			//------------------------------- STARS -------------------------------------------
			geometry1 = new THREE.SphereGeometry(10, 100, 50);
			geometry2 = new THREE.SphereGeometry(10, 100, 50);
			geometry3 = new THREE.SphereGeometry(10, 100, 50);
			geometry4 = new THREE.SphereGeometry(10, 100, 50);
			//four differnt options for color of the stars
	    	materialOptions1 = {
	    		size: 1.0, 
	    		transparency: false , 
	    		opacity: 0.7,
	    		color: 0xeaf20c //yellow
	    	};
	    	materialOptions2 = {
	    		size: 1.0, 
	    		transparency: false , 
	    		opacity: 0.7,
	    		color: 0xff9d00 //orange
	    	};
	    	materialOptions3 = {
	    		size: 1.0, 
	    		transparency: false , 
	    		opacity: 0.7,
	    		color: 0xa8f0ff //white
	    	};
	    	materialOptions4 = {
	    		size: 1.0, 
	    		transparency: false , 
	    		opacity: 0.7,
	    		color: 0xce1c1c //red
	    	};
	    	starStuff1 = new THREE.PointCloudMaterial(materialOptions1);
	    	starStuff2 = new THREE.PointCloudMaterial(materialOptions2);
	    	starStuff3 = new THREE.PointCloudMaterial(materialOptions3);
	    	starStuff4 = new THREE.PointCloudMaterial(materialOptions4);
	    	//create random stars
			for (var i = 0; i < 10000; i++) {		
				var starVertex1 = new THREE.Vector3();
				starVertex1.x = Math.random() * 2000 - 1000;
				starVertex1.y = Math.random() * 2000 - 1000;
				starVertex1.z = Math.random() * 2000 - 1000;
				geometry1.vertices.push(starVertex1);
			}
			for (var i = 0; i < 10000; i++) {		
				var starVertex2 = new THREE.Vector3();
				starVertex2.x = Math.random() * 2000 - 1000;
				starVertex2.y = Math.random() * 2000 - 1000;
				starVertex2.z = Math.random() * 2000 - 1000;
				geometry2.vertices.push(starVertex2);
			}
			for (var i = 0; i < 50000; i++) {		
				var starVertex3 = new THREE.Vector3();
				starVertex3.x = Math.random() * 2000 - 1000;
				starVertex3.y = Math.random() * 2000 - 1000;
				starVertex3.z = Math.random() * 2000 - 1000;
				geometry3.vertices.push(starVertex3);
			}
			for (var i = 0; i <2000; i++) {		
				var starVertex4 = new THREE.Vector3();
				starVertex4.x = Math.random() * 2000 - 1000;
				starVertex4.y = Math.random() * 2000 - 1000;
				starVertex4.z = Math.random() * 2000 - 1000;
				geometry4.vertices.push(starVertex4);
			}
			//create four different color star
			stars1 = new THREE.PointCloud(geometry1, starStuff1);
			stars2 = new THREE.PointCloud(geometry2, starStuff2);
			stars3 = new THREE.PointCloud(geometry3, starStuff3);
			stars4 = new THREE.PointCloud(geometry4, starStuff4);
			//add to the scene
			scene.add(stars1);
			scene.add(stars2);
			scene.add(stars3);
			scene.add(stars4);
			//--------------------------------------End Stars ---------------------

			//--------------------------------------Middle object that floats; will be the car --------
			var geometry = new THREE.BoxGeometry( 40, 40, 40);
			var material = new THREE.MeshNormalMaterial( {color : 0xfffff} );
    		cube = new THREE.Mesh( geometry, material );
    		//cube.material.color.setHex( 0xffffff );
    		scene.add( cube );
			//----------------------------------------End of the of middle object ---------------------
			// sun
// 			var light = new THREE.DirectionalLight( 0xFFFFFF );

// var helper = new THREE.DirectionalLightHelper( light, 5 );

// scene.add( helper );
			 //var spotLight = new THREE.SpotLight( 0xffffff, 2.0, 1000 );
			// spotLight.position.set( 100, 1000, 100 );

			// spotLight.castShadow = true;

			// spotLight.shadow.mapSize.width = 1024;
			// spotLight.shadow.mapSize.height = 1024;

			// spotLight.shadow.camera.near = 500;
			// spotLight.shadow.camera.far = 4000;
			// spotLight.shadow.camera.fov = 30;
			// spotLight.power = 10;
			
			// spotLight.target =cube;
			// scene.add( spotLight );
			
			// var ambientLight = new THREE.AmbientLight(0xffffff);
  			// scene.add(ambientLight);
  			// light = new THREE.PointLight(0xFFFBE3);
			  // light.position.set(100, 0, -60);
			  // scene.add(light);
			  
			  // light1 = new THREE.PointLight(0xFFFBE3);
			  // light1.position.set(-50,200,50);
			  // scene.add(light1);
  
  			//  //draw disco ball
			  // var geo = new THREE.SphereGeometry(55, 30, 20);
			  // var mat = new THREE.MeshPhongMaterial({
			  //   emissive: '#222',
			  //   shininess: 50,
			  //   reflectivity: 3.5,
			  //   shading: THREE.FlatShading,
			  //   specular: 'white',
			  //   color: 'gray',
			  //   side: THREE.DoubleSide,
			  //   envMap: cubeCamera.renderTarget.texture,
			  //   combine: THREE.AddOperation
			  // });
			  // sphere = new THREE.Mesh(geo, mat);
			  // scene.add(sphere);
			  
			  // //draw sun
			  // var sunMat;
			  // var sunGeo = new THREE.SphereGeometry(100, 200, 200);
			  // loader = new THREE.TextureLoader();
			  // loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/337424/realsun.jpg',function(sunTexture){
			  //   console.log('mat loaded');
			  //    console.log(sunTexture);
			  //   sun.material = new THREE.MeshLambertMaterial( {
					// 	map: sunTexture
					//  });
			  // });
			  // sun = new THREE.Mesh(sunGeo, sunMat);
			  // scene.add(sun);
  
		   	//-------------------------------------- Earth ------------------------  
		  //  	var time = Date.now();

		  //   movePlanet(earth, earthData, time);
		  //   movePlanet(ring, earthData, time, true);
		  //   moveMoon(moon, earth, moonData, time);
		  //   var path = 'cubemap/';
    // var format = '.jpg';
    // var urls = [
    //     path + 'px' + format, path + 'nx' + format,
    //     path + 'py' + format, path + 'ny' + format,
    //     path + 'pz' + format, path + 'nz' + format
    // ];
    // var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    // reflectionCube.format = THREE.RGBFormat;

    // // Attach the background cube to the scene.
    // scene.background = reflectionCube;

    // // Create light from the sun.
    // pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    // scene.add(pointLight);

    // // Create light that is viewable from all directions.
    // var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    // scene.add(ambientLight);

    // // Create the sun.
    // var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)");
    // sun = getSphere(sunMaterial, 16, 48);
    // scene.add(sun);

    // // Create the glow of the sun.
    // var spriteMaterial = new THREE.SpriteMaterial(
    //         {
    //             map: new THREE.ImageUtils.loadTexture("./assets/images/glow.png")
    //             , useScreenCoordinates: false
    //             , color: 0xffffee
    //             , transparent: false
    //             , blending: THREE.AdditiveBlending
    //         });
    // var sprite = new THREE.Sprite(spriteMaterial);
    // sprite.scale.set(70, 70, 1.0);
    // sun.add(sprite); // This centers the glow at the sun.

    // // Create the Earth, the Moon, and a ring around the earth.
    // earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    // moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    
    // // Create the GUI that displays controls.
    // var gui = new dat.GUI();
    // var folder1 = gui.addFolder('light');
    // folder1.add(pointLight, 'intensity', 0, 10);
    // var folder2 = gui.addFolder('speed');
    // folder2.add(orbitData, 'value', 0, 500);
    // folder2.add(orbitData, 'runOrbit', 0, 1);
    // folder2.add(orbitData, 'runRotation', 0, 1);


			// var globe = new Globe(radius, segments);
			// scene.add(globe);
			// var sphere = createSphere(radius, segments);
			// //sphere.rotation.y = rotation; 
			// scene.add(sphere)

		 //    var clouds = createClouds(radius, segments);
			// //clouds.rotation.y = rotation;
			// scene.add(clouds)



		 //   	var geometry 			= new THREE.SphereGeometry( 5, 32, 32 );
			// var material 			= new THREE.MeshBasicMaterial( {color: 0x0000ff} );
			// var sphere 				= new THREE.Mesh( geometry, material );

			// scene.add( sphere );
			// //load earthmap1k
			// var texture = new THREE.TextureLoader().load('1.png');
			// var material = new THREE.MeshBasicMaterial( { map: texture } );
			//load earthbump
			// var texture = new THREE.TextureLoader().load('./assets/images/earthbump1k.jpg');
			// var material = new THREE.MeshBasicMaterial({bumpMap: texture2  });
			///assets/images/earthmap1k.jpg

			//material.map    		= THREE.ImageUtils.loadTexture('./assets/images/earthmap1k.jpg');
			//loadTexture.setCrossOrigin ( 'anonymous' );
			//material.bumpMap    	= new THREE.TextureLoader().load('./assets/images/earthbump1k.jpg');
			// material.bumpScale  	= 0.05;
			// material.specularMap    = new THREE.TextureLoader().load('./assets/images/earthspec1k.jpg');
			// material.specular  		= new THREE.Color('grey');
			// var geometry   			= new THREE.SphereGeometry(0.51, 32, 32);
			// var material 			= new THREE.MeshPhongMaterial({ 
			// 	map         : new THREE.Texture(canvasCloud),
	  // 			side        : THREE.DoubleSide,
	  // 			opacity     : 0.8,
	  // 			transparent : true,
	  // 			depthWrite  : false,
			// });
			// var cloudMesh 			= new THREE.Mesh(geometry, material);
			// earthMesh.add(cloudMesh);
			// onRenderFcts.push(function(delta, now){
	  // 			cloudMesh.rotation.y  += 1/16 * delta
			// });
		}
		 // function createSphere(radius, segments) {
			// 	return new THREE.Mesh(
			// 		new THREE.SphereGeometry(radius, segments, segments),
			// 		new THREE.MeshPhongMaterial({
			// 			map:         THREE.ImageUtils.loadTexture('./assets/images/2_no_clouds_4k.jpg'),
			// 			bumpMap:     THREE.ImageUtils.loadTexture('./assets/images/elev_bump_4k.jpg'),
			// 			bumpScale:   0.005,
			// 			specularMap: THREE.ImageUtils.loadTexture('./assets/images/water_4k.png'),
			// 			specular:    new THREE.Color('grey')
														
			// 		})
			// 	);
			// }

			// function createClouds(radius, segments) {
			// 	return new THREE.Mesh(
			// 		new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			// 		new THREE.MeshPhongMaterial({
			// 			map:         THREE.ImageUtils.loadTexture('./assets/images/fair_clouds_4k.png'),
			// 			transparent: true
			// 		})
			// 	);		
			// }
			
		// var Globe = function (radius, segments) {

		// 	  THREE.Object3D.call(this);

		// 	  this.name = "Globe";

		// 	  var that = this;

		// 	  // instantiate a loader
		// 	  var loader = new THREE.TextureLoader();

		// 	  // earth textures
		// 	  var textures = {
		// 	    'map': {
		// 	      url: 'assets/images/earthmap1k.jpg',
		// 	      val: undefined
		// 	    },
		// 	    'bumpMap': {
		// 	      url: 'assets/images/earthbump1k.jpg',
		// 	      val: undefined
		// 	    },
		// 	    'specularMap': {
		// 	      url: 'assets/images/earthspec1k.jpg',
		// 	      val: undefined
		// 	    }
		// 	  };

		// 	  var texturePromises = [], path = './';

		// 	  for (var key in textures) {
		// 	    texturePromises.push(new Promise((resolve, reject) => {
		// 	      var entry = textures[key]
		// 	      var url = path + entry.url
		// 	      loader.load(url,
		// 	        texture => {
		// 	          entry.val = texture;
		// 	          if (entry.val instanceof THREE.Texture) resolve(entry);
		// 	        },
		// 	        xhr => {
		// 	          console.log(url + ' ' + (xhr.loaded / xhr.total * 100) +
		// 	            '% loaded');
		// 	        },
		// 	        xhr => {
		// 	          reject(new Error(xhr +
		// 	            'An error occurred loading while loading: ' +
		// 	            entry.url));
		// 	        }
		// 	      );
		// 	    }));
		// 	  }

		// 	  // load the geometry and the textures
		// 	  Promise.all(texturePromises).then(loadedTextures => {
		// 	    var geometry = new THREE.SphereGeometry(radius, segments, segments);
		// 	    var material = new THREE.MeshPhongMaterial({
		// 	      map: textures.map.val,
		// 	      bumpMap: textures.bumpMap.val,
		// 	      bumpScale: 0.005,
		// 	      specularMap: textures.specularMap.val,
		// 	      specular: new THREE.Color('grey')
		// 	    });

		// 	    var earth = that.earth = new THREE.Mesh(geometry, material);
		// 	    that.add(earth);
		// 	  });

		// 	  // clouds
		// 	  loader.load('./assets/images/earthcloudmap.jpg', map => {
		// 	    var geometry = new THREE.SphereGeometry(radius + .05, segments, segments);
		// 	    var material = new THREE.MeshPhongMaterial({
		// 	      map: map,
		// 	      transparent: true
		// 	    });

		// 	    var clouds = that.clouds = new THREE.Mesh(geometry, material);
		// 	    that.add(clouds);
		// 	  });
		// 	}

		// 	Globe.prototype = Object.create(THREE.Object3D.prototype);
		// 	Globe.prototype.constructor = Globe;

