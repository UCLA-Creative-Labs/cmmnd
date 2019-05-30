// inda rocket scene



// var pointLight, sun, moon, earth, earthOrbit, ring, controls, scene, camera, renderer, scene;
// var planetSegments = 48;
// var earthData = constructPlanetData(365.2564, 0.015, 25, "earth", "./assets/images/earth.jpg", 1, planetSegments);
// var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "./assets/images/moon.jpg", 0.5, planetSegments);
// var orbitData = {value: 200, runOrbit: true, runRotation: true};
// var clock = new THREE.Clock(); 

var  sphere, sun, textureCube, loader, light, light1;
var rotationAxis = new THREE.Vector3(0,1,0);
var rotWorldMatrix;

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
function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

function rotateAroundWorldAxis(obj, axis, radians) {
	let rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(obj.matrix);
	obj.matrix = rotWorldMatrix;
	obj.setRotationFromMatrix(obj.matrix);
}

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
			// cube.rotation.x+=0.005;
			// cube.rotation.y+=0.005;
			scene.rotation.y+= 0.005;
			// rotateAroundWorldAxis(stars1, rotationAxis, .008);
			// rotateAroundWorldAxis(stars2, rotationAxis, .002);
			// rotateAroundWorldAxis(stars3, rotationAxis, .010);
			controls.update();
			renderer.render( scene, camera );
		}
		//add objects to the scene
		function spaceScene(){	
			//------------------------------- STARS -------------------------------------------
			geometry1 = new THREE.SphereGeometry(25,50,50);
			geometry2 = new THREE.SphereGeometry(30,50,50);
			geometry3 = new THREE.SphereGeometry(45,50,50);
			geometry4 = new THREE.SphereGeometry(50,50,50);
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
			
			//create random star particles 
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
			stars1.position.set(400, 0, 600);
			stars2.position.set(400 ,0, 600);
			stars3.position.set(400, 0, 600);
			stars4.position.set(400, 0, 600);
			scene.add(stars1);
			scene.add(stars2);
			scene.add(stars3);
			scene.add(stars4);
			//--------------------------------------End Stars ---------------------

			//--------------------------------------Middle object that floats; will be the car --------
			var geometry = new THREE.BoxGeometry( 40, 40, 40);
			var material = new THREE.MeshNormalMaterial( {color : 0xfffff} );
    		// cube = new THREE.Mesh( geometry, material );
    		// //cube.material.color.setHex( 0xffffff );
    		// scene.add( cube );
			//----------------------------------------End of the of middle object ---------------------
			//moon 
			var light = new THREE.DirectionalLight( 0xFFFFFF );


		 var spotLight = new THREE.SpotLight( 0xffffff, 2.0, 1000 );
		spotLight.position.set( 100, 1000, 100 );

		spotLight.castShadow = true;

		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;
		spotLight.power = 10;
		
		spotLight.target =platform;
		scene.add( spotLight );
		
		var ambientLight = new THREE.AmbientLight(0xffffff);
			scene.add(ambientLight);
			light = new THREE.PointLight(0xFFFBE3);
			light.position.set(100, 0, -60);
			scene.add(light);
			
			light1 = new THREE.PointLight(0xFFFBE3);
			light1.position.set(-50,200,50);
			scene.add(light1);
		
			//sun
			var light = new THREE.DirectionalLight( 0xFFFFFF );
			 var spotLight = new THREE.SpotLight( 0xffffff, 2.0, 1000 );
			spotLight.position.set( 100, 1000, 100 );

			spotLight.castShadow = true;

			spotLight.shadow.mapSize.width = 1024;
			spotLight.shadow.mapSize.height = 1024;

			spotLight.shadow.camera.near = 500;
			spotLight.shadow.camera.far = 4000;
			spotLight.shadow.camera.fov = 30;
			spotLight.power = 10;
			
			spotLight.target =platform;
			scene.add( spotLight );
			
			var ambientLight = new THREE.AmbientLight(0xffffff);
  			scene.add(ambientLight);
  			light = new THREE.PointLight(0xFFFBE3);
			  light.position.set(100, 0, -60);
			  scene.add(light);
			  
			  light1 = new THREE.PointLight(0xFFFBE3);
			  light1.position.set(-50,200,50);
			  scene.add(light1);
  
				//draw disco ball
				var cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
				scene.add( cubeCamera );

			  var geo = new THREE.SphereGeometry(30, 30, 20);
			  var mat = new THREE.MeshPhongMaterial({
			    emissive: '#222',
			    shininess: 50,
			    reflectivity: 3.5,
			    shading: THREE.FlatShading,
			    specular: 'white',
			    color: 'gray',
			    side: THREE.DoubleSide,
			    envMap: cubeCamera.renderTarget.texture,
			    combine: THREE.AddOperation
			  });
				sphere = new THREE.Mesh(geo, mat);
				sphere.position.set(0, 0, -500)
			  scene.add(sphere);
			  
			  //draw sun
			  var sunMat;
			  var sunGeo = new THREE.SphereGeometry(50, 200, 200);
			  loader = new THREE.TextureLoader();
			  loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/337424/realsun.jpg',function(sunTexture){
			    console.log('mat loaded');
			     console.log(sunTexture);
			    sun.material = new THREE.MeshLambertMaterial( {
						map: sunTexture
					 });
			  });
				sun = new THREE.Mesh(sunGeo, sunMat);
				sun.position.set(0,0, 400)
			  scene.add(sun);
  
    // Create light that is viewable from all directions.
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    // Create the glow of the sun.
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: new THREE.ImageUtils.loadTexture("./assets/images/glow.png")
                , useScreenCoordinates: false
                , color: 0xffffee
                , transparent: false
                , blending: THREE.AdditiveBlending
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(150, 150, 1.0);
    sun.add(sprite); // This centers the glow at the sun.

		}


