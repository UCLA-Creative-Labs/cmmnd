// add transparent sun spot 
// add transparent particles
// volumetric lighting
// make clouds morph 


function getCloudSphere(){ 
    let cloud_size = 150;
    let cloud_num = 15; 
    let step_num = 60; 
    let step_size = 2*Math.PI/step_num;
    let offsetY = -1 * cloud_size;
    let materials = [];

    //create clouds geometry (merge for optimization)
    let clouds = new THREE.Geometry();

    let geometry = new THREE.SphereGeometry(cloud_size - 10, 15, 15);

    // sphere material
    materials.push(new THREE.MeshBasicMaterial({ 
        color: 0xD9E9FF, 
        shininess: 5, 
        opacity: .8
    }));

    // cloud material
    materials.push( new THREE.MeshPhongMaterial({ 
        color: 0xD9E9FF,
        opacity: .5
    }));    

    let sphere = new THREE.Mesh( geometry );
    //sphere.position.set(0, offsetY, 0);

    clouds.merge(sphere.geometry, sphere.matrix, 0)


    // clouds.add( sphere );


    // create rings of clouds using theta
    for (let j = 0; j < step_num; j++){

        let radius = cloud_size * Math.sin( step_size*j );
        let height = cloud_size * Math.cos( step_size*j );
       
        let norm = Math.abs(radius/cloud_size);
        let draw_num = Math.floor(cloud_num*norm);
        // console.log(draw_num);

        // generate ring of clouds
        for (let i = 0; i < draw_num; i++){
        
            let side = 1;
            let rand1 = Math.random();
            let rand2 = Math.random();
            let rand3 = Math.random();

            let offsetX = 10*rand1 - 5;
            let offsetZ = 4*rand2 - 2;

            //angle (position)
            let angle = i * 2 * (Math.PI) / (draw_num + 1);
        
            if( i%2 ) { 
                side = -1
            }

            let cloudGeo = getCloud(side, rand1, rand2, rand3);
            let cloud = new THREE.Mesh(cloudGeo);

            //set scale according to normal
            cloud.scale.set(3,3,3)
            cloud.position.set(radius*Math.cos(angle) + offsetX, height, radius*Math.sin(angle) + offsetZ)
            cloud.lookAt(sphere.position);

            cloud.lights = true;

            // console.log(cloud.geometry)
            clouds.merge(cloud.geometry, cloud.matrix, 1);
            
            }
    }

    let world = new THREE.Mesh(clouds, materials);
    world.position.y = offsetY;

    return world;

    //create clouds 

    
}



function getSkyBox() { 
    let geometry = new THREE.SphereGeometry(500, 500, 500)

    // gradient 
    let material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
        color1: {
            value: new THREE.Color(0xFFA800)
        },
        color2: {
            value: new THREE.Color(0xFF5D41)
        },
        color3: { 
            value: new THREE.Color(0x665E8B)
        },
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
        uniform vec3 color3;
        
        varying vec2 vUv;
        
        void main() {
            vec3 gradient = mix(mix(color1, color2, vUv.y), color3, vUv.y);
            
            gl_FragColor = vec4(gradient, 1.0);
        }
        `
    });

    let sky = new THREE.Mesh(geometry, material);

    return sky;



    // sunset sky box (use a gradient)
            // side: THREE.BackSide
}   


class SkyScene { 

	constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.backgroundColor = new THREE.Color( 0xdbddf2 );
        this.fog = new THREE.Fog(this.backgroundColor, 1, 1000);
        this.clouds = getCloudSphere(); // rotate around x axis of world
        this.sun = getSun(25);
        this.particleSystem = getParticles();
        this.sky = getSkyBox();
        this.throttle = 0;
        this.morph_amt = 0;
   
	}
    
    setCar() { 
        car.position.set(0,18,5);
        car.scale.set(1.5,1.5,1.5)
        //car.rotateX(-Math.PI/12)
    }

    setObjects() { 
        this.setCar();
		// set position of passed in objects from common objects
    }

    setScene() { 
			
    }
	
	initScene() { 

        this.scene.background = this.backgroundColor;
        this.scene.fog = this.fog;
        this.scene.add(this.clouds);
        this.scene.add(this.sun);
        this.scene.add(this.sky)
        this.sun.position.set(0, 130, -400)
        this.scene.add(car);
        this.scene.add(this.particleSystem);

        this.setObjects();
        this.camera.position.set(-20,30,50);
        this.camera.lookAt(car.position);
        this.scene.add(new THREE.AmbientLight( 0xffffff, .5 ));
        
        
        var directionalLight = new THREE.DirectionalLight( 0xfa8070, 0.5 );
        directionalLight.target = car;
        this.sun.add(directionalLight);

        // var current = {amt: this.morph_amt};
        // var target = {amt: this.morph_amt ^ 1}; //opposite of morph_amt
        // console.log(current,target);
        // var tween = new TWEEN.Tween(current).to(target, 1000);
        // tween.easing(TWEEN.Easing.Elastic.Out);
        // tween.onUpdate(function(){ 
        //     console.log(current.amt, "value");
        //     //morphinfluence of each cloud
        //     for ( let c of this.clouds )
        //      for ( let i of c.morphTargetInfluences )
        //         i = current.amt; // changes influence to value interpolated
        // })

        // tween.start();
        
		// initialize scene objects using common object or helper functions
        // add objects to this.scene
        
        
	}

	update(pitch_array, volume_array) {
        this.clouds.rotation.x -= .002;
        car.rotation.z = .05*Math.sin(this.throttle) + Math.PI
        car.rotation.x = .05*Math.sin(this.throttle) + Math.PI
        this.throttle += .01;
		// update objects within the scene
	}

	animate() {

        const pitch_array = audio.getFreqData();
        const volume_array = audio.getVolumeData();
		this.update( pitch_array,volume_array );
        // calls update
        
        // interpolates values
        TWEEN.update();
    }

}