// yt scene

// initalize scene objects and scene attributes (background color, camera position, etc.)
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 100;

/* initialize renderer */
var renderer = new THREE.WebGLRenderer({alpha: true});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera);
controls.zoomSpeed = .5;
controls.minAzimuthAngle = - Math.PI/2;
controls.maxAzimuthAngle = Math.PI/2;

controls.enablePan = true;

let buildings = [];
let building;

var scene = new THREE.Scene();

const circleGeo = new THREE.CircleGeometry(8, 50)
const circleMaterial = new THREE.MeshBasicMaterial(
    {color: '#000',
    metalness: 0,
    emissive: '#000000',
    opacity: 0,
    depthWrite: false})

circleGeo.rotateX(-Math.PI/2);
circleGeo.rotateY(-Math.PI/4);

let circle = new THREE.Mesh(circleGeo, circleMaterial);
circle.position.y = -15
circle.position.z = 60

scene.add(circle)

function setCar(obj) { 
    obj.position.y = 2;
    obj.position.x = -10;
    obj.rotateY(3*Math.PI/2);
  
    car = obj;
    car.name = "OldCar"
  
    console.log(car)
    console.log('hi')
    circle.add( car );
  }

function addFloor() {
    const width = 200;
    const height = 200;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
  
    // all materials can be changed according to your taste and needs
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: '#ca2c92',
      metalness: 0,
      emissive: '#000000',
      roughness: 0,
      depthWrite: 0,
      opacity: 1
    });
  
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  
    planeGeometry.rotateX(-Math.PI/2);
    planeGeometry.rotateY(-Math.PI/4);
  
    plane.position.y = -15;
  
    scene.add(plane);
}

function addStreets() {
    const width = 40;
    const len1 = 80;
    const len2 = 200;

    const street1Geo = new THREE.PlaneGeometry(width, len1);
    const street2Geo = new THREE.PlaneGeometry(width, len2);

    const streetMaterial = new THREE.MeshStandardMaterial({
        color: '#1e1e1e',
        metalness: 0,
        emissive: '#000000',
        depthWrite: false,
        roughness: 10,
    })

    const street1 = new THREE.Mesh(street1Geo, streetMaterial);
    const street2 = new THREE.Mesh(street2Geo, streetMaterial);
    const street3 = new THREE.Mesh(street2Geo, streetMaterial);

    street1Geo.rotateX(-Math.PI/2);
    street1Geo.rotateY(Math.PI/4);

    street2Geo.rotateX(-Math.PI/2);
    street2Geo.rotateY((3*Math.PI)/4);

    street1.position.y = -15;
    street1.position.x = 15;
    street1.position.z = 70;

    street2.position.y = -15;
    street2.position.x = 28;
    street2.position.z = 28;

    street3.position.y = -15;
    street3.position.x = -50;
    street3.position.z = -50;

    scene.add(street1);
    scene.add(street2);
    scene.add(street3);
}

function initScene() { 
    clock = new THREE.Clock();

    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    addFloor();
    addStreets();
    // addInvisibleCarPlatform();
    let brightness = new THREE.AmbientLight(0xffffff, .7);
    scene.add(brightness)

    let light = new THREE.PointLight(0xFFFFFF);
    light.position.set(3, -3, 18)
    scene.add(light)

    let ambientLight = new THREE.AmbientLight( 0xbc13fe ); // soft white light
    scene.add(ambientLight);

    for (let i = 0; i < 200; i += 10) {
        blue_light = new THREE.PointLight(0x0000FF, 1., 100);
        blue_light.position.set(10,i,i);

        scene.add(blue_light);
    }

    for (let i = 5; i < 205; i += 10) {
        red_light = new THREE.PointLight(0xff0000, 1., 100);
        red_light.position.set(i,10,i);

        scene.add(red_light);
    }
  
    // mtlLoader.load('/assets/models/buildings/Residential Buildings 002.mtl', 
    // function (materials) {
    //     materials.preload();
    //     objLoader.setMaterials(materials);	
    //     console.log(materials, "materials");
    //     objLoader.load( '/assets/models/buildings/Residential Buildings 002.obj',
    //         function(obj) {
    //             obj.position.y = -15
    //             obj.rotation.y = Math.PI/4;
    //             obj.position.z = -15
    //             obj.scale.set(2, 2, 2)
                
    //             console.log(obj, "building");
    //             //window.building = building;
    //             building = obj;
    //             scene.add(building);
                
    //             buildings.push(obj);
    //         },
        
    //         function (xhr) {
    //             console.log('object loaded')
    //             console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    //         },
            
    //         function (error) {
    //             console.log( 'An error happened' );
    //         }
    //     );
    // });

    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0xff69b4, map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];

    for (p = -80; p < -70; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
}

var loader = new THREE.OBJLoader();
// var mtlLoader = new THREE.MTLLoader();

function loadMiscObjects(path, pos_x, pos_y, pos_z, rot_y, scale) {
    objLoader.load(
        path,
        function(object) {
            object.position.z = pos_z
            object.position.x = pos_x
            object.position.y = pos_y
            object.rotation.y = rot_y
            object.scale.set(scale, scale, scale)
            object.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0x404040, 
                          })
                         
                         }
                     } );
    
            window.object = object;
            scene.add(object);
        },

        function(xhr) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        
        function(error) {
            console.log( 'An error happened' );
        }
    )
}

function loadBuildings(path, pos_x, pos_y, pos_z, rot_y, scale) {
    loader.load(
        path,
        function(object) {
            object.position.z = pos_z
            object.position.x = pos_x
            object.position.y = pos_y
            object.rotation.y = rot_y
            object.scale.set(scale, scale, scale)
            object.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0x404040, 
                          })
                         }
                     } );
    
            window.object = object;
            scene.add(object);
            buildings.push(object)
        },

        function(xhr) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        
        function(error) {
            console.log( 'An error happened' );
        }
    )
}

loadBuildings('./assets/models/buildings/Residential Buildings 002.obj', 0, -15, -15, Math.PI/4, 2)
loadBuildings('./assets/models/buildings/Residential Buildings 003.obj', 35, -15, -60, Math.PI/4, 2.5)
loadBuildings('./assets/models/buildings/Residential Buildings 001.obj', -65, -15, 45, Math.PI/4, 2)
loadBuildings('./assets/models/buildings/Residential Buildings 004.obj', 65, -15, 50, Math.PI/4, 1.5)
loadBuildings('./assets/models/buildings/Residential Buildings 005.obj', 0, -15, 115, Math.PI/4,1.5)

loadMiscObjects('../../assets/models/gasStationNoSign.obj', -20, -15, 20, -Math.PI/4, 0.3)
loadMiscObjects('../../assets/models/gasStationSign.obj', -100, -15, 15, Math.PI/4, 0.5)
loadMiscObjects('../../assets/models/stoplight.obj', 30, 8, 52, -Math.PI/4, 0.2)
loadMiscObjects('../../assets/models/streetLightLakeMerritt.obj', 2, -1, 18, -Math.PI/4, 0.12)


// scale buildings according to audio

default_scales = [2, 2.5, 2, 1.5, 1.5]
max_scales = [0.02, 0.025, 0.02, 0.015, 0.015]

function update(pitch_array) { 
    for (let i = 0; i < pitch_array.length; i++) {

		let p = pitch_array[i] ; //normalize

        for (let j = 0; j < buildings.length; j++) {
            let a = (p * max_scales[j])/2
            let b = (p * max_scales[j])/2 + 0.5
            let norm = b + (a * Math.sin(delta - (Math.PI/2)))
            let default_xz = default_scales[j]
            buildings[j].scale.set(default_xz, norm, default_xz)
        }
    }
			      
    circle.rotation.y += 0.05
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

// animate scene based on time
// callse update
function animate() { 
    delta = clock.getDelta();
    evolveSmoke();

    blue_light.power = 4 * Math.PI * Math.sin(delta);
    red_light.power = 4 * Math.PI * Math.cos(delta);
    const pitch_array = audio.getFreqData();
    update(pitch_array);
}

// initalize scene
// function animate(){ 
//     // requestAnimationFrame(render);
//     // animate();
//     // renderer.render( scene, camera );
// }

// initScene();
// render();
// initScene();
