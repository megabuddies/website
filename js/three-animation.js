// Оптимизированная версия three-animation.js с пиксельным кроликом
let scene, camera, renderer;
let particleSystem, pixelRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();

function initThree() {
    // Оптимизируем загрузку ресурсов
    THREE.Cache.enabled = true;
    
    // Создаем сцену сразу, не дожидаясь загрузки
    scene = new THREE.Scene();
    
    // Настраиваем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Оптимизируем рендерер
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false, // Отключаем для повышения производительности
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Устанавливаем фиксированное значение для стабильности
    renderer.domElement.classList.add('fullscreen-bg');
    document.body.appendChild(renderer.domElement);
    
    // Добавляем базовое освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Создаем пиксельного кролика
    createPixelRabbit();
    
    // Создаем систему частиц (оптимизированную)
    createParticleSystem();
    
    // Создаем сетку
    createGrid();
    
    // Отслеживание движения мыши
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Обработка изменения размера окна
    window.addEventListener('resize', onWindowResize);
    
    // Запускаем анимацию
    animate();
}

function createPixelRabbit() {
    // Создаем группу для кролика
    pixelRabbit = new THREE.Group();
    
    // Основной цвет
    const mainColor = 0xffffff; // Белый как на изображении
    const earInnerColor = 0xffb6c1; // Розовый для внутренней части ушей
    const eyeColor = 0x000000; // Черный для глаз
    
    // Оптимизированный материал
    const mainMaterial = new THREE.MeshBasicMaterial({
        color: mainColor,
        wireframe: false, // Сплошная заливка для пиксельного вида
        transparent: true,
        opacity: 0.9
    });
    
    const earInnerMaterial = new THREE.MeshBasicMaterial({
        color: earInnerColor,
        wireframe: false,
        transparent: true,
        opacity: 0.9
    });
    
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: eyeColor,
        wireframe: false,
        transparent: false
    });
    
    // Создаем голову (основной куб)
    const headGeometry = new THREE.BoxGeometry(1.8, 1.4, 0.8);
    const head = new THREE.Mesh(headGeometry, mainMaterial);
    pixelRabbit.add(head);
    
    // Создаем уши (прямоугольные блоки)
    const leftEarGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const leftEar = new THREE.Mesh(leftEarGeometry, mainMaterial);
    leftEar.position.set(-0.5, 1.1, 0);
    pixelRabbit.add(leftEar);
    
    const rightEarGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const rightEar = new THREE.Mesh(rightEarGeometry, mainMaterial);
    rightEar.position.set(0.5, 1.1, 0);
    pixelRabbit.add(rightEar);
    
    // Внутренняя часть ушей
    const innerLeftEarGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.25);
    const innerLeftEar = new THREE.Mesh(innerLeftEarGeometry, earInnerMaterial);
    innerLeftEar.position.set(0, 0, 0.05);
    leftEar.add(innerLeftEar);
    
    const innerRightEarGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.25);
    const innerRightEar = new THREE.Mesh(innerRightEarGeometry, earInnerMaterial);
    innerRightEar.position.set(0, 0, 0.05);
    rightEar.add(innerRightEar);
    
    // Создаем глаза (пиксельные кубики)
    const eyeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.2, 0.4);
    pixelRabbit.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.2, 0.4);
    pixelRabbit.add(rightEye);
    
    // Создаем нос
    const noseGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const nose = new THREE.Mesh(noseGeometry, eyeMaterial);
    nose.position.set(0, -0.1, 0.4);
    pixelRabbit.add(nose);
    
    // Создаем тело (прямоугольный блок)
    const bodyGeometry = new THREE.BoxGeometry(1.4, 1, 0.8);
    const body = new THREE.Mesh(bodyGeometry, mainMaterial);
    body.position.set(0, -1.2, 0);
    pixelRabbit.add(body);
    
    // Создаем лапы (пиксельные блоки)
    const pawGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
    
    // Передние лапы
    const leftPaw = new THREE.Mesh(pawGeometry, mainMaterial);
    leftPaw.position.set(-0.4, -1.8, 0.2);
    pixelRabbit.add(leftPaw);
    
    const rightPaw = new THREE.Mesh(pawGeometry, mainMaterial);
    rightPaw.position.set(0.4, -1.8, 0.2);
    pixelRabbit.add(rightPaw);
    
    // Добавляем черную обводку для пиксельного эффекта
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    
    const addEdges = (mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const line = new THREE.LineSegments(edges, edgeMaterial);
        mesh.add(line);
    };
    
    // Добавляем обводку ко всем элементам
    addEdges(head);
    addEdges(leftEar);
    addEdges(rightEar);
    addEdges(body);
    addEdges(leftPaw);
    addEdges(rightPaw);
    
    // Масштабируем кролика
    pixelRabbit.scale.set(1, 1, 1);
    
    scene.add(pixelRabbit);
}

function createParticleSystem() {
    // Оптимизированная система частиц
    const particleCount = 500; // Уменьшаем количество для производительности
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x32b288); // Бирюзовый
    const color2 = new THREE.Color(0xf7519b); // Розовый
    
    for (let i = 0; i < particleCount; i++) {
        // Позиции
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        // Цвета
        const color = Math.random() < 0.5 ? color1 : color2;
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function createGrid() {
    // Оптимизированная сетка
    const gridSize = 20;
    const gridDivisions = 20;
    const gridColor = 0x32b288;
    
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -3;
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
    
    const elapsedTime = clock.getElapsedTime();
    
    if (pixelRabbit) {
        // Вращаем модель кролика
        pixelRabbit.rotation.y += 0.01;
        
        // Интерактивное движение в зависимости от положения курсора
        pixelRabbit.rotation.x = mouseY * 0.1;
        pixelRabbit.rotation.y += mouseX * 0.003;
        
        // Небольшая пульсация для эффекта "жизни"
        const pulseFactor = Math.sin(elapsedTime * 1.5) * 0.03 + 1;
        pixelRabbit.scale.set(pulseFactor, pulseFactor, pulseFactor);
    }
    
    // Вращаем систему частиц
    if (particleSystem) {
        particleSystem.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}

// Инициализация Three.js при загрузке страницы
document.addEventListener('DOMContentLoaded', initThree);
