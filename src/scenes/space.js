// inda rocket scene

var  sphere, sun, moon, textureCube, loader, light, light1;
var rotationAxis = new THREE.Vector3(0,1,0);
var rotWorldMatrix;
var orbit = new THREE.Group();
var logo;

var carPart;
var cmmndCar = new THREE.Group();

var count = freq = 0;

function getLogo() { 

    objLoader.setPath( './assets/' );

    objLoader.load(
        'archCmmndLogo.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0xd3d3d3, 
                          })
                         
                         }
                     } );
                    
            // obj.scale.set( .1, .1, .1 ) 
			obj.position.y = 80;
			obj.position.x = -50;
            obj.position.z = -250;
            
            logo = obj;
            logo.castShadow = true;
            logo.receiveShadow = true;
            
            orbit.add(logo);

        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
}

function setCar(obj){ 

	obj.rotation.y = Math.PI/2;

	carPart = obj;

	cmmndCar.add(carPart);

	scene.add(cmmndCar);

}

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

function update() { 
	for (var i = 0; i < bufferlen; i++) {

		let p = pitch_array[i] ; //normalize
		
		// freq += p/128;
		count += .000001 * p;
		// cmmndCar.rotation.z += p/2560000.;

		let norm = 1.5 + Math.sin(count);
		if( pitch_array[i] > 120  ) { 
			stars1.scale.set(norm, norm, norm);
		}
		else if( pitch_array[i] > 80 && pitch_array[i] < 120 ) { 
			stars2.scale.set(norm, norm, norm);
		}

		else if( pitch_array[i] > 50 && pitch_array[i] < 80 ) {
			stars3.scale.set(norm, norm, norm);
		}
			
		else { 
			stars4.scale.set(norm, norm, norm);
		}
			
	  }
}

	
//animate function
function animate() {

	//renamve
	cmmndCar.rotation.y += .002;
	cmmndCar.rotation.x += .005;
	
	orbit.rotation.y += .005;

	logo.rotation.y += .02;
	logo.rotation.z += .01;

	//deals with pitch (and bass)
	analyser.getByteFrequencyData(pitch_array);
	//deals with volume
	analyser.getByteTimeDomainData(volume_array);

	update();

	
}

//add objects to the scene	
function SpaceScene(){	

		scene.remove( cliff );

		camera.position.z = 20;
		
		scene.background = new THREE.Color( 0x000000 );

		// controls.autoRotate = true;
		controls.update();

		
		//------------------------------- STARS -------------------------------------------
		geometry1 = new THREE.SphereGeometry(500,500,50);
		geometry2 = new THREE.SphereGeometry(500,500,50);
		geometry3 = new THREE.SphereGeometry(500,500,50);
		geometry4 = new THREE.SphereGeometry(500,500,50);

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
		// stars1.position.set(0, 0, 0);
		// stars2.position.set(0 ,0, 600);
		// stars3.position.set(0, 0, 600);
		// stars4.position.set(0, 0, 600);
		orbit.add(stars1);
		orbit.add(stars2);
		orbit.add(stars3);
		orbit.add(stars4);

		scene.add(orbit)
		//--------------------------------------End Stars ---------------------
	
	// var ambientLight = new THREE.AmbientLight(0xffffff, .02);
	// scene.add(ambientLight);
	light = new THREE.PointLight(0xFFFBE3, .3);
	light.position.set(100, 0, -60);
	scene.add(light);
		
	light1 = new THREE.PointLight(0xFFFBE3, .8);
	light1.position.set(-50,200,50);
	scene.add(light1);
	
			
	//draw sun
	var sunMat;
	var sunGeo = new THREE.SphereGeometry(20, 100, 100);
	loader = new THREE.TextureLoader();
	loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/337424/realsun.jpg',function(sunTexture){
		console.log('mat loaded');
			console.log(sunTexture);
		sun.material = new THREE.MeshLambertMaterial( {
			map: sunTexture
			});
	});
	sun = new THREE.Mesh(sunGeo, sunMat);
	sun.position.set(0,0, 250)
	orbit.add(sun);

	//cmmnd moon
	var moonGeometry = new THREE.SphereGeometry(20, 100, 100);
	loader.load('../../assets/cmmnd_logo.png', function(cmmndTexture) { 
		console.log('mat loaded');
		cmmndTexture.wrapS = cmmndTexture.wrapT = THREE.RepeatWrapping;
		cmmndTexture.offset.set( 0, 0 );
		cmmndTexture.repeat.set( 8, 8 );
		moon.material = new THREE.MeshLambertMaterial({ 
			map: cmmndTexture, 
			color: 0xd0d5d2
		});	
	})

	moon = new THREE.Mesh(moonGeometry);
	moon.position.set(250,50, -150);
	orbit.add(moon);

	getLogo();
	
	

	
// Create light that is viewable from all directions.
// var ambientLight = new THREE.AmbientLight(0xaaaaaa, .2);
// scene.add(ambientLight);

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


