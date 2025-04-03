// Обновленная версия three-animation.js с разделенным фоном и моделью
let scene, camera, renderer;
let backgroundScene, backgroundCamera, backgroundRenderer;
let particleSystem, pixelRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();
let leftEarPivot, rightEarPivot;
let isLowPowerDevice = false;
let frameSkip = 0;
let frameCount = 0;
let animationReady = false;

// Обнаружение устройств с низкой производительностью
function detectLowPowerDevice() {
    // Определяем мобильные устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Определяем количество логических процессоров
    const cpuCores = navigator.hardwareConcurrency || 2;
    
    // Проверяем поддержку WebGL и его возможности
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Если WebGL не поддерживается или это мобильное устройство с малым количеством ядер
    isLowPowerDevice = !gl || (isMobile && cpuCores <= 4);
    
    console.log("Low power device detected:", isLowPowerDevice);
    
    // Настраиваем пропуск кадров для слабых устройств
    frameSkip = isLowPowerDevice ? 2 : 0; // Пропускаем 2 кадра из 3 на слабых устройствах
    
    return isLowPowerDevice;
}

function initThree() {
    // Определяем слабые устройства
    detectLowPowerDevice();
    
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function() {
        try {
            // Инициализация фона на весь экран
            initFullscreenBackground();
            
            // Инициализация 3D модели в контейнере
            initModelInContainer();
            
            document.addEventListener('mousemove', onDocumentMouseMove);
            window.addEventListener('resize', onWindowResize);
            
            // Сообщаем что анимация готова
            animationReady = true;
            
            // Запускаем анимацию
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
    
    loadingManager.itemStart('init');
    
    // Добавляем небольшую задержку перед запуском, чтобы прелоадер успел подготовить интерфейс
    setTimeout(() => {
        loadingManager.itemEnd('init');
    }, 500);
}

function initFullscreenBackground() {
    // Создаем отдельную сцену для фона
    backgroundScene = new THREE.Scene();
    
    // Камера для фона
    backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    backgroundCamera.position.z = 5;
    
    // Рендерер для фона на весь экран
    backgroundRenderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: isLowPowerDevice ? false : true, // Отключаем сглаживание на слабых устройствах
        powerPreference: "high-performance",
        precision: isLowPowerDevice ? "lowp" : "mediump" // Снижаем точность вычислений на слабых устройствах
    });
    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPowerDevice ? 1 : 2));
    
    // Находим элемент заднего фона или создаем новый
    let backgroundElement = document.getElementById('background-animation');
    if (!backgroundElement) {
        backgroundElement = document.createElement('div');
        backgroundElement.id = 'background-animation';
        document.body.appendChild(backgroundElement);
    }
    
    // Очищаем существующее содержимое
    while (backgroundElement.firstChild) {
        backgroundElement.removeChild(backgroundElement.firstChild);
    }
    
    // Добавляем канвас в DOM
    backgroundElement.appendChild(backgroundRenderer.domElement);
    
    // Добавляем свет для фона
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    backgroundScene.add(ambientLight);
    
    // Создаем элементы фона
    createParticleSystem();
    createGrid();
}

function initModelInContainer() {
    // Основная сцена для 3D модели
    scene = new THREE.Scene();
    
    // Находим контейнер для 3D модели
    const heroAnimationContainer = document.getElementById('hero-animation');
    
    if (!heroAnimationContainer) {
        console.error('Контейнер для 3D модели не найден');
        return;
    }
    
    // Получаем размеры контейнера
    const containerWidth = heroAnimationContainer.offsetWidth;
    const containerHeight = heroAnimationContainer.offsetHeight;
    
    // Камера для 3D модели с соотношением сторон контейнера
    camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 7; // Увеличиваем расстояние, чтобы модель была визуально меньше
    
    // Рендерер для 3D модели в контейнере
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: isLowPowerDevice ? false : true, // Отключаем сглаживание на слабых устройствах
        powerPreference: "high-performance",
        precision: isLowPowerDevice ? "lowp" : "mediump" // Снижаем точность вычислений на слабых устройствах
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPowerDevice ? 1 : 2));
    
    // Очищаем существующее содержимое
    while (heroAnimationContainer.firstChild) {
        heroAnimationContainer.removeChild(heroAnimationContainer.firstChild);
    }
    
    // Добавляем канвас в контейнер
    heroAnimationContainer.appendChild(renderer.domElement);
    
    // Устанавливаем размеры канваса
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    // Добавляем свет для 3D модели
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Создаем 3D модель
    createPixelRabbit();
}

function createPixelRabbit() {
    pixelRabbit = new THREE.Group();
    
    // Уменьшаем количество сегментов на слабых устройствах
    const segmentDetail = isLowPowerDevice ? 4 : 8;
    
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1.5, segmentDetail, segmentDetail, segmentDetail);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0, 0);
    pixelRabbit.add(body);
    
    const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, segmentDetail, segmentDetail, segmentDetail);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(-1.2, 0.5, 0);
    pixelRabbit.add(head);
    
    // Снижаем детализацию сферы для слабых устройств
    const sphereDetail = isLowPowerDevice ? 4 : 8;
    const noseGeometry = new THREE.SphereGeometry(0.2, sphereDetail, sphereDetail);
    const noseMaterial = new THREE.MeshBasicMaterial({
        color: 0xfeccea,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(-1.8, 0.5, 0);
    pixelRabbit.add(nose);
    
    const eyeGeometry = new THREE.SphereGeometry(0.15, isLowPowerDevice ? 6 : 12, sphereDetail);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x44445c,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-1.7, 0.7, 0.4);
    leftEye.renderOrder = 2;
    pixelRabbit.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-1.7, 0.7, -0.4);
    rightEye.renderOrder = 2;
    pixelRabbit.add(rightEye);
    
    // Создаем контейнеры для ушей
    leftEarPivot = new THREE.Group();
    rightEarPivot = new THREE.Group();
    
    // Позиционируем контейнеры в местах крепления ушей к голове
    leftEarPivot.position.set(-1.2, 1.1, 0.3);  // точка крепления к голове
    rightEarPivot.position.set(-1.2, 1.1, -0.3);
    
    // Уменьшаем детализацию ушей
    const earGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.2, 2, segmentDetail, 2);
    
    const leftEar = new THREE.Mesh(earGeometry, material);
    leftEar.position.set(0, 0.75, 0);  // половина высоты уха
    leftEarPivot.rotation.z = Math.PI / 12;
    leftEarPivot.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, material);
    rightEar.position.set(0, 0.75, 0);  // половина высоты уха
    rightEarPivot.rotation.z = -Math.PI / 12;
    rightEarPivot.add(rightEar);
    
    // Добавляем контейнеры ушей к кролику
    pixelRabbit.add(leftEarPivot);
    pixelRabbit.add(rightEarPivot);
    
    // Упрощаем геометрию ног
    const legGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4, 2, 4, 2);
    const legMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        depthTest: false
    });
    
    const frontLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontLeftLeg.position.set(-0.8, -0.95, 0.5);
    frontLeftLeg.renderOrder = 1;
    pixelRabbit.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    frontRightLeg.position.set(-0.8, -0.95, -0.5);
    frontRightLeg.renderOrder = 1;
    pixelRabbit.add(frontRightLeg);
    
    const backLeftLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeftLeg.position.set(0.8, -0.95, 0.5);
    backLeftLeg.renderOrder = 1;
    pixelRabbit.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(legGeometry, legMaterial);
    backRightLeg.position.set(0.8, -0.95, -0.5);
    backRightLeg.renderOrder = 1;
    pixelRabbit.add(backRightLeg);
    
    const tailGeometry = new THREE.SphereGeometry(0.3, sphereDetail, sphereDetail);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(1.2, 0, 0);
    pixelRabbit.add(tail);
    
    // Уменьшаем масштаб модели кролика на 15% (с 1.6 до 1.36)
    pixelRabbit.scale.set(1.2, 1.2, 1.2);
    
    scene.add(pixelRabbit);
}

function createParticleSystem() {
    // Уменьшаем количество частиц на слабых устройствах
    const particleCount = isLowPowerDevice ? 750 : 1500;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x929397); // Gray
    const color2 = new THREE.Color(0x1391ff); // Blue
    const color3 = new THREE.Color(0x1391ff); // Light Blue
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;  // Увеличиваем область для частиц
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        
        const colorChoice = Math.random();
        let color;
        
        if (colorChoice < 0.5) {
            color = color1;
        } else if (colorChoice < 0.8) {
            color = color2;
        } else {
            color = color3;
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 0.15 + 0.05;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    
    // Добавляем частицы в фоновую сцену
    backgroundScene.add(particleSystem);
}

function createGrid() {
    // Для слабых устройств создаем менее детализированную сетку
    const gridSize = 80;
    const gridDivisions = isLowPowerDevice ? 40 : 80;
    const gridColor = 0x929397; // Change grid color to gray
    
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -10;
    
    // Добавляем сетку в фоновую сцену
    backgroundScene.add(gridHelper);
}

function createFallbackAnimation() {
    const heroSection = document.getElementById('hero-animation');
    heroSection.style.background = 'radial-gradient(circle at center, rgba(146, 147, 151, 0.2) 0%, transparent 70%)';
    
    // Уменьшаем количество элементов для фолбэк-анимации на слабых устройствах
    const starCount = isLowPowerDevice ? 50 : 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        
        const colorChoice = Math.random();
        if (colorChoice < 0.5) {
            star.style.backgroundColor = '#929397';
        } else if (colorChoice < 0.8) {
            star.style.backgroundColor = '#1391ff';
        } else {
            star.style.backgroundColor = '#1391ff';
        }
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.boxShadow = '0 0 10px currentColor';
        star.style.borderRadius = '0';
        
        star.style.animation = `starBlink ${Math.random() * 3 + 2}s infinite alternate`;
        
        heroSection.appendChild(star);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starBlink {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function onWindowResize() {
    // Обновляем размеры фонового рендерера
    if (backgroundRenderer) {
        backgroundCamera.aspect = window.innerWidth / window.innerHeight;
        backgroundCamera.updateProjectionMatrix();
        backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Обновляем размеры рендерера 3D модели
    const heroAnimationContainer = document.getElementById('hero-animation');
    
    if (heroAnimationContainer && renderer) {
        const containerWidth = heroAnimationContainer.offsetWidth;
        const containerHeight = heroAnimationContainer.offsetHeight;
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Пропускаем кадры для слабых устройств
    if (frameSkip > 0) {
        frameCount = (frameCount + 1) % (frameSkip + 1);
        if (frameCount !== 0) {
            return;
        }
    }
    
    const elapsedTime = clock.getElapsedTime();
    
    // Анимация фона - оптимизированное вращение
    if (particleSystem) {
        // Уменьшаем скорость вращения на слабых устройствах
        const rotationSpeed = isLowPowerDevice ? 0.5 : 1;
        
        particleSystem.rotation.x += 0.0008 * rotationSpeed;
        particleSystem.rotation.y += 0.001 * rotationSpeed;
        
        // Добавляем реакцию на движение мыши для фона
        particleSystem.rotation.x += (mouseY * 0.0001) * rotationSpeed;
        particleSystem.rotation.y += (mouseX * 0.0001) * rotationSpeed;
    }
    
    // Анимация 3D модели
    if (pixelRabbit) {
        // Уменьшаем скорость вращения на слабых устройствах
        const rotationSpeed = isLowPowerDevice ? 0.5 : 1;
        
        pixelRabbit.rotation.y += 0.01 * rotationSpeed;
        
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.02 * rotationSpeed;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.02 * rotationSpeed;
        
        // Пульсация с учетом уменьшенного размера модели
        const pulseFactor = Math.sin(elapsedTime * 2 * rotationSpeed) * 0.05 + 1;
        pixelRabbit.scale.set(pulseFactor * 1.2, pulseFactor * 1.2, pulseFactor * 1.2);
        
        // Анимируем уши через контейнеры
        if (leftEarPivot && rightEarPivot) {
            // Используем разную частоту и фазовый сдвиг для каждого уха
            leftEarPivot.rotation.z = Math.PI / 12 + Math.sin(elapsedTime * 1.3 * rotationSpeed) * 0.12;
            rightEarPivot.rotation.z = -Math.PI / 12 + Math.sin(elapsedTime * 1.7 * rotationSpeed + Math.PI/3) * 0.09;
        }

        if (pixelRabbit.children[3] && pixelRabbit.children[4]) {
            const leftEye = pixelRabbit.children[3];
            const rightEye = pixelRabbit.children[4];
            
            const blinkFactor = Math.sin(elapsedTime * 3 * rotationSpeed) > 0.95 ? 0.2 : 1;
            leftEye.scale.set(1, blinkFactor, 1);
            rightEye.scale.set(1, blinkFactor, 1);
        }
        
        if (pixelRabbit.children[2]) {
            const nose = pixelRabbit.children[2];
            
            const nosePulse = Math.sin(elapsedTime * 1.5 * rotationSpeed) * 0.1 + 1;
            nose.scale.set(nosePulse, nosePulse, nosePulse);
        }
        
        // Анимация ног
        if (pixelRabbit.children[7] && pixelRabbit.children[8] && 
            pixelRabbit.children[9] && pixelRabbit.children[10]) {
            
            const frontLeftLeg = pixelRabbit.children[7];
            const frontRightLeg = pixelRabbit.children[8];
            const backLeftLeg = pixelRabbit.children[9];
            const backRightLeg = pixelRabbit.children[10];
            
            frontLeftLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 * rotationSpeed) * 0.1;
            frontRightLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 * rotationSpeed + Math.PI) * 0.1;
            backLeftLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 * rotationSpeed + Math.PI) * 0.1;
            backRightLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 * rotationSpeed) * 0.1;
            
            // Добавляем небольшое вращение для более естественного движения
            frontLeftLeg.rotation.x = Math.sin(elapsedTime * 1.5 * rotationSpeed) * 0.3;
            frontRightLeg.rotation.x = Math.sin(elapsedTime * 1.5 * rotationSpeed + Math.PI) * 0.3;
            backLeftLeg.rotation.x = Math.sin(elapsedTime * 1.5 * rotationSpeed + Math.PI) * 0.3;
            backRightLeg.rotation.x = Math.sin(elapsedTime * 1.5 * rotationSpeed) * 0.3;
        }
    }
    
    // Рендеринг фона
    if (backgroundRenderer && backgroundScene && backgroundCamera) {
        backgroundRenderer.render(backgroundScene, backgroundCamera);
    }
    
    // Рендеринг 3D модели
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Инициализация Three.js при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Не запускаем инициализацию сразу, а ждем завершения прелоадера
    document.addEventListener('preloaderFinished', function() {
        console.log("Preloader finished, initializing 3D animation");
        setTimeout(() => {
            try {
                initThree();
            } catch (error) {
                console.error("Ошибка инициализации Three.js:", error);
                createFallbackAnimation();
            }
        }, 500); // Даем дополнительное время после завершения прелоадера
    });
    
    // Если прелоадера нет или он уже скрыт, инициализируем сразу
    if (!document.querySelector('.preloader')) {
        try {
            initThree();
        } catch (error) {
            console.error("Ошибка инициализации Three.js:", error);
            createFallbackAnimation();
        }
    }
});
