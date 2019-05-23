var Globe = function (radius, segments) {

  THREE.Object3D.call(this);

  this.name = "Globe";

  var that = this;

  // instantiate a loader
  var loader = new THREE.TextureLoader();

  // earth textures
  var textures = {
    'map': {
      url: 'assets/images/earthmap1k.jpg',
      val: undefined
    },
    'bumpMap': {
      url: 'assets/images/earthbump1k.jpg',
      val: undefined
    },
    'specularMap': {
      url: 'assets/images/earthspec1k.jpg',
      val: undefined
    }
  };

  var texturePromises = [], path = './';

  for (var key in textures) {
    texturePromises.push(new Promise((resolve, reject) => {
      var entry = textures[key]
      var url = path + entry.url
      loader.load(url,
        texture => {
          entry.val = texture;
          if (entry.val instanceof THREE.Texture) resolve(entry);
        },
        xhr => {
          console.log(url + ' ' + (xhr.loaded / xhr.total * 100) +
            '% loaded');
        },
        xhr => {
          reject(new Error(xhr +
            'An error occurred loading while loading: ' +
            entry.url));
        }
      );
    }));
  }

  // load the geometry and the textures
  Promise.all(texturePromises).then(loadedTextures => {
    var geometry = new THREE.SphereGeometry(radius, segments, segments);
    var material = new THREE.MeshPhongMaterial({
      map: textures.map.val,
      bumpMap: textures.bumpMap.val,
      bumpScale: 0.005,
      specularMap: textures.specularMap.val,
      specular: new THREE.Color('grey')
    });

    var earth = that.earth = new THREE.Mesh(geometry, material);
    that.add(earth);
  });

  // clouds
  loader.load('./assets/images/earthcloudmap.jpg', map => {
    var geometry = new THREE.SphereGeometry(radius + .05, segments, segments);
    var material = new THREE.MeshPhongMaterial({
      map: map,
      transparent: true
    });

    var clouds = that.clouds = new THREE.Mesh(geometry, material);
    that.add(clouds);
  });
}

Globe.prototype = Object.create(THREE.Object3D.prototype);
Globe.prototype.constructor = Globe;

var scene = new THREE.Scene();
var ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
  0.1, 10000);

camera.position.z = -50;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

var canvas = renderer.domElement;
canvas.style.display = "block";

document.body.appendChild(canvas);

// Enable controls
//var controls = new THREE.TrackballControls(camera);

//Add lighting
scene.add(new THREE.AmbientLight(0x333333));

var light = new THREE.DirectionalLight(0xe4eef9, .7);
light.position.set(12, 12, 8);
scene.add(light);

var radius = 9.99,
  segments = 32,
  rotation = 0;

var globe = new Globe(radius, segments);

scene.add(globe);

// Render the image
function render() {
  controls.update();

  if(globe.earth)
    globe.earth.rotation.y += 0.0005;

  if(globe.clouds)
    globe.clouds.rotation.y += 0.0003;

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();