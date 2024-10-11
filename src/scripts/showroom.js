import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

//buton to change scene
const sceneBtn = document.getElementById('nxtScene');
const carBtn = document.getElementById('nxtCar');

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();

const progressBarContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('#progress-bar');

const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);

camera.position.set(10, 5, 10);

const showroomLoadingManager = new THREE.LoadingManager();
//create instances of the two loaders
const backgroundLoader = new RGBELoader(showroomLoadingManager);
const gltfLoader = new GLTFLoader(showroomLoadingManager);


scene.background = new THREE.Color(0xddd0ed);

//floor
const carPlane = new THREE.CircleGeometry(15, 128);
const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
const plane = new THREE.Mesh( carPlane, material );
carPlane.rotateX(Math.PI/2);
scene.add(plane);


//controls for camera movement with mouse
const showcontrols = new OrbitControls(camera, renderer.domElement);
showcontrols.enableZoom = false;
showcontrols.enablePan = false;

//polarAngle is the angle ofthe two poles (think like the earth) since we are talking about orbitControls
showcontrols.minPolarAngle =  (Math.PI / 2.5);
showcontrols.maxPolarAngle =  (Math.PI / 2.5);

camera.position.setY(-1);
showcontrols.update();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.NeutralToneMapping;


backgroundLoader.load('../assets/symmetrical_garden_02_4k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
})

const  backgrounds = [
    '../assets/symmetrical_garden_02_4k.hdr',
    '../assets/vignaioli_night_4k.hdr',
    '../assets/zwartkops_start_morning_4k.hdr',
    '../assets/quarry_cloudy_4k.hdr'
]

const carFiles = [
    { name: "lancia", file: "../assets/free_lancia_delta_hf_integrale_evo_2/scene.gltf" },
    { name: "capri", file: "../assets/ford_capri_group_b/scene.gltf" },
    { name: "honda", file: "../assets/honda_s800/scene.gltf" }
];

const carModels = {};

//load the models
carFiles.forEach((item) => {
    gltfLoader.load(item.file, (gltf) => {

        carModels[item.name] = gltf.scene;
        gltf.scene.scale.set(3, 3, 3);
        scene.add(gltf.scene);
        if(item.name == 'capri' || item.name == 'lancia') {
            carModels[item.name].visible = false;
        }
    });
})

//set the animation loop and refresh once every frame occurs
function animate() {

	renderer.setAnimationLoop(animate);
    showcontrols.update();
	renderer.render( scene, camera );

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

//callback called per file loaded
showroomLoadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

//promise after all files loaded
showroomLoadingManager.onLoad = function() {
    progressBarContainer.style.display = "none";
    animate();
}

//button event listeners
let backgroundCnt = 1;
let carCnt = 1;
sceneBtn.addEventListener('click', (e) => {
    backgroundLoader.load(backgrounds[backgroundCnt], (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = environmentMap;
        scene.environment = environmentMap;
    });

    backgroundCnt++;
    if (backgroundCnt > 3) {
        backgroundCnt = 0;
    }
    console.log(backgrounds[backgroundCnt]);
    console.log(backgroundCnt);    
});

carBtn.addEventListener('click', (e) => {
    console.log('Clicked')
    console.log(carCnt)
    switch(carCnt) {
        case 1:
            carModels['capri'].visible = false;
            carModels['lancia'].visible = false;
            carModels['honda'].visible = true;
            break;
        case 2:
            carModels['honda'].visible = false;
            carModels['lancia'].visible = false;
            carModels['capri'].visible = true;
            break;
        case 3:
            carModels['capri'].visible = false;
            carModels['honda'].visible = false;
            carModels['lancia'].visible = true;
        }
        
        carCnt++;
        if (carCnt > 3) {
            carCnt = 1;
        }
});

