/* load each file */
// to do (clean up)
// add model base class
// each "model" initializes and references itself 

function loadObj(_this, objName, objFile, matFile = null) {

    console.log("loading " + objName + "...")
    // if matfile exists, load
    if( matFile ) { 
        // set resource path (for additional resources like textures)
        // mtlLoader.setResourcePath('./assets/' + objName + "/Textures");
        var mtlLoader = new THREE.MTLLoader(manager)
        mtlLoader.setMaterialOptions( { side: THREE.DoubleSide } );
        mtlLoader.load( matFile, 
            
        function ( materials ) {
            console.log("loading " + objName + " materials...", materials)

            materials.preload();
            var objLoader = new THREE.OBJLoader(manager)
            objLoader.setMaterials( materials );
            objLoader.load( objFile,

                function ( obj ) {
                    _this[objName] = obj;
                    _this[objName].castShadow = true;
                    _this[objName].receiveShadow = true;

                    console.log("loaded " + objName)
                },
            
                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

                },
                
                function ( error ) {

                    console.log( 'An error happened' );

                }
            );

        });
    }

    // otherwise just load obj with grey color 
    else { 
        objLoader.load(
            objFile,
    
            function ( obj ) {
                obj.traverse( function ( child ) {
                         if ( child instanceof THREE.Mesh ) {
                              child.material = new THREE.MeshStandardMaterial({
                                  color: 0xd3d3d3, 
                              })
                             
                             }
                         } );
                
                models[objName]= obj;
                models[objName].castShadow = true;
                models[objName].receiveShadow = true;
            },
            
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            
            function ( error ) {
                console.log( 'An error happened' );
            }
        );

    }
}

function getCar(_this) { 
    const objFiles = ["carBody","backLeftWheel", "backRightWheel", "frontLeftWheel", "frontRightWheel", "carHood"];

    var idx = 0;

    var mtlLoader = new THREE.MTLLoader(manager)
    
    objFiles.forEach( (objFile) => { 

        mtlLoader.load( './assets/models/car_model/' + objFile + '.mtl', 
            
            function ( materials ) {

                materials.preload();
                // load a car
                objLoader.setMaterials( materials );	
                objLoader.setPath( './assets/models/car_model/' );
                objLoader.load( objFile + '.obj',

                    function ( obj ) { 

                        idx++;
                        obj.rotation.y = Math.PI;
                        _this["car"].add(obj);
                        
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

function getCliff(_this) { 
    
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

    _this.cliff = new THREE.Mesh( geometry, material );
    _this.cliff.rotation.x = Math.PI/2;
    _this.cliff.position.y = -10
    _this.cliff.position.z = 60;
    _this.cliff.receiveShadow = true;
    
}


function getTextures(texture, name) { 
    getLogoTexture(texture);
}
/* cmmnd logo texture */ 
function getLogoTexture(_this) { 

    textureLoader.load('/../../assets/cmmnd_logo.png', function(cmmndTexture) { 
        cmmndTexture.wrapS = cmmndTexture.wrapT = THREE.RepeatWrapping;
        cmmndTexture.offset.set( 0, 0 );
        _this.logoTexture = cmmndTexture;
        // edit these when using textures on objects 
        // cmmndTexture.repeat.set( rpt, rpt );
        // obj.material = new THREE.MeshLambertMaterial({ 
        //     map: cmmndTexture, 
        //     color: 0xd0d5d2
        // });	
    });

}
