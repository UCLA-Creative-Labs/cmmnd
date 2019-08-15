/* load each file */
// to do (clean up)
// add model base class
// each "model" initializes and references itself 



// accepts one obj and one mtl file
// objFile, matFile is string of path
function loadObj(objName, objFile, matFile = null) {
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
            console.log(objLoader)
            objLoader.load( objFile,

                function ( obj ) {
                    models[objName] = obj;
                    models[objName].castShadow = true;
                    models[objName].receiveShadow = true;

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
// offset on materials array
// only use materials for offset array of objects 
// default 0 
// function loadModels(objName, objFiles, matFiles = null, offset = 0) { 

//     // if array of objFiles parse through 
//         // if there is an array of materials 
//         // else there is one material
//     if( Array.isArray(objFiles) ) { 
//         if( Array.isArray(matFiles) ) { 

//             objFiles.forEach((objFile,index) => { 
//                 if( index >= offset )
//                     loadObj(objName, objFile, matFiles[index+offset]) 
//                 else 
//                     loadObj(objName, objFile)
//             })
            
//         }
        
//         // matFiles is one path or null 
//         else { 
//             objFiles.forEach((objFile) => { 
//                 loadObj(objName, objFile, matFiles) 
//             })
          
//         }
//     }


//     // one obj one mat file
//     else { 
//         loadObj(objName, objFiles, matFiles)
//     }

// }

function getCar() { 
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
                        car.add(obj);
                        
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

function getStereo() { 
    
    objLoader.load(
        './assets/models/radioObject.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0x555555, 
                              metalness: .2,
                              emissive: 0x000000,
                              emissiveIntensity: .2
                          });
                         
                         }
                     } );
                    
            obj.scale.set( .1, .1, .1 );

            stereo = obj;
            

        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

function getGrass() { 

    objLoader.load(
        './assets/models/obj_Dandelion/Dandelion.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0xd3d3d3, 
                          })
                         
                         }
                     } );
                    
            obj.scale.set( .01, .01, .01 );

            grass = obj;
            

        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

function getArchLogo() { 

    objLoader.load(
        './assets/archCmmndLogo.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0xd3d3d3, 
                          })
                         
                         }
                     } );
                    
            obj.scale.set( .1, .1, .1 ) 
            archLogo = obj;
            archLogo.castShadow = true;
            archLogo.receiveShadow = true;


        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
}

function getCliff() { 
    
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
    
    return cliff;
    
}

function getPolygonLogo() { 

    var dynamicGeometry = new THREE.IcosahedronBufferGeometry(20, 0);
    polygon = new THREE.Mesh(dynamicGeometry);
    polygon.position.set(0,10,-80);
    polygon.lights = true;
    getLogoTexture(polygon, 3);
    return polygon;

}

/* cmmnd logo texture */ 
function getLogoTexture(obj, rpt) { 

    textureLoader.load('../../assets/cmmnd_logo.png', function(cmmndTexture) { 
        console.log('mat loaded');
        cmmndTexture.wrapS = cmmndTexture.wrapT = THREE.RepeatWrapping;
        cmmndTexture.offset.set( 0, 0 );
        cmmndTexture.repeat.set( rpt, rpt );
        obj.material = new THREE.MeshLambertMaterial({ 
            map: cmmndTexture, 
            color: 0xd0d5d2
        });	
        });

}


function getTower() { 

    objLoader.load(
        './assets/models/sutroTower.obj',

        function ( obj ) {
        
            obj.traverse( function ( child ) {
                     if ( child instanceof THREE.Mesh ) {
                          child.material = new THREE.MeshStandardMaterial({
                              color: 0xC80815, 
                          })
                         
                         }
                     } );
                    
            obj.scale.set( .3, .3, .3 ); 
        
            tower = obj;
            tower.castShadow = true;
            tower.receiveShadow = true;


        },
        
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
    
}