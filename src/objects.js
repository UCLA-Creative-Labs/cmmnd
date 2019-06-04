/* add car and other universal scene objects*/
var car;
var cliff;

/* load each file */
function getCar() { 
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

}



function getPlatform() { 
    
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

function getLogo() { 
    var dynamicGeometry = new THREE.IcosahedronBufferGeometry(20, 0);

    textureLoader.load('../../assets/cmmnd_logo.png', function(cmmndTexture) { 
        console.log('mat loaded');
        cmmndTexture.wrapS = cmmndTexture.wrapT = THREE.RepeatWrapping;
        cmmndTexture.offset.set( 0, 0 );
        cmmndTexture.repeat.set( 3, 3 );
        polygon.material = new THREE.MeshLambertMaterial({ 
        map: cmmndTexture, 
        color: 0xd0d5d2
        });	
        });
    
    polygon = new THREE.Mesh(dynamicGeometry);
    polygon.position.set(0,10,-80)
    polygon.lights = true;
    return polygon;
}