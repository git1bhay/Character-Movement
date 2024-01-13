import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let character,
  p = [0, 0],
  bool = true,
  mixer,
  clock = new THREE.Clock();

//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(0, 500, -500);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//basic directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(0, 200, -200);
scene.add(dirLight);

//floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000, 1),
  new THREE.MeshPhongMaterial({ color: 0xffffff })
);
floor.rotateX((-90 * Math.PI) / 180);
scene.add(floor);

//character
const gltfLoader = new GLTFLoader();
gltfLoader.load("./character.glb", function (gltf) {
  character = gltf.scene;
  mixer = new THREE.AnimationMixer(character);
  mixer
    .clipAction(
      THREE.AnimationUtils.subclip(gltf.animations[0], "idle", 0, 221)
    )
    .setDuration(6)
    .play(); //0
  mixer
    .clipAction(
      THREE.AnimationUtils.subclip(gltf.animations[0], "run", 222, 244)
    )
    .setDuration(0.7)
    .play(); //1
  mixer._actions[0].enabled = true;
  mixer._actions[1].enabled = false;
  character.children[1].visible = true;
  character.children[2].visible = false;
  scene.add(character);
}); //end loader

//render
renderer.setAnimationLoop(render);
function render() {
  //character controls
  if (character) {
    updateKey();
    character.position.x += p[0];
    character.position.z += p[1];
  }
  //animation update
  const clockDelta = clock.getDelta();
  if (mixer) {
    mixer.update(clockDelta);
  }
  renderer.render(scene, camera);
}

//keys
let fwd,
  bkd,
  rgt,
  lft,
  spc,
  dwn = false,
  movKey = false;
window.addEventListener("keydown", function (e) {
  switch (e.code) {
    case "KeyW":
      fwd = true;
      break;
    case "KeyS":
      bkd = true;
      break;
    case "KeyD":
      rgt = true;
      break;
    case "KeyA":
      lft = true;
      break;
    case "Space":
      spc = true;
      break;
  }
});
window.addEventListener("keyup", function (e) {
  dwn = false;
  movKey = false;
  p = [0, 0];
  mixer._actions[0].enabled = true;
  mixer._actions[1].enabled = false;
  switch (e.code) {
    case "KeyW":
      fwd = false;
      break;
    case "KeyS":
      bkd = false;
      break;
    case "KeyD":
      rgt = false;
      break;
    case "KeyA":
      lft = false;
      break;
    case "Space":
      spc = false;
      break;
  }
});
function updateKey() {
  if (!dwn) {
    if (fwd) {
      console.log("w");
      dwn = true;
      character.rotation.y = (0 * Math.PI) / 180;
      p = [0, 5];
      movKey = true;
    }
    if (bkd) {
      console.log("s");
      dwn = true;
      character.rotation.y = (180 * Math.PI) / 180;
      p = [0, -5];
      movKey = true;
    }
    if (lft) {
      console.log("a");
      dwn = true;
      character.rotation.y = (90 * Math.PI) / 180;
      p = [5, 0];
      movKey = true;
    }
    if (rgt) {
      console.log("d");
      dwn = true;
      character.rotation.y = (-90 * Math.PI) / 180;
      p = [-5, 0];
      movKey = true;
    }
    if (spc) {
      console.log("space");
      dwn = true;
      charSwitch();
    }
    if (movKey) {
      mixer._actions[0].enabled = false;
      mixer._actions[1].enabled = true;
    }
  }
}
//switch character
function charSwitch() {
  if (bool) {
    character.children[1].visible = false;
    character.children[2].visible = true;
  } else {
    character.children[1].visible = true;
    character.children[2].visible = false;
  }
  bool = !bool;
}
