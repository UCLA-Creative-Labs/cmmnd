// yt scene
let buildings = []
let miscObjects = []

var loader = new THREE.OBJLoader();
// var mtlLoader = new THREE.MTLLoader();
let delta = 0;

function loadMiscObjects(path, pos_x, pos_y, pos_z, rot_y, scale) {
    console.log('loading building models')
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
            miscObjects.push(object)
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

function getCircle() {
    const circleGeo = new THREE.CircleGeometry(8, 50)
    const circleMaterial = new THREE.MeshBasicMaterial(
        {color: '#000',
        metalness: 0,
        emissive: '#000000',
        opacity: 0,
        transparent: true,
        depthWrite: false}
    )
    
    circleGeo.rotateX(-Math.PI/2);
    circleGeo.rotateY(-Math.PI/4);
    
    let circle = new THREE.Mesh(circleGeo, circleMaterial);
    circle.position.y = -15
    circle.position.z = 60
    
    return circle
}

function getFloor() {
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
  
    return plane
}

function getStreets() {
    let streets = []
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

    streets.push(street1)
    streets.push(street2)
    streets.push(street3)

    return streets
}

loadBuildings('./assets/models/buildings/Residential Buildings 002.obj', -5, -15, -17, Math.PI/4, 2)
loadBuildings('./assets/models/buildings/Residential Buildings 003.obj', 35, -15, -58, Math.PI/4, 2.5)
loadBuildings('./assets/models/buildings/Residential Buildings 001.obj', -65, -15, 45, Math.PI/4, 2)
loadBuildings('./assets/models/buildings/Residential Buildings 004.obj', 65, -15, 50, Math.PI/4, 1.5)
loadBuildings('./assets/models/buildings/Residential Buildings 005.obj', 0, -15, 115, Math.PI/4,1.5)

loadMiscObjects('../../assets/models/gasStationNoSign.obj', -20, -15, 20, -Math.PI/4, 0.3)
loadMiscObjects('../../assets/models/gasStationSign.obj', -100, -15, 15, Math.PI/4, 0.5)
loadMiscObjects('../../assets/models/stoplight.obj', 30, 8, 52, -Math.PI/4, 0.2)
loadMiscObjects('../../assets/models/streetLightLakeMerritt.obj', 2, -1, 18, -Math.PI/4, 0.12)

class IntersectionScene {
    constructor() { 
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.floor = getFloor()
        this.streets = getStreets()
        this.circle = getCircle()
        this.default_scales = [2, 2.5, 2, 1.5, 1.5]
        this.max_scales = [2/80, 2.5/80, 1.5/80, 1.5/80, 1.5/80]
        this.buildings = []
        this.smokeParticles = []
        this.delta = clock.getDelta()
        this.prevNorm = 1
    }

    setCar() { 
        car.position.y = 2;
        car.position.x = -10;
        car.rotateY(3*Math.PI/2);
      
        console.log(car)
        this.circle.add(car);
    }

    setObjects() {
        this.setCar()
    }

    initScene() {
        this.camera.position.z = 100
        THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS

        // Add platform objects
        this.scene.add(this.circle)
        this.scene.add(this.floor)

        for (let street of this.streets) {
            this.scene.add(street)
        }
        this.setObjects()

        // Add lights
        // let brightness = new THREE.AmbientLight(0xffffff, .7);
        // this.scene.add(brightness);
    
        let light = new THREE.PointLight(0xFFFFFF);
        light.position.set(3, -3, 18)
        this.scene.add(light)
    
        let ambientLight = new THREE.AmbientLight( 0xbc13fe ); // soft white light
        this.scene.add(ambientLight);
    
        for (let i = 0; i < 200; i += 10) {
            let blue_light = new THREE.PointLight(0x0000FF, 1., 100);
            blue_light.position.set(10,i,i);
    
            this.scene.add(blue_light);
        }
    
        for (let i = 5; i < 205; i += 10) {
            let red_light = new THREE.PointLight(0xff0000, 1., 100);
            red_light.position.set(i,10,i);
    
            this.scene.add(red_light);
        }
    
        // Add smoke 
        let smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
        let smokeMaterial = new THREE.MeshLambertMaterial({color: 0xff69b4, map: smokeTexture, transparent: true});
        let smokeGeo = new THREE.PlaneGeometry(300,300);
    
        for (let p = -75; p < -70; p++) {
            var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
            particle.position.set(Math.random()*300-250,Math.random()*300-250,Math.random()*300-100);
            particle.rotation.z = Math.random() * 360;
            this.scene.add(particle);
            this.smokeParticles.push(particle);
        }

        // Add 3d models
        
        for (let building of buildings) {
            console.log('hi')
            this.buildings.push(building)
            this.scene.add(building)
        }
        
        for (let i = 0; i < miscObjects.length; i++) {
            this.scene.add(miscObjects[i])
        }
    }

    // scale buildings according to audio
    update(pitch_array) {
        for (let i = 0; i < this.buildings.length; i++) {
            let a = (pitch_array[1] * this.max_scales[i])/2 + 1
            let b = (pitch_array[1] * this.max_scales[i])/2 + 1
            let norm = (b + (a * Math.sin(this.delta - (Math.PI/2)))) * 1000 + 0.9

            for (let j = 0; j <= 6; j++) {
                norm = (norm + this.prevNorm)/2
            }

            norm += 0.01
            this.prevNorm = norm
            let default_xz = this.default_scales[i]
            this.buildings[i].scale.set(default_xz, norm, default_xz)
        }
                      
        this.circle.rotation.y += 0.05
    }

    // move smoke according to time
    evolveSmoke() {
        var sp = this.smokeParticles.length;
        while(sp--) {
            this.smokeParticles[sp].rotation.z += (this.delta * 0.2);
        }
    }

    // animate function
    animate() { 
        this.delta = clock.getDelta();
        this.evolveSmoke();
        // this.blue_light.power = 4 * Math.PI * Math.sin(this.delta);
        // red_light.power = 4 * Math.PI * Math.cos(this.delta);
        const pitch_array = audio.getFreqData();
        this.update(pitch_array);
    }
}
