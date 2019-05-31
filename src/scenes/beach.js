// the way scene

/* to do: effects and ideas 
- birds
- headlights (pointlights)
- fish under the sea
- cmmnd UV wrapping 
- move car down
- sun flare
- add sun shader (lines over time)
*/ 

/* scene objects */ 
var clouds, sun, particle, particles, polygon;


/* scene timer */ 
var start = Date.now();
var end, timeDiff;

/* scene constants */ 
const CLOUD_NUM = 25;

/* wave constants */ 
const AMOUNT = 50; 
const SEPARATION = 4;

const MAXSIZE = .2;
const WAVESIZE = 2;
let WAVE_Y = -35;
var count = 0; // time

/* inspired by https://github.com/chebyrash/Waves/blob/master/static/js/projector.js */
function initWaveParticles(){ 

    particles = [];

    for (let x = 0; x < AMOUNT; x++) {
        particles.push([]);
        for (let y = 0; y < AMOUNT; y++) {

            let material = new THREE.MeshPhongMaterial({

                color: 0xffffff,
                program: function (context) {

                    context.beginPath();
                    context.arc(0, 0, 0.5, 0, Math.PI * 2, true);
                    context.fill();

                }

            });


            let normalizeX = x/AMOUNT;
            let normalizeY = y/AMOUNT;
            material.color = new THREE.Color(normalizeX, normalizeY, normalizeX);
            //let particleGeometry = new THREE.Sprite();
            let particle = new THREE.Sprite(material);
            particle.position.x = x * SEPARATION - ((AMOUNT * SEPARATION) / 2);
            particle.position.z = y * SEPARATION - ((AMOUNT * SEPARATION) / 2);
            particle.position.y = WAVE_Y;
            particles[x].push(particle);
            scene.add(particle);

        }
    }

}

const update = () => { 

    var prevSpeed = 0 ; 
    var speed = 0;
    for (let x = 0; x < AMOUNT; x++) {
        for (let y = 0; y < AMOUNT; y++) {
            let particle = particles[x][y];
            //add frequency data to each particle
            //average with prev freq data
            speed = (.1*pitch_array[0] + prevSpeed)/2.;
            particle.position.y = (Math.sin((x + count) * 0.3) * (WAVESIZE + speed)) + (Math.sin((y + count) * 0.5) * WAVESIZE) + WAVE_Y;
            let scale = (Math.sin((x + count) * 0.3) + 1) * MAXSIZE + (Math.sin((y + count) * 0.5) + 1) * MAXSIZE;
            particle.scale.x = particle.scale.y = scale;
            prevSpeed = speed;
        }
    }
    

    //update icosahedron
    polygon.rotation.x += .01;
    polygon.rotation.y += .01;
    polygon.position.y += -Math.sin(count);
    
    count += .03;
    

}

function initClouds() { 

    //clouds (procedural)
    clouds = [];

    for (let i = 0; i < CLOUD_NUM; i++){

        let side = 1;
        let rand1 = Math.random();
        let rand2 = Math.random();
        let rand3 = Math.random();
        //angle (position)
        let angle = i * (Math.PI) / 12;

        if( i%2 ) { 
            side = -1
        }
        

        //generate random clouds   
        let cloudGeo = new THREE.BoxGeometry( 3, 3, 3);
        cloudGeo.translate(-side*2,rand1*3,0);
        cloudGeo.rotateX(rand1); 
        let cloudGeo2 = new THREE.BoxGeometry( 2, 2, 2);
        cloudGeo2.translate(0,rand2,0);
        cloudGeo2.rotateY(rand2); 
        let cloudGeo3 = new THREE.BoxGeometry( 1, 1, 1);
        cloudGeo3.translate(side*2,rand3*3,0);
        cloudGeo2.rotateZ(rand3); 

        let cloudMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD9E9FF,
            flatShading: true,
            opacity: .5
        });

        //cloudMaterial.fog = true;
        //merge 
        cloudGeo.merge(cloudGeo2);
        cloudGeo.merge(cloudGeo3);
        cloudGeo.mergeVertices();



        clouds[i] = new THREE.Mesh(cloudGeo, cloudMaterial);
        clouds[i].scale.set(20,15,20)
        clouds[i].position.set(500*Math.cos(angle+rand1), rand2*20 + 50 ,-500*Math.sin(angle+rand3))
        scene.add(clouds[i]);

    }

}

function initSky() { 
    //sun
    var sunGeometry = new THREE.CircleGeometry( 50, 32 );;
    var sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
        color1: {
            value: new THREE.Color(0x8FFFF99)
        },
        color2: {
            value: new THREE.Color(0xffc922)
        }
        },
        vertexShader: `
        varying vec2 vUv;
    
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `,
        fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        
        varying vec2 vUv;
        
        void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
        `
    });

    
    sun = new THREE.Mesh( sunGeometry, sunMaterial );
    sun.position.z = -550;
    sun.position.y = 300;
    scene.add( sun );

}

function getParticles() { 


    //particles 
    // create the particle variables
    var particleCount = 1800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointCloudMaterial({
        color: 0xFFFFC2,
        size: .8,
        opacity: .8
    });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        // create a particle with random
        // position values, -250 -> 250
        particle = new THREE.Vector3();

        particle.x = Math.random() * 500 - 250,
        particle.y = Math.random() * 500 - 250,
        particle.z = Math.random() * 500 - 250,

        // add it to the geometry
        particles.vertices.push(particle);
    }

    var particleSystem = new THREE.PointCloud(
        particles,
        pMaterial);


    scene.add(particleSystem);
    
}

// call each time a new scene is rendered
function setCar(obj) { 
    obj.position.z = 60;  
    obj.position.y = -5;
    obj.rotateY(7*Math.PI/6);

    car = obj;
    car.name = "OldCar"

    scene.add( car );
}

function initScene() {
    
    renderer.alpha = false;

    initSky();

    initClouds();

    initWaveParticles();

    getParticles();

    var dynamicGeometry = new THREE.IcosahedronBufferGeometry(20, 0);
    var dynamicMaterial = new THREE.MeshPhongMaterial({ 

        color: 0xffffff,
        shading: THREE.FlatShading

    } );

    polygon = new THREE.Mesh(dynamicGeometry, dynamicMaterial);
    polygon.position.set(0,10,-80)
    polygon.lights = true;
    scene.add(polygon);


    //blue light
    const light = new THREE.DirectionalLight( 0x11e8bb, .5 );
    light.position.set( 0, -10, 0 ).normalize();

    //yellow light
    const sunLight = new THREE.DirectionalLight( 0xffc922, 1); 
    sunLight.position.set( 0, 10, -10 ).normalize();

    //pink light
    //add the pink light to car headlights
    const pinkLight = new THREE.DirectionalLight( 0x8200c9, .5); 
    pinkLight.position.set( 0, 5, -10 ).normalize();
    
    scene.add(light);
    sun.add(sunLight);
    scene.add(pinkLight);

    //ambient light
    scene.add(new THREE.AmbientLight( 0xffffff, .5));

    camera.position.z = 85;
}



function animate() {
    update();
    //deals with pitch (and bass)
    analyser.getByteFrequencyData(pitch_array);
    //deals with volume
    analyser.getByteTimeDomainData(volume_array);

    end = Date.now();
    timeDiff = start - end; 

}

