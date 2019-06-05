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
    console.log('getting streets')
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

function getDonuts() {
    console.log('getting donuts')
    let donut_geo = new THREE.TorusGeometry(1, 0.7, 16, 100)
    let donut_material
    let donuts = []
    
    // generate various sizes of donuts
    for (let i = 0; i <= 100; i++) {
        // donut_geo = new THREE.TorusGeometry(1.5, 1, 16, 100)

        if (i % 2 == 0) {
            donut_material = new THREE.MeshPhongMaterial({ color: 0xffffff })
        } else {
            donut_material = new THREE.MeshPhongMaterial({ color: 0xffff00 })
        }

        let donut = new THREE.Mesh(donut_geo, donut_material);

        donut.position.x = (Math.random() * 200 - 100)
        donut.position.y = (Math.random() * 100 - 30)
        donut.position.z = (Math.random() * 200 - 100)
        
        if (i % 2 == 0) {
            donut.rotation.x = Math.PI/3
        } else {
            donut.rotation.x = -Math.PI/3
        }

        donuts.push(donut)
    }

    return donuts
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
        this.donuts = getDonuts()
        this.donut_y_positions = []
        this.donut_amplitudes = []
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

        console.log(this.donuts.length)
        for (let donut of this.donuts) {
            console.log('adding donuts to the scene')
            this.scene.add(donut)
            this.donut_amplitudes.push(donut.position.y)
            this.donut_y_positions.push(donut.position.y)
        }
    
        let light = new THREE.PointLight(0xFFFFFF);
        light.position.set(3, -3, 18)
        this.scene.add(light)

        let ambientLight = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        this.scene.add(ambientLight);
    
        // let ambientLight = new THREE.AmbientLight( 0xbc13fe ); // soft white light
        // this.scene.add(ambientLight);
    
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

    // scale buildings, move car + move donuts according to audio
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

        for (let i = 0; i < this.donuts.length; i++) {

            if (pitch_array[1]/2000 < 0.04) {
                this.donuts[i].rotation.x += 0.04
                this.donuts[i].rotation.y += 0.04
            } else {
                this.donuts[i].rotation.x += pitch_array[1]/2000
                this.donuts[i].rotation.y += pitch_array[1]/2000
            }

            if (pitch_array[1] <= 80) {
                if (i % 2 == 0) {
                    this.donuts[i].material.color.set(0xff69b4)
                } else {
                    this.donuts[i].material.color.set(0xffff00)
                }
            } else if (pitch_array[1] > 80 && pitch_array[1] <= 160) {
                if (i % 3 == 0) {
                    this.donuts[i].material.color.set(0x3eb0f7)
                } else {
                    this.donuts[i].material.color.set(0x8A2BE2)
                }
            } else {
                if (i % 4 == 0) {
                    this.donuts[i].material.color.set(0x00FF00)
                } else {
                    this.donuts[i].material.color.set(0x3eb0f7)
                }
            }

            // let a = this.donut_amplitudes[i] + 1000
            // this.donuts[i].position.y = (a * Math.sin(this.delta / 1000)) + this.donut_y_positions[i]
        }
        
        if (pitch_array[1]/3500 < 0.04) {
            this.circle.rotation.y += 0.04
        } else {
            this.circle.rotation.y += pitch_array[1]/3500
        }
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
        const pitch_array = audio.getFreqData();
        this.update(pitch_array);
    }
}
