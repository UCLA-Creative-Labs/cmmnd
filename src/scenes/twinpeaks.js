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

    obj.children[1].children[0].material = new THREE.MeshStandardMaterial({
      emissive: 0x111111,
      color: 0xf4cff3,
      roughness: 0.5,
      metalness: 1
    });

    obj.children[0].children[0].material = new THREE.MeshStandardMaterial({
      //   emissive: 0xb20a02,
      emissive: 0x810803,
      color: 0xf4487a,
      roughness: 0.5,
      metalness: 1
    });

    console.log(obj);

    return obj;
  }

  initScene() {
    this.scene.add(this.setCar(car));
    this.scene.add(getPlatform());
    // this.scene.add(cliff);

    const sunLight = new THREE.DirectionalLight(0xe1edf0, 0.2);
    sunLight.castShadow = true;
    sunLight.position.set(10, 10, 0);
    const sunLight2 = new THREE.DirectionalLight(0xe1edf0, 0.2);
    sunLight2.castShadow = true;
    sunLight2.position.set(-10, 10, 0);
    this.scene.add(sunLight);
    this.scene.add(sunLight2);
    const fogColor = new THREE.Color(0xf1efff);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.FogExp2(fogColor, 0.01);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(500),
      new THREE.MeshStandardMaterial({
        emissive: 0x996632
      })
    );
    globe.position.set(0, -500, -50);
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

    const city = new THREEx.ProceduralCity();
    this.scene.add(city);
    this.camera.position.z = 85;
  }

  update(pitch_array) {
    // update objects within the scene
  }

  animate() {
    const pitch_array = audio.getFreqData();
    this.update(pitch_array);
    // calls update
  }
}

function animateTwinPeaks() {}
