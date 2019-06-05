// intro scene, car spinning on platform
// spotlight
// command logo spinning on top

function getPlatform() { 

    var stepGeo = new THREE.Geometry();
    var stepMaterial = new THREE.MeshStandardMaterial( {color:0xC0C0C0 });


    var normalMap = textureLoader.load( '../../assets/textures/Metal_Hammered_001_SD/Metal_Hammered_001_normal.jpg' );
    var metallicMap = textureLoader.load('../../assets/textures/Metal_Hammered_001_SD/Metal_Hammered_001_metallic.jpg');
    var aoMap = textureLoader.load('../../assets/textures/Metal_Hammered_001_SD/Metal_Hammered_001_ambientOcclusion.jpg');
    

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

    let platform = new THREE.Mesh(stepGeo, stepMaterial);
    platform.position.y = -5;
    platform.castShadow = true;
    platform.receiveShadow = true;
    
    return platform;

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
        this.platform = getPlatform(); //car platform 
        this.mirrors = getMirrors(); //array of mirrors to draw
        // this.logo = getArchLogo();

        // postprocessing of scene
        this.composer = new THREE.EffectComposer( renderer );
        this.renderPass = new THREE.RenderPass( this.scene, this.camera );
        this.composer.addPass( this.renderPass );
        this.badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
        this.composer.addPass( this.badTVPass );
        this.badTVPass.renderToScreen = true;

        console.log(this.composer)
        console.log(this.badTVPass.renderToScreen)

    }

    setCar() { 
        console.log("set car")
        car.position.set(0, 4.6, 0)
        
        car.rotateY(Math.PI);

        car.castShadow = true;
        car.receiveShadow = true;
        // set position of passed in car object from common objects
    }
    
    setLogo() { 
        archLogo.position.set(-5,17,0);
    }	

    setObjects() { 
        this.setCar();
        this.setLogo();
    }

	initScene() { 
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

        this.setObjects();

        this.scene.add(this.platform);
        this.platform.add(car);
        this.platform.add(archLogo);


        // lights 
        var redlight = new THREE.DirectionalLight( 0x0000ff, .5);
        redlight.castShadow = true;
        redlight.position.y = 10;
        redlight.position.z = 10;
        this.platform.add(redlight);

        var spotlight = new THREE.DirectionalLight( 0xc30000, .8 );
        spotlight.position.y = 2;
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
	}

	update() {
        var date = new Date;
        // update objects within the scene
        this.scene.rotation.y += .005;
        archLogo.position.y += .01*Math.sin( date.getSeconds());  // change to clock
	}

	animate() {

        this.update();

    }

}