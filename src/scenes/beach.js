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
var waveParticles;

/* scene timer */ 
var start = Date.now();
var end, timeDiff;

/* scene constants */ 
const CLOUD_NUM = 25;

/* wave constants */ 
const AMOUNT = 50; 
const SEPARATION = 4;

const MAXSIZE = 0.2;
const WAVESIZE = 2;
let WAVE_Y = -35;
var count = 0; // time



// set position of car object

/* inspired by https://github.com/chebyrash/Waves/blob/master/static/js/projector.js */
function getWaveParticles(){ 

    waveParticles = [];

    for (let x = 0; x < AMOUNT; x++) {
        waveParticles.push([]);

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
            
            let particle = new THREE.Sprite(material);
            particle.position.x = x * SEPARATION - ((AMOUNT * SEPARATION) / 2);
            particle.position.z = y * SEPARATION - ((AMOUNT * SEPARATION) / 2);
            particle.position.y = WAVE_Y;
            waveParticles[x].push(particle);
            
        }

    }
    console.log(waveParticles);
    return waveParticles;

}

function getClouds() { 

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
    }

    return clouds;
}

function getSun() { 
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
    return sun;

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

    (particle.x = Math.random() * 500 - 250),
      (particle.y = Math.random() * 500 - 250),
      (particle.z = Math.random() * 500 - 250),
      // add it to the geometry
      particles.vertices.push(particle);
  }

  // create the particle system
  var particleSystem = new THREE.PointCloud(particles, pMaterial);

    var particleSystem = new THREE.PointCloud(
        particles,
        pMaterial);


    return particleSystem;
    
}


class BeachScene { 
    constructor() { 

        // BeachScene.scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.sun = getSun();
        this.waveParticles = getWaveParticles();
        this.clouds = getClouds();
        this.particleSystem = getParticles();
        this.platform = getCliff();

        // unique texture, objs etc. will load 
        this.polygon = getPolygonLogo();

    }

    setCar(obj) { 
        obj.position.z = 60;  
        obj.position.y = -5;
        obj.rotateY(7*Math.PI/6);
      
        return obj;
    }

    initScene() { 

        // set other params  
        renderer.alpha = false;
        this.camera.position.z = 85;

        // add car after place is set
        this.scene.add(this.setCar(car));
        this.scene.add(this.platform)
        this.scene.add(this.sun);
    

        this.scene.add(this.particleSystem);
        this.scene.add(this.polygon);
        
        for( let r of this.waveParticles ) { 
            for( let p of r ) { 
                this.scene.add( p );
            }
        }
    
        for( let c of this.clouds ) { 
            this.scene.add( c );
        }


        // add lights
        const sunLight = new THREE.DirectionalLight(0xffc922, 1);
        sunLight.position.set(0, 10, -10).normalize();

        const pinkLight = new THREE.DirectionalLight( 0x8200c9, .5); 
        pinkLight.position.set( 0, 5, -10 ).normalize();
        
        this.sun.add(sunLight);
        this.scene.add(pinkLight);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    }

    update(pitch_array) { 

        var prevSpeed = 0 ; 
        var speed = 0;
        let indx = 0
        for (let x = 0; x < AMOUNT; x++) {
            for (let y = 0; y < AMOUNT; y++) {
                let particle = this.waveParticles[x][y];
                //add frequency data to each particle
                //average with prev freq data
                speed = (.1*pitch_array[indx] + prevSpeed)/2.;
                particle.position.y = (Math.sin((x + count) * 0.3) * (WAVESIZE + speed)) + (Math.sin((y + count) * 0.5) * WAVESIZE) + WAVE_Y;
                let scale = (Math.sin((x + count) * 0.3) + 1) * MAXSIZE + (Math.sin((y + count) * 0.5) + 1) * MAXSIZE;
                particle.scale.x = particle.scale.y = scale;
                prevSpeed = speed;
                if( indx < pitch_array.length )
                    indx++;
                else
                    indx--;
            }
          }
    
        //update icosahedron
        polygon.rotation.x += .01;
        polygon.rotation.y += .01;
        polygon.position.y += -Math.sin(count);
        
        count += .03;

    }

    animate() {

        const pitch_array = audio.getFreqData();
        this.update(pitch_array);

    }
}


