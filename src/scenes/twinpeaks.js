// 80s shit scene
// to do : 
// add twinkling stars
// add glitching moon


// tDiffuse is texture from prev shader
var PixelShader = {
  uniforms: {
      "tDiffuse": { value: null },
      "resolution": { value: null },
      "pixelSize": { value: 1. },
  },
  vertexShader: [
      "varying highp vec2 vUv;",
      "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
  ].join( "\n" ),
  fragmentShader: [
      "uniform sampler2D tDiffuse;",
      "uniform float pixelSize;",
      "uniform vec2 resolution;",
      "varying highp vec2 vUv;",
      "void main(){",
      "vec2 dxy = pixelSize / resolution;",
      "vec2 coord = dxy * floor( vUv / dxy );",
      "gl_FragColor = texture2D(tDiffuse, coord);",
      "}"
  ].join( "\n" )
};

class TwinPeaksScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 85;

    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.zoomSpeed = .5;
    this.controls.enablePan = true;

    this.cliff = cliff;
    this.fogColor = new THREE.Color(0x19022d);

    // postprocessing effects
    this.composer = new THREE.EffectComposer( renderer );
    this.renderPass = new THREE.RenderPass( this.scene, this.camera ); // new render 
    this.FilmPass = new THREE.FilmPass(  
        0.35,   // noise intensity
        0.1,  // scanline intensity
        648,    // scanline count
        false,  // grayscale 
    );
    this.RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.RGBShiftPass.renderToScreen = true;
    this.composer.addPass( this.renderPass );
    this.FilmPass.renderToScreen = true;
    this.composer.addPass( this.RGBShiftPass );
    this.composer.addPass( this.FilmPass );
    this.postprocessing = true;


  }

  setCar() {
    // set position of passed in car object from common objects
    car.position.set(0,0,0)
    car.rotation.set(0,0,0)
    car.scale.set( 1, 1, 1 );
    car.updateMatrix(); // updates local matrix 
    car.position.set( 0, 0, -5 );
    car.rotation.set( -Math.PI/2, 7*Math.PI/6, 0 );
    cliff.add(car); // re-add car to this scene
    
  }

  setTower() { 
    tower.position.set(50,-35,-10)
  }

  setObjects() { 
    this.setCar()
    this.setTower()
  }
  
  setScene() { 
    this.scene.background = this.fogColor;
    this.controls.update()
  }

  initScene() {
    // this.scene.add(getPlatform());
    this.scene.add(cliff);
    this.setScene()

    this.setObjects()

    const sunLight = new THREE.DirectionalLight(0xe1edf0, 0.2);
    sunLight.castShadow = true;
    sunLight.position.set(10, 10, 0);
    const sunLight2 = new THREE.DirectionalLight(0x161e4f, 0.2);
    sunLight2.castShadow = true;
    sunLight2.position.set(-150, 75, 150);
    // this.scene.add(sunLight);
    this.scene.add(sunLight2);

    var hemisphereLight = new THREE.HemisphereLight(0x161e4f, 0x000000, 0.6);

    var shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);

    shadowLight.position.set(150, 75, 150);

    this.scene.add(hemisphereLight);
    this.scene.add(shadowLight);

    this.scene.add(tower);
    // this.scene.fog = new THREE.FogExp2(fogColor, 0.01);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(500),
      new THREE.MeshStandardMaterial({
        emissive: 0x59412a
      })
    );
    globe.position.set(0, -525, -50);
    this.scene.add(globe);

    // Add city
    const city = new THREEx.ProceduralCity();
    this.scene.add(city);
    this.city = city;

    // Add stars
    var starQty = 4500;
    let geometry = new THREE.SphereGeometry(1000, 100, 50);

    let materialOptions = {
      size: 2.0,
      //   color: new THREE.Color(0x6721b7),
      transparency: true,
      opacity: 0.7
    };

    let starStuff = new THREE.PointCloudMaterial(materialOptions);

    for (var i = 0; i < starQty; i++) {
      let starVertex = new THREE.Vector3();
      starVertex.x = Math.random() * 2000 - 1000;
      starVertex.y = Math.random() * 2000 - 1000;
      starVertex.z = Math.random() * 2000 - 1000;

      geometry.vertices.push(starVertex);
    }

    let stars = new THREE.PointCloud(geometry, starStuff);
    this.scene.add(stars);

    // Create clouds
    var numPivots = 3;
    var numClouds = 7 + Math.floor(Math.random() * 7);
    const WORLD_RADIUS = 125;
    this.pivots = [];
    this.clouds = [];
    for (var i = 0; i < numPivots; i++) {
      this.pivots[i] = new THREE.Object3D();
      this.pivots[i].speed = 1 + Math.random() * 2;
    }

    for (var i = 0; i < numClouds; i++) {
      var index = Math.floor(Math.random() * numPivots);

      var angle = Math.random() * Math.PI * 2;
      var x = WORLD_RADIUS * Math.cos(angle),
        y = Math.random() * 50 + 20,
        z = WORLD_RADIUS * Math.sin(angle);
      var cloud = CreateCloud(this.pivots[index], x, y, z);

      this.clouds.push(cloud);
      this.scene.add(cloud.mesh);
    }

    this.camera.position.z = 85;
  }

  update(pitch_array) {
    // update objects within the scene
    for (var i = 0; i < this.pivots.length; i++) {
      this.pivots[i].rotation.y += 0.001 * this.pivots[i].speed;
    }

    for (var i = 0; i < this.clouds.length; i++) {
      this.clouds[i].update();
    }

    // this.car.rotation.y += 0.001;
    this.cliff.rotation.z -= 0.001;
  }

  animate() {
    const pitch_array = audio.getFreqData();
    this.update(pitch_array);
  }
}

var CreateCloud = function(pivot, x, y, z) {
  var mesh = new THREE.Object3D();

  var mat = new THREE.MeshPhongMaterial({
    color: 0x3f3772,
    emissive: 0xcbd9ef,
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true
  });

  var nBlocs = 3 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nBlocs; i++) {
    var geom =
      Math.random() > 0.7
        ? new THREE.SphereGeometry(20, 6, 6)
        : new THREE.BoxGeometry(20, 20, 20);

    var m = new THREE.Mesh(geom, mat);

    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    var s = 0.1 + Math.random() * 0.9;
    m.scale.set(s, s, s);

    m.castShadow = true;
    m.receiveShadow = false;

    mesh.add(m);
  }

  mesh.position.set(x, y, z);

  pivot.add(mesh);

  var speed = Math.random() * 0.8 + 0.8;
  function update() {
    mesh.rotation.x += speed * 0.0015;
  }

  return {
    mesh: pivot,
    update: update
  };
};
