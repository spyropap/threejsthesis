import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
const carScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(3, 1, 4);

const planeGeometry = new THREE.CircleGeometry(25, 128);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
carScene.add(plane);

plane.rotation.x = -0.5 * Math.PI;
plane.position.y = -0.5;

const directionalLight = new THREE.DirectionalLight(0xc4c4c4, 5);
directionalLight.position.set(7, 10, 0);
carScene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0xc4c4c4, 5);
directionalLight1.position.set(-7, 10, 0);
carScene.add(directionalLight1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.update();


const carUrl = '../assets/bugatti_eb110.glb';
let carModel;
loader.load(carUrl,
    function (gltf){
        carModel = gltf.scene;
        carModel.getObjectByName("Object_3").visible = false;
        carModel.getObjectByName("Object_4").visible = false;
        carModel.getObjectByName("Object_30").visible = false;
        carModel.getObjectByName("Object_47").visible = false;
        carScene.add(gltf.scene);
    }
);


let changeColor = (color, model) => {
    model.getObjectByName("Object_10").material.color.set(color);
}

function handleInput() {
    document.querySelector('.colored.green').addEventListener('click',  () => {

        changeColor('#0FE77B', carModel);
    });
    document.querySelector('.colored.miami-blue').addEventListener('click',  () => {
    
        changeColor('#02A1C0', carModel);
    });
    
    document.querySelector('.colored.lava-orange').addEventListener('click',  () => {
    
        changeColor('#FA5230', carModel);
    });
    
    document.querySelector('.colored.yellow').addEventListener('click',  () => {
    
        changeColor('#D0A407', carModel);
    });
    
    document.querySelector('.colored.guards-red').addEventListener('click',  () => {
    
        changeColor('#CE0100', carModel);
    }); 
}


carScene.background = new THREE.Color(0xdddddd);
renderer.render(carScene, camera);

function animate() {
    renderer.setAnimationLoop(animate);
    controls.update();
	renderer.render( carScene, camera );
    handleInput();
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

animate();