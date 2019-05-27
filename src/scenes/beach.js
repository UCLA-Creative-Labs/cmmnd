// the way scene

/* effects and ideas 
- birds
- lo poly clouds
- gradient sunset 
- fog and light source
- lo poly waves with slight reflectance
*/ 
// import {background} from "./materials.js";

var start = Date.now();
var end, timeDiff;

var cube, plane, clouds, circle, particle, particles;
var dynamicShape;
const cloud_num = 12;

const AMOUNT = 50; 
const SEPARATION = 4;

const MAXSIZE = .2;
const WAVESIZE = 2;
var count = 0;
let WAVE_Y = -35;

class WaveShader { 
    vertexShader() { 
        return (`
        precision highp float;

        uniform float	u_amplitude;
        uniform float 	u_frequency;
        uniform float   u_time;

        // GLSL textureless classic 3D noise "cnoise",
        // with an RSL-style periodic variant "pnoise".
        // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
        // Version: 2011-10-11
        //
        // Many thanks to Ian McEwan of Ashima Arts for the
        // ideas for permutation and gradient selection.
        //
        // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
        // Distributed under the MIT license. See LICENSE file.
        // 
        
        //
    
        vec3 mod289(vec3 x)
        {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
    
        vec4 mod289(vec4 x)
        {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
    
        vec4 permute(vec4 x)
        {
            return mod289(((x*34.0)+1.0)*x);
        }
    
        vec4 taylorInvSqrt(vec4 r)
        {
            return 1.79284291400159 - 0.85373472095314 * r;
        }
    
        vec3 fade(vec3 t) {
            return t*t*t*(t*(t*6.0-15.0)+10.0);
        }
    
        // Classic Perlin noise
        float cnoise(vec3 P)
        {
            vec3 Pi0 = floor(P); // Integer part for indexing
            vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
            Pi0 = mod289(Pi0);
            Pi1 = mod289(Pi1);

            vec3 Pf0 = fract(P); // Fractional part for interpolation
            vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;
    
            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);
    
            vec4 gx0 = ixy0 * (1.0 / 7.0);
            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
            vec4 gx1 = ixy1 * (1.0 / 7.0);
            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;
    
            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);
    
            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
        }

        void main() {

            float displacement = cnoise( position + u_time + u_amplitude);
    
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            
        }
        `)
    }

    fragmentShader() { 
        return (`
            precision highp float;

            void main() {
                float norm = 256.;
                float x = 74./norm;
                float y = 37./norm;
                float z = 222./norm;
                gl_FragColor = vec4(x, y, z, 1.0);
            }
            
        `)

    }
} 


//for fog


/* inspired by https://github.com/chebyrash/Waves/blob/master/static/js/projector.js */
function initWaveParticles(){ 

    particles = [];

    for (let x = 0; x < AMOUNT; x++) {
        particles.push([]);
        for (let y = 0; y < AMOUNT; y++) {
            let material = new THREE.MeshBasicMaterial({
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
            let particle = new THREE.Sprite( material);
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
    var speed;
    for (let x = 0; x < AMOUNT; x++) {
        for (let y = 0; y < AMOUNT; y++) {
            let particle = particles[x][y];
            //add frequency data to each particle
            //average with prev freq data

            speed =+ (.1*pitch_array[0] + prevSpeed)/2.;
            particle.position.y = (Math.sin((x + count) * 0.3) * (WAVESIZE + speed)) + (Math.sin((y + count) * 0.5) * WAVESIZE) + WAVE_Y;
            let scale = (Math.sin((x + count) * 0.3) + 1) * MAXSIZE + (Math.sin((y + count) * 0.5) + 1) * MAXSIZE;
            particle.scale.x = particle.scale.y = scale;
            prevSpeed = speed;
        }
    }
    count += .05;
}



function initClouds() { 
    //clouds (procedural)
    clouds = [];

    for (let i = 0; i < cloud_num; i++){

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
        let cloudGeo = new THREE.BoxGeometry( 30, 30, 30);
        cloudGeo.translate(-side*25,rand1,0);
        cloudGeo.rotateX(rand1); 
        let cloudGeo2 = new THREE.BoxGeometry( 20, 20, 20);
        cloudGeo2.translate(0,rand2,0);
        cloudGeo2.rotateY(rand2); 
        let cloudGeo3 = new THREE.BoxGeometry( 10, 10, 10);
        cloudGeo3.translate(side*20,rand3,0);
        cloudGeo2.rotateZ(rand3); 

        let cloudMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xD9E9FF,
            flatShading: true,
            opacity: .75
        });
        //cloudMaterial.fog = true;
        //merge 
        cloudGeo.merge(cloudGeo2);
        cloudGeo.merge(cloudGeo3);
        cloudGeo.mergeVertices();

        //randomize vertices (jitter)
        cloudGeo.vertices.forEach(pt => {
        pt.x += 2%Math.sin(Math.random()*2*Math.PI)*2;
        pt.y += 2%Math.sin(Math.random()*2*Math.PI)*2;
        pt.z += 2%Math.sin(Math.random()*2*Math.PI)*2;
        }); 

        clouds[i] = new THREE.Mesh(cloudGeo, cloudMaterial);
        clouds[i].position.set(500*Math.cos(angle+rand1), rand2*20 + 300 ,-500*Math.sin(angle+rand3))
        scene.add(clouds[i]);
    }

}

function initSky() { 
 //sun
 var circleGeometry = new THREE.CircleGeometry( 50, 32 );;
 var circleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(0x8200c9)
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
 circle = new THREE.Mesh( circleGeometry, circleMaterial );
 circle.position.z = -550;
 circle.position.y = 300;
 scene.add( circle );

 //fog
//  var fog = new THREE.Fog(0x77bfe );
//  scene.fog = fog;

}

function initScene() {
    renderer.setClearColor( 0x000000, 0 );
    initSky();
    initClouds();
    initWaveParticles();
    var dynamicGeometry = new THREE.IcosahedronBufferGeometry(50, 0);
    var dynamicMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shading: THREE.FlatShading
    } );
    dynamicShape = new THREE.Mesh(dynamicGeometry, dynamicMaterial);
    dynamicShape.position.set(0,10,-350)
    dynamicShape.lights = true;
    scene.add(dynamicShape)



    //blue light
    const light = new THREE.DirectionalLight( 0x11e8bb, .5 );
    light.position.set( 0, -10, 0 ).normalize();

    //pink light
    const sunLight = new THREE.DirectionalLight( 0x8200c9, 5); 
    sunLight.position.set( 0, 10, -10 ).normalize();
    scene.add(light)
  
    circle.add(sunLight);

    //ambient light
    scene.add(new THREE.AmbientLight( 0xffffff, .7));

    camera.position.z = 5;
}


function animate() {
    update();
    //deals with pitch (and bass)
    analyser.getByteFrequencyData(pitch_array);
    //deals with volume
    analyser.getByteTimeDomainData(volume_array);
    //update background 
    end = Date.now();
    timeDiff = start - end; 
    // plane.material.uniforms.u_time.value = timeDiff;

    dynamicShape.rotation.x += .01;
    dynamicShape.rotation.y += .01;
    //var speed;

    // for( var i = 0; i < bufferlen; i++){

    //     speed = pitch_array[i]
    //     cube.rotation.x += 0.0000005 * speed;
    //     if( speed > 180) {
    //     cube.rotation.y += 0.000001 * speed;
    //     cube.scale.x -= .0001;
    //     cube.scale.y -= .0001; 
    //     cube.scale.z -= .0001;
    //     }
    //     if (speed > 255) {
    //     cube.rotation.x += 0.000001 * speed;
    //     cube.scale.x += .0001;
    //     cube.scale.y += .0001; 
    //     cube.scale.z += .0001;
    //     }
    // }

}

