// yt scene
let buildings = []
let miscObjects = []

var loader = new THREE.OBJLoader();
// var mtlLoader = new THREE.MTLLoader();
let delta = 0;

function getCssValuePrefix()
{
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background)
        {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
}

let orientation = '90deg';
let colorOne = '#1a2a6c';
let colorTwo = '#8b0046';
let colorThree = '#fdbb2d';

function loadMiscObjects(path, pos_x, pos_y, pos_z, rot_y, scale) {
    // console.log('loading building models')
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

    let donuts = []
    
    // generate various sizes of donuts
    for (let i = 0; i <= 75; i++) {
        console.log('getting donuts')
        let radius = Math.random() * 2 + .5; 
        let donut_geo = new THREE.TorusGeometry(radius, .7*radius, 16, 100)
        let donut_material
        // donut_geo = new THREE.TorusGeometry(1.5, 1, 16, 100)

        if (i % 2 == 0) {
            donut_material = new THREE.MeshPhongMaterial({ color: 0xffffff })
        } else {
            donut_material = new THREE.MeshPhongMaterial({ color: 0xffff00 })
        }

        let donut = new THREE.Mesh(donut_geo, donut_material);

        donut.position.x = (Math.random() * 300 - 140)
        donut.position.y = (Math.random() * 30 + 40)
        donut.position.z = (Math.random() * 200 - 110)
        
        if (i % 2 == 0) {
            donut.rotation.x = Math.PI/3
        } else {
            donut.rotation.x = -Math.PI/3
        }

        donuts.push(donut)
    }

    return donuts
}

// Reference: http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/
function generateBuildingTexture() {
    // build a small canvas 32x64 and paint it in white
    var canvas  = document.createElement( 'canvas' );
    canvas.width = 32;
    canvas.height    = 64;
    var context = canvas.getContext( '2d' );
    // plain it in white
    context.fillStyle    = '#ffffff';
    context.fillRect( 0, 0, 32, 64 );
    // draw the window rows - with a small noise to simulate light variations in each room
    for( var y = 2; y < 64; y += 2 ){
        for( var x = 0; x < 32; x += 2 ){
            var value   = Math.floor( Math.random() * 64 );
            context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
            context.fillRect( x, y, 2, 1 );
        }
    }
  
    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    var canvas2 = document.createElement( 'canvas' );
    canvas2.width    = 512;
    canvas2.height   = 1024;
    var context = canvas2.getContext( '2d' );
    // disable smoothing
    context.imageSmoothingEnabled        = false;
    context.webkitImageSmoothingEnabled  = false;
    context.mozImageSmoothingEnabled = false;
    // then draw the image
    context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
    // return the just built canvas2
    return canvas2;
}

function getBuildings() {
    console.log('creating buildings')
    let buildings = []

    // let building_geo = new THREE.CubeGeometry(30, 80, 30)
    let building_geo1 = new THREE.CubeGeometry(30, 80, 30)
    let building_geo2 = new THREE.CubeGeometry(45, 56, 45)
    let building_geo3 = new THREE.CubeGeometry(1.2*30, 0.9*80, 30)
    let building_geo4 = new THREE.CubeGeometry(2*30, 0.7*80, 30)
    let building_geo5 = new THREE.CubeGeometry(30, 1.2*80, 30)

    // generate the texture
    let texture = new THREE.Texture( generateBuildingTexture() );
    texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate    = true;

    // build the mesh
    let material  = new THREE.MeshLambertMaterial({
        map: texture,
        color: 0x7d7d7d,
        vertexColors: THREE.VertexColors
    });

    let building1 = new THREE.Mesh(building_geo1, material)
    building1.rotation.y = -Math.PI/4
    building1.position.y = 25
    building1.position.x = 5
    building1.position.z = -10
    buildings.push(building1)

    let building2 = new THREE.Mesh(building_geo2, material)
    building2.rotation.y = -3*Math.PI/4
    building2.position.y = 13
    building2.position.x = 40
    building2.position.z = -55
    buildings.push(building2)

    let building3 = new THREE.Mesh(building_geo3, material)
    building3.rotation.y = -Math.PI/4
    building3.position.y = 20
    building3.position.x = -62
    building3.position.z = 53
    buildings.push(building3)

    let building4 = new THREE.Mesh(building_geo4, material)
    building4.rotation.y = Math.PI/4
    building4.position.y = 13
    building4.position.x = 73
    building4.position.z = 40
    buildings.push(building4)

    let building5 = new THREE.Mesh(building_geo5, material)
    building5.rotation.y = -3*Math.PI/4
    building5.position.y = 33
    building5.position.x = 0
    building5.position.z = 115
    buildings.push(building5)

    return buildings
}


loadMiscObjects('../../assets/models/gasStationNoSign.obj', -20, -15, 20, -Math.PI/4, 0.3)
loadMiscObjects('../../assets/models/gasStationSign.obj', -100, -15, 15, Math.PI/4, 0.5)
loadMiscObjects('../../assets/models/stoplight.obj', 30, 8, 52, -Math.PI/4, 0.2)
loadMiscObjects('../../assets/models/streetLightLakeMerritt.obj', 2, -1, 18, -Math.PI/4, 0.12)

class IntersectionScene {
    constructor() { 
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.zoomSpeed = .5;
        this.controls.enablePan = true;
        
        this.floor = getFloor()
        this.streets = getStreets()
        this.circle = getCircle()
        this.buildings = getBuildings()
        this.donuts = getDonuts()
        this.car = models.car.clone()
        this.donut_y_positions = []
        this.donut_amplitudes = []
        this.default_y_scales = [1, 0.7, 0.9, 0.7, 1.2]
        this.default_heights = [80, 56, 72, 56, 96]
        this.smokeParticles = []
        this.delta = clock.getDelta()
        this.prevNorm = 1

        this.composer = new THREE.EffectComposer( renderer );
        this.renderPass = new THREE.RenderPass( this.scene, this.camera ); // new render 
        this.FilmPass = new THREE.FilmPass(  
            0.35,   // noise intensity
            0.1,  // scanline intensity
            648,    // scanline count
            false,  // grayscale 
        );
        this.RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader );
        this.composer.addPass( this.renderPass );
        this.FilmPass.renderToScreen = true;
        this.RGBShiftPass.renderToScreen = true;
        this.composer.addPass( this.RGBShiftPass );
        this.composer.addPass( this.FilmPass );
        this.postprocessing = true;
    }

    setCar() { 
        // car.position.y = 2;
        // car.position.x = 0;
        this.car.position.set(0,2,10);
        this.car.rotation.set(0,3*Math.PI/2,0)
        this.car.scale.set(1,1,1)
        this.car.updateMatrix();
      
        //console.log(car)
        this.circle.add(this.car);
    }

    setObjects() {
        this.setCar()
    }
    
    setScene() { 
        renderer.setClearColor(0x120A8F, .1);
        // // Setting the gradient with the proper prefix
        document.getElementsByTagName('canvas')[0].style.backgroundImage = getCssValuePrefix() + 'linear-gradient('
        + orientation + ', ' + colorThree + ', ' + colorTwo + ', ' + colorOne + ')';
    }

    initScene() {
        this.setScene()
        this.camera.position.z = 100
        THREE.ImageUtils.crossOrigin = ''; 
        //Need this to pull in crossdomain images from AWS

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
        for (let i = 0; i < this.buildings.length; i++) {
            this.scene.add(this.buildings[i])
        }
        
        for (let i = 0; i < miscObjects.length; i++) {
            console.log('adding misc objects to the scene')
            this.scene.add(miscObjects[i])
        }
    }

    // scale buildings, move car + move donuts according to audio
    update(pitch_array) {
        for (let i = 0; i < this.buildings.length; i++) {
            let norm = -pitch_array[1]/300 * this.default_y_scales[i] + this.default_y_scales[i]
            this.buildings[i].scale.set(1, norm, 1)
            this.buildings[i].position.y = (this.default_heights[i]*norm)/2 - 15
        }

        for (let i = 0; i < this.donuts.length; i++) {

            if (pitch_array[1]/2000 < 0.04) {
                this.donuts[i].rotation.x += 0.04
                this.donuts[i].rotation.y += 0.04
            } else {
                if (i % 3 == 0) {
                    this.donuts[i].rotation.x += pitch_array[1]/2000
                    this.donuts[i].rotation.y += pitch_array[1]/2000
                }
                else {
                    this.donuts[i].rotation.x += -pitch_array[1]/2000
                    this.donuts[i].rotation.y += -pitch_array[1]/2000
                }
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
