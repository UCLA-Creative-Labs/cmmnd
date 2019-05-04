var cube, cylinder;

function initScene() {
    /* main cube */ 
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial(  );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    var geometry1 = new THREE.CylinderGeometry(1,1, 2, 6);
    var material1 = new THREE.MeshBasicMaterial( { color: 0x404040 } );
    cylinder = new THREE.Mesh( geometry1, material1 );
    scene.add( cylinder );

    cylinder.position.y = -2;

    var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);
    //deals with pitch (and bass)
    analyser.getByteFrequencyData(pitch_array);
    //deals with volume
    analyser.getByteTimeDomainData(volume_array);

    var speed;
    for( var i = 0; i < bufferlen; i++){ 
        speed = pitch_array[i]
        cube.rotation.x += 0.0000005 * speed;
        if( speed > 180) {
        cube.rotation.y += 0.000001 * speed;
        cube.scale.x -= .0001;
        cube.scale.y -= .0001; 
        cube.scale.z -= .0001;
        }
        if (speed > 255) {
        cube.rotation.x += 0.000001 * speed;
        cube.scale.x += .0001;
        cube.scale.y += .0001; 
        cube.scale.z += .0001;
        }
    }

    controls.update();
    
    renderer.render( scene, camera );
};
