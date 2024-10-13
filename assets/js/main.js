// Crear la escena
const scene = new THREE.Scene();
scene.background = null; // Fondo transparente

// Cámara
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-1.6618869132513296, 1.6238949997132879, 3.9492145311794413); // Posición inicial de la cámara
// camera.position.set(-1.3021506254422839, 2.0547140717607277, 4.103354718522187); 
camera.position.set(-2.2481480348059755, 1.8, 3.7421705023626686); 

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha true para fondo transparente
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Fondo transparente
renderer.shadowMap.enabled = true; // Habilitar las sombras
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // (opcional) para sombras suaves
document.getElementById('scene').appendChild(renderer.domElement); // Añadir al div

// OrbitControls para controlar la cámara con el mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilitar inercia al mover la cámara
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 1; // Distancia mínima para hacer zoom
controls.maxDistance = 100; // Distancia máxima para alejar
controls.maxPolarAngle = Math.PI / 2; // Ángulo máximo de rotación vertical

// Iluminación ambiental
const ambientLight = new THREE.AmbientLight(0xA1C6C5, 0.8);
scene.add(ambientLight);

// Iluminación direccional
const light1 = new THREE.DirectionalLight(0xFF28C9, 0.8); // Luz direccional 1
light1.intensity = 2;
light1.castShadow = true; // Permitir que esta luz proyecte sombras
light1.position.set(10, 7, -10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0x6EEAE2, 0.8); // Luz direccional 2
light2.intensity = 1.09;
light2.castShadow = true; // Permitir que esta luz proyecte sombras
light2.position.set(-10, -5.74, -6.48);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xD32E2E, 0.8); // Luz direccional 3
light3.intensity = 2;
light3.castShadow = true; // Permitir que esta luz proyecte sombras
light3.position.set(3.36, 1.16, 6.32);
scene.add(light3);

light1.shadow.mapSize.width = 2048; // Tamaño del mapa de sombras (aumenta para mejor calidad)
light1.shadow.mapSize.height = 2048;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;

light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 500;

light3.shadow.mapSize.width = 2048;
light3.shadow.mapSize.height = 2048;
light3.shadow.camera.near = 0.5;
light3.shadow.camera.far = 500;

// Cargar el modelo GLB
const loader = new THREE.GLTFLoader();
loader.load('assets/models/2018__lamborghini_aventador_k.s_edition-2k.glb', function(gltf) {
    const model = gltf.scene;
    model.castShadow = true; // Permitir que el modelo proyecte sombras
    model.receiveShadow = true; // Permitir que el modelo reciba sombras
    scene.add(model);

    // Ajustar la cámara para mirar al centro del modelo
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    // camera.lookAt(center);
    controls.target.set(center.x, center.y, center.z); // Configura el target a donde la cámara mira
    controls.update(); // Actualiza los controles

    animateCamera(center);

    animate(); // Iniciar animación
}, undefined, function(error) {
    console.error('Error al cargar el modelo', error);
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar los controles de cámara en cada frame
    renderer.render(scene, camera);
}

function animateCamera(target) {
    gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 3, ease: "power1.inOut" } })
        .to(camera.position, { x: -1.3021506254422839, y: 2.0547140717607277, z: 4.103354718522187, onUpdate: () => camera.lookAt(target) })
        .to(camera.position, { x: -2.2481480348059755, y: 1.8, z: 3.7421705023626686, onUpdate: () => camera.lookAt(target) })
        .to(camera.position, { x: -1.6618869132513296, y: 1.6238949997132879, z: 3.9492145311794413, onUpdate: () => camera.lookAt(target) });
}

// Redimensionar cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

// Panel de control de depuración con lil-gui (anteriormente dat.GUI)
const gui = new lil.GUI();

// Controlar la posición de la cámara
const cameraFolder = gui.addFolder('Cámara');
cameraFolder.add(camera.position, 'x', -10, 10).name('Posición X').listen();
cameraFolder.add(camera.position, 'y', -10, 10).name('Posición Y').listen();
cameraFolder.add(camera.position, 'z', -10, 10).name('Posición Z').listen();

// Controlar la luz direccional
const lightFolder1 = gui.addFolder('Luz Direccional 1');
lightFolder1.add(light1.position, 'x', -10, 10).name('Posición X').listen();
lightFolder1.add(light1.position, 'y', -10, 10).name('Posición Y').listen();
lightFolder1.add(light1.position, 'z', -10, 10).name('Posición Z').listen();
lightFolder1.add(light1, 'intensity', 0, 2).name('Intensidad').listen();

const lightFolder2 = gui.addFolder('Luz Direccional 2');
lightFolder2.add(light2.position, 'x', -10, 10).name('Posición X').listen();
lightFolder2.add(light2.position, 'y', -10, 10).name('Posición Y').listen();
lightFolder2.add(light2.position, 'z', -10, 10).name('Posición Z').listen();
lightFolder2.add(light2, 'intensity', 0, 1.09).name('Intensidad').listen();

const lightFolder3 = gui.addFolder('Luz Direccional 3');
lightFolder3.add(light3.position, 'x', -10, 10).name('Posición X').listen();
lightFolder3.add(light3.position, 'y', -10, 10).name('Posición Y').listen();
lightFolder3.add(light3.position, 'z', -10, 10).name('Posición Z').listen();
lightFolder3.add(light3, 'intensity', 0, 2).name('Intensidad').listen();

// Feather Icons
feather.replace();