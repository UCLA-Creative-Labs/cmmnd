// yt scene

// initalize scene objects and scene attributes (background color, camera position, etc.)

var AudioContext, theway;
AudioContext = window.AudioContext || window.webkitAudioContext;
theway = document.getElementById('audio');

var context = new AudioContext;

function playAudio() { 
    console.log("play audio")

    context.resume().then( () => { 
        audio.load()
        audio.play();
    });
    
}
var analyser = context.createAnalyser();

var source = context.createMediaElementSource(theway);
source.connect(analyser); 

analyser.connect(context.destination);
analyser.smoothingTimeConstant = .8;
analyser.fftSize = 1024;

var bufferlen = analyser.frequencyBinCount;
var pitch_array = new Uint8Array(bufferlen);
var volume_array = new Uint8Array(bufferlen);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 150;

/* initialize renderer */
var renderer = new THREE.WebGLRenderer({alpha: true});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera);
controls.zoomSpeed = .5;
controls.minAzimuthAngle = - Math.PI/2;
controls.maxAzimuthAngle = Math.PI/2;

controls.enablePan = true;

// add platform 
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
  
    this.scene.add(plane);
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

// load buildings
// buildings: https://free3d.com/3d-model/array-house-example-3033.html
loader.load(
    './assets/models/buildings/building_02.obj',
    
    function(building) {
        building.position.y = -15
        building.rotation.y = Math.PI/4;
        building.position.z = -15
        building.scale.set(2, 2, 2)
        building.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x404040, 
                        })
                        }
                    } );
    
        window.building = building;
        scene.add(building);
    },
        
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
        
    function(error) {
        console.log('An error happened');
    }
);

loader.load(
    './assets/models/buildings/building_03.obj',

    function(building) {
        building.position.y = -15
        building.rotation.y = Math.PI/4;
        building.position.z = -60
        building.position.x = 35
        building.scale.set(2.5, 2.5, 2.5)
        building.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x404040, 
                        })
                        }
                    } );
    
        window.building = building;
        scene.add(building);
    },
        
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
        
    function(error) {
        console.log('An error happened');
    }
)

loader.load(
    './assets/models/buildings/building_01.obj',

    function(building) {
        building.position.y = -15
        building.rotation.y = Math.PI/4;
        building.position.z = 45
        building.position.x = -65
        building.scale.set(2, 2, 2)
        building.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x404040, 
                        })
                        }
                    } );
    
        window.building = building;
        scene.add(building);
    },
        
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
        
    function(error) {
        console.log('An error happened');
    }
)

loader.load(
    './assets/models/buildings/building_04.obj',
    
    function(building) {
        building.position.y = -15
        building.rotation.y = Math.PI/4;
        building.position.z = 50
        building.position.x = 65
        building.scale.set(1.5, 1.5, 1.5)
        building.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x404040, 
                        })
                        }
                    } );
    
        window.building = building;
        scene.add(building);
    },
        
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
        
    function(error) {
        console.log('An error happened');
    }
);

loader.load(
    './assets/models/buildings/building_05.obj',
    
    function(building) {
        building.position.y = -15
        building.rotation.y = Math.PI/4;
        building.position.z = 115
        building.position.x = 0
        building.scale.set(1.5, 1.5, 1.5)
        building.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x404040, 
                        })
                        }
                    } );
    
        window.building = building;
        scene.add(building);
    },
        
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
        
    function(error) {
        console.log('An error happened');
    }
);

// load car 
loader.load(
    './assets/models/car_model_halfsize.obj',

    function (car) {
        car.position.y = -12
        car.position.z = 60;
        car.rotation.x = Math.PI/2;
        car.rotation.y = Math.PI;
        car.traverse(function(child) {
                 if (child instanceof THREE.Mesh) {
                      child.material = new THREE.MeshStandardMaterial({
                          color: 0x404040, 
                      })
                     }
                 } );

        car.rotateX(Math.PI/2);
        car.rotateY(7*Math.PI/6);

        window.car = car;

        scene.add(car);
    },
    
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    
    function(error) {
        console.log('An error happened');
    }
);

// load gas station
loader.load(
    '../../assets/models/gasStationNoSign.obj',

    function(gasStation) {
        gasStation.position.z = 20
        gasStation.position.x = -20
        gasStation.position.y = -15
        gasStation.rotation.y = -Math.PI/4;
        gasStation.scale.set(0.3, 0.3, 0.3)
        gasStation.traverse(function(child) {
                 if (child instanceof THREE.Mesh) {
                      child.material = new THREE.MeshStandardMaterial({
                          color: 0x404040, 
                      })
                     }
                 });

        window.gasStation = gasStation;

        scene.add(gasStation);
    },
    
    function(xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    
    function(error) {
        console.log( 'An error happened' );
    }
);

// load gas station sign

loader.load(
    '../../assets/models/gasStationSign.obj',

    function(gasStationSign) {
        gasStationSign.position.x = -100
        gasStationSign.position.y = -15
        gasStationSign.position.z = 15
        gasStationSign.rotation.y = Math.PI/4
        gasStationSign.scale.set(0.5, 0.5, 0.5)
        gasStationSign.traverse(function(child) {
                 if(child instanceof THREE.Mesh) {
                      child.material = new THREE.MeshStandardMaterial({
                          color: 0x404040, 
                      })
                     }
                 } );

        window.gasStationSign = gasStationSign;

        scene.add(gasStationSign);
    },
    
    function(xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    
    function(error) {
        console.log( 'An error happened' );
    }
);

// load streetlight
loader.load(
    '../../assets/models/streetLightLakeMerritt.obj',

    function(streetlight) {
        streetlight.position.z = 50
        streetlight.position.x = -10
        streetlight.scale.set(0.1, 0.1, 0.1)
        streetlight.traverse( function ( child ) {
                 if ( child instanceof THREE.Mesh ) {
                      child.material = new THREE.MeshStandardMaterial({
                          color: 0x404040, 
                      })
                     
                     }
                 } );

        window.streetlight = streetlight;

        scene.add(streetlight);
    },
    
    function(xhr) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    
    function(error) {
        console.log( 'An error happened' );
    }
);

function update() { 
    // car.rotation.y -= 0.05;
}

// animate scene based on time
// callse update
function animate() { 
    delta = clock.getDelta();
    evolveSmoke();
    update();
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

initScene();
render();