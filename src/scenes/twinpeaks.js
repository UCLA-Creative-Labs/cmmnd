// 80s shit scene
var PixelShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: null },
    pixelSize: { value: 1 }
  },
  vertexShader: [
    "varying highp vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
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
  ].join("\n")
};

class TwinPeaksScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.postprocessing = false;
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 85;
  }

  setCar(obj) {
    // set position of passed in car object from common objects
    obj.position.z = 60;
    obj.position.y = -5;
    obj.rotateY((7 * Math.PI) / 6);

    // obj.children[4].children[0].material = new THREE.MeshStandardMaterial({
    //   //   emissive: 0xb20a02,
    //   emissive: 0x810803,
    //   color: 0xf4487a,
    //   roughness: 0.5,
    //   metalness: 1
    // });

    // obj.children[1].children[0].material = new THREE.MeshStandardMaterial({
    //   //   emissive: 0xb20a02,
    //   emissive: 0xaaaaaa,
    //   color: 0xffffff,
    //   roughness: 0.5,
    //   metalness: 1
    // });

    console.log(obj);

    return obj;
  }

  initScene() {
    this.scene.add(this.setCar(car));
    // this.scene.add(getPlatform());
    this.scene.add(cliff);
    this.car = car;
    this.cliff = cliff;

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

    const fogColor = new THREE.Color(0x19022d);
    this.scene.background = fogColor;
    // this.scene.fog = new THREE.FogExp2(fogColor, 0.01);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(500),
      new THREE.MeshStandardMaterial({
        emissive: 0x59412a
      })
    );
    globe.position.set(0, -525, -50);
    this.scene.add(globe);

    // this.composer = new THREE.EffectComposer(renderer);
    // this.composer.addPass(new THREE.RenderPass(this.scene, camera));
    // const pixelPass = new THREE.ShaderPass(PixelShader);
    // pixelPass.uniforms.resolution.value = new THREE.Vector2(
    //   window.innerWidth,
    //   window.innerHeight
    // );
    // pixelPass.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
    // pixelPass.renderToScreen = true;
    // this.composer.addPass(pixelPass);
    // this.postprocessing = true;

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
      this.pivots[i].rotation.y += 0.001 * this.pivots[i].speed + (pitch_array[1] * 0.00001)
    }

    for (var i = 0; i < this.clouds.length; i++) {
      this.clouds[i].update();
    }

    this.car.rotation.y += 0.001;
    this.cliff.rotation.z -= 0.001;

    let norm = pitch_array[1]/1000 + 1
    this.city.scale.set(1, norm, 1)
    this.city.position.y = (60*norm)/2 - 28

  }

  animate() {
    const pitch_array = audio.getFreqData();
    this.update(pitch_array);
    // calls update
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
