// intro scene, car spinning on platform
// spotlight
// command logo spinning on top

function getPlatform(_this) { 

    var stepGeo = new THREE.Geometry();
    var stepMaterial = new THREE.MeshStandardMaterial( {color:0xC0C0C0 });


    var normalMap = textureLoader.load( './assets/textures/Metal_Hammered_001_SD/Metal_Hammered_001_normal.jpg' );
    var metallicMap = textureLoader.load('./assets/textures/Metal_Hammered_001_SD/Metal_Hammered_001_metallic.jpg');
    

    stepMaterial.normalMap = normalMap;
    stepMaterial.metalnessMap = metallicMap;

    for (let s = 0; s<6; s++) {
         
        let norm = s * .1;
        let scale = 1 - (norm*.5);
        let newGeo = new THREE.CylinderGeometry( 12, 12, .2, 32 );

        //merge geometry 
        newGeo.translate(0, 4*norm, 0);
        newGeo.scale(scale, 1, scale); // scale circle smaller
        stepGeo.merge(newGeo);

    }

    _this.platform = new THREE.Mesh(stepGeo, stepMaterial);
    _this.platform.position.y = -5;
    _this.platform.castShadow = true;
    _this.platform.receiveShadow = true;
    
    

}

function getMirrors() { 

    let mirrors = [];
    let step = 9 / Math.PI*2 ;
    
    let geometry = new THREE.BoxGeometry( 8, 15, .5 );

    let material = new THREE.MeshPhysicalMaterial({ 
        reflectivity: 1
    })


    for( let i= 0; i < 11 ; i++ )  { 

        let geometry = new THREE.BoxGeometry( 8, 15, .5 );

        let material = new THREE.MeshPhysicalMaterial({ 
            reflectivity: 1
        })
        
        mirrors.push( new THREE.Mesh(geometry, material) );
        mirrors[i].position.set(50*Math.sin(step*i),0, 50*Math.cos(step*i))
        mirrors[i].lookAt(0,0,0);

    }

    return mirrors;

}

/* cmmnd scene definition */
class CMMNDScene { 
	constructor() { 
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.zoomSpeed = .5;
        this.controls.enablePan = true;

        this.platform = models.platform.clone(); //car platform 
        this.mirrors = getMirrors(); //array of mirrors to draw
        // this.logo = getArchLogo();

        // postprocessing of scene 
        this.composer = new THREE.EffectComposer( renderer );
        this.renderPass = new THREE.RenderPass( this.scene, this.camera ); // new render 
        this.badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
        this.composer.addPass( this.renderPass );
        this.badTVPass.renderToScreen = true;
        this.composer.addPass( this.badTVPass );
        this.RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader );
        this.RGBShiftPass.renderToScreen = true;
        this.composer.addPass( this.RGBShiftPass );
        this.shaderTime = 0;

        this.time = 0;
        this.postprocessing = true;

        this.badTVParams = {
            mute:true,
            show: true,
            distortion: .8,
            distortion2: .8,
            speed: .1
        };
    }

    setCar() { 
        this.car.position.set(0, 4.6, 0);
        this.car.rotation.set(0, Math.PI, 0);
        this.car.scale.set( 1, 1, 1 );
  
  
        this.car.castShadow = true;
        this.car.receiveShadow = true;
        this.platform.add(this.car);
        // set position of passed in car object from common objects
    }
    
    setLogo() { 
        this.archLogo.position.set(-5,17,0);
        this.archLogo.updateMatrix();
        this.platform.add(this.archLogo);

    }	

    setObjects() { 
        this.setCar();
        this.setLogo();
    }

    setScene() { 
			
    }

	initScene() { 
        renderer.autoClear = false;

        /* shadow map renderer */ 
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = this.camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.7;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;

        this.scene.background =  new THREE.Color( 0x000000 );
        // move camera
        this.camera.position.z = 25;
        this.camera.position.y = 3;
        
        for (let mirror of this.mirrors) { 
            this.scene.add(mirror);
        }
       

        this.scene.add(this.platform);
        this.car = models.car.clone(); 
        this.archLogo = models.archLogo.clone();
        this.archLogo.scale.set(.1,.1,.1);
        this.setObjects();


        // lights 
        var redlight = new THREE.DirectionalLight( 0x0000ff, .5);
        redlight.castShadow = true;
        redlight.position.y = 10;
        redlight.position.z = 10;
        this.platform.add(redlight);

        var spotlight = new THREE.SpotLight( 0xc30000 );
        spotlight.position.y = 12;
        spotlight.penumbra = .6;
        spotlight.castShadow = true;
        this.scene.add(spotlight);

        var underlight = new THREE.PointLight( 0xff0000, .8, 100 );
        underlight.position.set( 0, -2, 0 );
        this.platform.add(underlight);

         // directional light blue
        var logoLight = new THREE.PointLight( 0x0000ff, .5 );
        logoLight.castShadow = true;
        logoLight.position.z = 0;
        this.scene.add(logoLight);

        // ambient light
        this.scene.add(new THREE.AmbientLight( 0xffffff, .2)); 
        
        // postprocessing params
        let badTVParams = this.badTVParams;

        this.badTVPass.uniforms[ 'distortion' ].value = badTVParams.distortion;
        this.badTVPass.uniforms[ 'distortion2' ].value = badTVParams.distortion2;
        this.badTVPass.uniforms[ 'speed' ].value = badTVParams.speed;
        this.badTVPass.uniforms[ 'rollSpeed' ].value = badTVParams.rollSpeed;
	}

	update() {
        this.scene.rotation.y += .005;
        this.archLogo.position.y += .01*Math.sin( clock.getDelta());  // change to clock
	}

	animate() {
        
        this.shaderTime += 0.1;
        this.badTVPass.uniforms[ 'time' ].value =  this.shaderTime;
        this.update();

    }

}