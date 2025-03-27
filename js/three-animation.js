let scene, camera, renderer;
let particleSystem, pixelRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();

function initThree() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function() {
        try {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.domElement.classList.add('fullscreen-bg');
            document.body.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(10, 10, 10);
            scene.add(directionalLight);

            createPixelRabbit();
            createParticleSystem();
            createGrid();

            document.addEventListener('mousemove', onDocumentMouseMove);
            window.addEventListener('resize', onWindowResize);

            animate();
        } catch (error) {
            console.error("Ошибка инициализации Three.js:", error);
            createFallbackAnimation();
        }
    };
    loadingManager.onError = function(url) {
        console.error("Ошибка загрузки ресурса:", url);
        createFallbackAnimation();
    };
    loadingManager.itemStart();
    loadingManager.itemEnd();
}

function createPixelRabbit() {
    pixelRabbit = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: 0x32b288, wireframe: true, transparent: true, opacity: 0.8 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1.5), material);
    pixelRabbit.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), material);
    head.position.set(-1.2, 0.5, 0);
    pixelRabbit.add(head);

    const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xf7519b, wireframe: true, transparent: true, opacity: 0.9 });
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), noseMaterial);
    nose.position.set(-1.8, 0.5, 0);
    pixelRabbit.add(nose);

    scene.add(pixelRabbit);
}

function createParticleSystem() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleSystem = new THREE.Points(particles, new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8 }));
    scene.add(particleSystem);
}

function createGrid() {
    const gridHelper = new THREE.GridHelper(50, 50, 0x32b288, 0x32b288);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -5;
    scene.add(gridHelper);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (pixelRabbit) pixelRabbit.rotation.y += 0.01;
    if (particleSystem) particleSystem.rotation.y += 0.0008;
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function() {
    try { initThree(); } catch (error) {
        console.error("Ошибка инициализации Three.js:", error);
        createFallbackAnimation();
    }
});
