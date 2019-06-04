// 80s shit scene
var twinPeaksScene = new THREE.Scene();

function Building(width, height, depth, x, y, z) {
  const geom = new THREE.BoxGeometry(width, height, depth);
  const mat = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);
  this.mesh = mesh;
}

function initTwinPeaksScene() {
  car.children[0].material = new THREE.MeshStandardMaterial({
    emissive: 0x888888,
    color: 0xf4cff3,
    roughness: 0.5,
    metalness: 1
  });
  twinPeaksScene.add(cliff);

  const sunLight = new THREE.DirectionalLight(0xe1edf0, 0.2);
  sunLight.castShadow = true;
  sunLight.position.set(10, 10, 0);
  const sunLight2 = new THREE.DirectionalLight(0xe1edf0, 0.2);
  sunLight2.castShadow = true;
  sunLight2.position.set(-10, 10, 0);
  twinPeaksScene.add(sunLight);
  twinPeaksScene.add(sunLight2);

  const numBuildings = 20;
  buildings = [];
  for (let i = 0; i < 20; i++) {
    const b = new Building(
      5,
      Math.random() * 10 + 20,
      5,
      (2 * Math.random() - 1) * 50,
      0,
      30 + (2 * Math.random() - 1) * 5
    );
    buildings.push(b);
    twinPeaksScene.add(b.mesh);
  }
  camera.position.z = 85;
}

function animateTwinPeaks() {}
