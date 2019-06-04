/* add car and other universal scene objects*/
var car;
var cliff;

/* instantiate loaders */ 
const objLoader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();
const mtlLoader = new THREE.MTLLoader();


/* load each file */

const objFiles = ["carBody","backLeftWheel", "backRightWheel", "frontLeftWheel", "frontRightWheel", "carHood"];

var idx = 0;

mtlLoader.setPath( './assets/models/car_model/' );

objFiles.forEach( (objFile) => { 

    mtlLoader.load( objFile + '.mtl', 
        
        function ( materials ) {

            materials.preload();
                // load a car
            objLoader.setMaterials( materials );	
            objLoader.setPath( './assets/models/car_model/' );
            objLoader.load( objFile + '.obj',

                function ( obj ) {

                    idx++;
                    obj.rotation.y = Math.PI;
                    setCar(obj );
                    
                },
            
                function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                },
                
                function ( error ) {

                    console.log( 'An error happened' );

                }
            );

        });

});


    function initPlatform() { 
        
        const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
        //randomly displace the x,y,z coords by the `per` value
        const jitter = (geo,per) => geo.vertices.forEach(v => {
            v.x += map(Math.random(),0,1,-per,per)
            v.y += map(Math.random(),0,1,-per,per)
            v.z += map(Math.random(),0,1,-per,per)
        })
        let geometry = new THREE.TorusGeometry( 10, 3, 8, 50 );
        let planeGeometry = new THREE.PlaneGeometry( 18, 18, 16, 16 );
        
        planeGeometry.rotateX(Math.PI);
        planeGeometry.translate(0,0,-2);
        geometry.merge(planeGeometry);
        jitter(geometry,0.2);
        let material = new THREE.MeshPhongMaterial( { 
            color: 0xEDC9AF,
            flatShading: true
        } );
        cliff = new THREE.Mesh( geometry, material );
        cliff.rotation.x = Math.PI/2;
        cliff.position.y = -10
        cliff.position.z = 60;
        cliff.receiveShadow = true;
        scene.add( cliff );
    }
    initPlatform();