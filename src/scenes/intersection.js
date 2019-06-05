// yt scene

// initalize scene objects and scene attributes (background color, camera position, etc.)
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 90;

/* initialize renderer */
var renderer = new THREE.WebGLRenderer({alpha: true});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera);
controls.zoomSpeed = .5;
controls.minAzimuthAngle = - Math.PI/2;
controls.maxAzimuthAngle = Math.PI/2;

controls.enablePan = true;

let buildings = []

function setCar(obj) { 
    obj.position.z = 65;  
    obj.position.y = -12;
    obj.rotateY(7*Math.PI/6);
  
    car = obj;
    car.name = "OldCar"
  
    scene.add( car );
  }

function addFloor() {
    const width = 200;
    const height = 200;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
  
    // all materials can be changed according to your taste and needs
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: '#fff',
      metalness: 0,
      emissive: '#000000',
      roughness: 0,
    });
  
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  
    planeGeometry.rotateX(-Math.PI/2);
    planeGeometry.rotateY(-Math.PI/4);
  
    plane.position.y = -15;
  
    scene.add(plane);
}

function initScene() { 
    clock = new THREE.Clock();

    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    addFloor();

    for (let i = 0; i < 100; i += 10) {
        blue_light = new THREE.SpotLight(0x0000FF);
        blue_light.position.set(i,i,i);

        scene.add(blue_light);
    }

    for (let i = 5; i < 105; i += 10) {
        red_light = new THREE.SpotLight(0xff0000);
        red_light.position.set(i,i,i);

        scene.add(red_light);
    }
  
    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];

    for (p = -125; p < -70; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
}

// update scene dynamically according to music
// also calls update functions of common objects

var loader = new THREE.OBJLoader();
// var mtlLoader = new THREE.MTLLoader();

// mtlLoader.setPath('./assets/models/buildings/');

// load buildings
// buildings: https://free3d.com/3d-model/array-house-example-3033.html

// mtlLoader.load('/assets/models/buildings/Residential Buildings 002.mtl', 
// 					function (materials) {
// 						materials.preload();
//                         loader.setMaterials(materials);	
//                         console.log(materials)
// 						loader.load( './assets/models/buildings/Residential Buildings 002.obj',
//                             function(building) {
//                                 building.position.y = -15
//                                 building.rotation.y = Math.PI/4;
//                                 building.position.z = -15
//                                 building.scale.set(2, 2, 2)
//                                 // building.traverse(function(child) {
//                                 //             if (child instanceof THREE.Mesh) {
//                                 //                 child.material = new THREE.MeshStandardMaterial({
//                                 //                     color: 0x404040, 
//                                 //                 })
//                                 //                 }
//                                 //             } );
                            
//                                 window.building = building;
//                                 scene.add(building);
//                                 buildings.push(building);
//                             },
						
// 							function (xhr) {
//                                 console.log('object loaded')
// 								console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// 							},
							
// 							function (error) {
// 								console.log( 'An error happened' );
// 							}
// 						);
// 					});

function loadMiscObjects(path, pos_x, pos_y, pos_z, rot_y, scale) {
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
loadMiscObjects('../../assets/models/stoplight.obj', 42, 8, 40, -Math.PI/4, 0.2)
loadMiscObjects('../../assets/models/streetLightLakeMerritt.obj', -15, -3, 50, 0, 0.1)

// create tween objects for each building
// inspired by: https://gist.github.com/toto-castaldi/269b4f3b515355f8e2ef

let shrinkBuildings = []
let growBuildings = []

for (let i = 0; i < 5; i++) {
    growBuildings.push({grow: function(val) {return new TWEEN.Tween({
        scale: 0
    }).to ({
        scale: 2
    }, val).onUpdate(function () {
                buildings[i].scale.y = this.scale;
            }).onComplete(function () {
                shrinkBuildings[i].shrink().start();
        })
    }})
}

for (let i = 0; i < 5; i++) {
    shrinkBuildings.push({shrink: function(val) {return new TWEEN.Tween({
        scale: 2
    }).to ({
        scale: 0
    }, val).onUpdate(function () {
                buildings[i].scale.y = this.scale;
            }).onComplete(function () {
                growBuildings[i].grow().start();
        })
    }})
}

console.log(buildings.length)

function update(pitch_array) { 
    // car.rotation.y -= 0.05;
    console.log(pitch_array[0])
    for (let i = 0; i < 5; i++) {
        growBuildings[i].grow(pitch_array[0]).start();
    }
    TWEEN.update();
}

// animate scene based on time
// callse update
function animate() { 
    delta = clock.getDelta();
    evolveSmoke();

    const pitch_array = audio.getFreqData()
    update(pitch_array);
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

// initalize scene
function render(){ 
    requestAnimationFrame(render);
    animate();
    renderer.render( scene, camera );
}

// initScene();
// render();
// initScene();
