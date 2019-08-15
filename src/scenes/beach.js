

// the way scene

/* to do: effects and ideas 
- birds
- odezsa poster as scene inspo
- headlights (pointlights)
- fish under the sea
- cmmnd UV wrapping 
- move car down
- sun flare
- add sun shader (lines over time)
*/ 

/* scene objects */ 
var sun, particle, particles, polygon;
var waveParticles;

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
            particle.position.x = y * SEPARATION - ((AMOUNT * SEPARATION) / 2) ;
            particle.position.z = x * SEPARATION - ((AMOUNT * SEPARATION) / 2) + 60;
            particle.position.y = WAVE_Y;
            waveParticles[x].push(particle);
            
        }

    }
    return waveParticles;

}

// creating cloud morph targets for each sphere 
// morph to 0
// morph to cube?  (seems difficult)
// windmill morph
function getCloudMorph(mesh){ 
    let geometry = mesh.geometry;
    let morphAttributes = geometry.morphAttributes;
    let positions = geometry.attributes.position.array;

    // !!!! must be of bufferAttribute type 
    // https://stackoverflow.com/questions/28843938/three-js-how-to-create-new-morphing-geometry-if-i-have-all-necessary-buffers
    // underlying data buffers 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

    // typed array of morph targets
    // new array from positions
    // depending on number of positions, blades = pos/3 (3 points per blade)
    // 
    let targetPos = [];
    positions.forEach(()=> {
        var newPos; 
        var spin; 
        targetPos.push(mesh.position.x)
        targetPos.push(mesh.position.y)
        targetPos.push(mesh.position.z)
    })

    let morphTargets = new Float32Array(targetPos); // create morphtargets typed array from array

    // array of morphAttributes storing morph positions
    morphAttributes.position = []; 

    // push new buffer attribute from typed array of morph targets and number of components per vertex
    morphAttributes.position.push(new THREE.BufferAttribute(morphTargets, 3));
    mesh.updateMorphTargets();

    // initialize morph target influences
    mesh.morphTargetInfluences[0] = 0.;
}

function getCloud(side, rand1, rand2, rand3) { 
    let cloudGeometries = [];
    //generate random cloud  
    let cloudGeo = new THREE.SphereBufferGeometry( 3, 4, 4);
    cloudGeo.translate(-side*2,rand1*3,0);
    cloudGeo.rotateX(rand1); 
    let cloudGeo2 = new THREE.SphereBufferGeometry( 2, 5, 5);
    cloudGeo2.translate(0,rand2,0);
    cloudGeo2.rotateY(rand2); 
    let cloudGeo3 = new THREE.SphereBufferGeometry( 1, 5, 5);
    cloudGeo3.translate(side*2,rand3*3,0);
    cloudGeo2.rotateZ(rand3); 
   // console.log(cloudGeo.index, "index")
    cloudGeometries.push(cloudGeo, cloudGeo2, cloudGeo3)

    // merge array of geometries
    THREE.BufferGeometryUtils.mergeBufferGeometries(cloudGeometries, false);

    // return cloudGeo2 (merged cloud geometry);
    return cloudGeo;
}

function getClouds() { 

    //clouds (procedural)
    let clouds = [];

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

        let cloudGeo = getCloud(side, rand1, rand2, rand3);

        let cloudMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD9E9FF,
            flatShading: true,
            opacity: .5 ,
            morphTargets: true
        });    
    
        clouds[i] = new THREE.Mesh(cloudGeo, cloudMaterial);
        clouds[i].scale.set(20,15,20)
        clouds[i].position.set(500*Math.cos(angle+rand1), rand2*20 + 50 ,-500*Math.sin(angle+rand3))

        //generate cloud morph targets
        getCloudMorph(clouds[i]);
    }

    return clouds;
}

function getSun(r = 50) { 

    //sun
    var sunGeometry = new THREE.SphereGeometry( r, 32, 32 );;
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
    sun.position.z = -500;
    sun.position.y = 300;

//    var geom = new THREE.OctahedronGeometry(r + 30);

    // var mesh = new THREE.Mesh( geom, new THREE.MeshBasicMaterial({ 
    //     color: 0xffffff,
    //     wireframe: true
    // }));

    // mesh.position.set(0, -60, 0)
    // sun.add(mesh);

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
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.zoomSpeed = .5;
        this.controls.enablePan = true;

        this.orbit = new THREE.Group();
        this.sun = getSun();
        this.waveParticles = getWaveParticles();
        this.clouds = getClouds();
        this.particleSystem = getParticles();
        this.platform = getCliff();
        this.morph_amt = 0; // start with no influence
        this.morph_interval = 1000; //milliseconds
        // unique texture, objs etc. will load 
        this.polygon = getPolygonLogo();

        // postprocessing effects
        this.composer = new THREE.EffectComposer( renderer );
        this.renderPass = new THREE.RenderPass( this.scene, this.camera ); // new render 
        this.FilmPass = new THREE.FilmPass(  
            0.35,   // noise intensity
            0.1,  // scanline intensity
            648,    // scanline count
            false,  // grayscale 
        );
        this.RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader )
        this.composer.addPass( this.renderPass );
        this.FilmPass.renderToScreen = true;
        this.RGBShiftPass.renderToScreen = true;
        this.composer.addPass( this.RGBShiftPass )
        this.composer.addPass( this.FilmPass );
        this.postprocessing = true;

    
    }

    setObjects() { 
        this.setCar();
        this.setGrass();
    }

    setCar() { 
        this.scene.add(this.platform);
        car.position.set(0, -5, 60);
        car.rotation.set(0, 7*Math.PI/6, 0);
        car.scale.set( 1, 1, 1 );
        car.updateMatrix(); // updates local matrix 
        this.scene.add(car);
    }

    setGrass() { 
        grass.rotation.set(-Math.PI/2, 0, 0);
        grass.position.set(-3, 5, -2);
        grass.updateMatrix();
        cliff.add(grass);
        this.grass2.scale.set(.005,.005,.005);
        //grass2.rotateX(Math.PI/2);
        this.grass2.rotateY(3*Math.PI/5);
        this.grass2.position.set(-3.5, 6, -2);
        this.grass2.updateMatrix();
        cliff.add(this.grass2);
    }

    // call at interval
    morph() { 
        var _this = this;
        // create tween each frame drawn
        // for each cloud in array of clouds

        // changes morphtargetinfluences 
        // current influence -> target influence
        // morph between  0 -> 1, on update change the value of morph target influence 

        var current = {amt: this.morph_amt};
        var target = {amt: this.morph_amt == 0 ? 1 : 0}; //opposite of morph_amt
        var tween = new TWEEN.Tween(current).to(target, this.morph_interval - 10); 
        // divide by some morph_speed (according to music)
        tween.easing(TWEEN.Easing.Elastic.Out);

        tween.onUpdate(function(){ 
            //morphinfluence of each cloud
            for ( let c of _this.clouds ) { 
                c.morphTargetInfluences[0] = current.amt;
                _this.morph_amt = current.amt;
                //console.log(c.morphTargetInfluences[0], _this.morph_amt, "dictionary")
            }
             
        })

        tween.start();

    }

    setScene() {
        renderer.setClearColor(0xffffff, 0);
        this.scene.background = null;
        renderer.alpha = true;
    }

    initScene() { 
        // initialize and declare loaded models
        this.plane = models["plane"].clone()
        this.plane.scale.set(.05,.05,.05)
        this.plane.position.set(150, 0, 0)
        this.plane.rotation.set(0, Math.PI, 0)
        this.throttle = 0


        // set scene variables
        this.setScene()
        this.grass2 = grass.clone();
        this.setObjects();
        
        // morph 
        setInterval( ()=> { this.morph() }, this.morph_interval )

        this.camera.position.z = 80;
        // add car after place is set
        this.scene.add(this.sun);


        this.scene.add(this.particleSystem);
        this.scene.add(this.polygon);
        this.orbit.add(this.plane)
        this.scene.add(this.orbit)
        
        for( let r of this.waveParticles ) 
            for( let p of r )
                this.scene.add( p );
        
    
        for( let c of this.clouds ) 
            this.scene.add( c );

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
        // nothing here is being set 
        this.throttle += .05;
        this.plane.rotation.set( .1*Math.sin(this.throttle) + Math.PI, 0, .1*Math.sin(this.throttle) + Math.PI) 
        this.plane.position.y = 10*Math.sin(this.throttle)

        this.orbit.rotation.y -= .004;
        // this.sun.rotation.x += .005;
        

        var prevSpeed = 0 ; 
        var speed = 0;
        let indx = 0

        // fix this (a big slow down)
        for (let x = 0; x < AMOUNT; x++) {
            for (let y = 0; y < AMOUNT; y++) {
                let particle = this.waveParticles[x][y];
                //add frequency data to each particle
                //average with prev freq data
                speed = (.1*pitch_array[indx] + prevSpeed)/2.;
                particle.position.y = (Math.sin((x + count) * 3) * (WAVESIZE + speed)) + (Math.sin((y + count) * 5) * WAVESIZE) + WAVE_Y;
                let scale = (Math.sin((x + count) * 3) + 1) * MAXSIZE + (Math.sin((y + count) * 5) + 1) * MAXSIZE;
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

    // animate each scene
    animate() {

        const pitch_array = audio.getFreqData();
        this.update(pitch_array);

        TWEEN.update();
     
    }
}


