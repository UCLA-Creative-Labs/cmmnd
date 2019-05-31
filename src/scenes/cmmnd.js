// intro scene, car spinning on platform
// spotlight
// command logo spinning on top
/* 
    make scene change colors
    get gif to work 
*/  

var platform, logo;
var carPart;
var car = new THREE.Group();
// call each time a new scene is rendered
function setCar(obj) { 

    obj.position.z = 0;  
    obj.position.y = 4.6;
    obj.rotateY(Math.PI);

    carPart = obj;
    carPart.castShadow = true;
    carPart.receiveShadow = true;
    car.add(carPart);
    platform.add( car );

    //  // headlights 
    //  var headlight = new THREE.PointLight( 0xff0000, .2, 5)
    //  headlight.position.set(3, 2, 8);
    //  var sphereSize = 1;
    //  var pointLightHelper = new THREE.PointLightHelper( headlight, sphereSize );
    //  car.add( pointLightHelper );
    //  car.add( headlight );

}

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

    platform = new THREE.Mesh(stepGeo, stepMaterial);
    platform.position.y = -5;
    platform.castShadow = true;
    platform.receiveShadow = true;

    console.log(platform.children)
    
    //remove cliff
    scene.remove( cliff );
    scene.add( platform );

    getLogo();
            
}


function getLogo() { 

    objLoader.setPath( './assets/' );

    objLoader.load(
        'archCmmndLogo.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0xd3d3d3, 
                          })
                         
                         }
                     } );
                    
            obj.scale.set( .1, .1, .1 ) 
            obj.position.y = 12;
            obj.position.x = -5;
            
            logo = obj;
            logo.castShadow = true;
            logo.receiveShadow = true;
            
            scene.add(logo);

        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
}

// initalize scene objects and scene attributes (background color, camera position, etc.)
function initScene() { 

    scene.background = new THREE.Color(0x000000);
    getPlatform();


    // ambient light
    scene.add(new THREE.AmbientLight( 0xffffff, .2));

    // directional light blue
    var logoLight = new THREE.PointLight( 0x0000ff, .5 );
    logoLight.castShadow = true;
    logoLight.position.z = 0;
    scene.add(logoLight)
    
    // underlight blue 
    var underlight = new THREE.PointLight( 0xff0000, 1, 100 );
    underlight.position.set( 0, -2, 0 );
    platform.add(underlight);
    

    // spotlights red
    var spotlight = new THREE.DirectionalLight( 0xc30000, 1 );

    spotlight.position.y = 2;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // spotlight 

    var redlight = new THREE.DirectionalLight( 0x0000ff, .5);
    redlight.castShadow = true;
    redlight.position.y = 10;
    redlight.position.z = 10;
    platform.add(redlight);

    // var light = new THREE.DirectionalLight( 0xffffff, .5 );
    // light.position.y = -10;
    // redlight.position.z = 10;
    // platform.add(light);

    // camera
    camera.position.z = 25;
    camera.position.y = 3;

}



// update scene dynamically according to music
// also calls update functions of common objects
function update() { 

}


// animate scene based on time
// callse update
function animate() { 
    update();

    var date = new Date;

    scene.rotation.y += .005;
    logo.position.y += .01*Math.sin( date.getSeconds()); 
    // logo.rotation.y += .01;

}
