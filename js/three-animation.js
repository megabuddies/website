// Обновленная версия three-animation.js с милым кроликом
let scene, camera, renderer;
let particleSystem, cuteRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();

function initThree() {
    // Предварительная загрузка ресурсов
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function() {
        try {
            // Создаем сцену
            scene = new THREE.Scene();
            
            // Настраиваем камеру
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            
            // Настраиваем рендерер с эффектом пост-обработки
            renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.domElement.classList.add('fullscreen-bg');
            document.body.appendChild(renderer.domElement);
            
            // Добавляем освещение
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(10, 10, 10);
            scene.add(directionalLight);
            
            // Создаем милого кролика
            createCuteRabbit();
            
            // Создаем систему частиц
            createParticleSystem();
            
            // Создаем сетку
            createGrid();
            
            // Отслеживание движения мыши для интерактивности
            document.addEventListener('mousemove', onDocumentMouseMove);
            
            // Обработка изменения размера окна
            window.addEventListener('resize', onWindowResize);
            
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
    
    // Загружаем необходимые ресурсы
    loadingManager.itemStart();
    loadingManager.itemEnd();
}

function createCuteRabbit() {
    // Создаем группу для кролика
    cuteRabbit = new THREE.Group();
    
    // Цвета для кролика
    const mainColor = 0xffc0cb; // Нежно-розовый
    const secondaryColor = 0xff69b4; // Ярко-розовый
    const detailColor = 0xffffff; // Белый
    
    // Материалы с эффектом прозрачности
    const mainMaterial = new THREE.MeshBasicMaterial({
        color: mainColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const secondaryMaterial = new THREE.MeshBasicMaterial({
        color: secondaryColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const detailMaterial = new THREE.MeshBasicMaterial({
        color: detailColor,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    
    // Создаем голову кролика
    const headGeometry = new THREE.SphereGeometry(1, 16, 16);
    const head = new THREE.Mesh(headGeometry, mainMaterial);
    cuteRabbit.add(head);
    
    // Создаем уши кролика
    const earGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
    
    // Левое ухо
    const leftEar = new THREE.Mesh(earGeometry, secondaryMaterial);
    leftEar.position.set(-0.5, 1.2, 0);
    leftEar.rotation.x = -Math.PI / 8;
    leftEar.rotation.z = -Math.PI / 12;
    cuteRabbit.add(leftEar);
    
    // Внутренняя часть левого уха
    const innerLeftEarGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.2, 8);
    const innerLeftEar = new THREE.Mesh(innerLeftEarGeometry, detailMaterial);
    innerLeftEar.position.set(0, 0.1, 0);
    leftEar.add(innerLeftEar);
    
    // Правое ухо
    const rightEar = new THREE.Mesh(earGeometry, secondaryMaterial);
    rightEar.position.set(0.5, 1.2, 0);
    rightEar.rotation.x = -Math.PI / 8;
    rightEar.rotation.z = Math.PI / 12;
    cuteRabbit.add(rightEar);
    
    // Внутренняя часть правого уха
    const innerRightEarGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.2, 8);
    const innerRightEar = new THREE.Mesh(innerRightEarGeometry, detailMaterial);
    innerRightEar.position.set(0, 0.1, 0);
    rightEar.add(innerRightEar);
    
    // Создаем глаза
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    // Левый глаз
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.2, 0.85);
    cuteRabbit.add(leftEye);
    
    // Правый глаз
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.2, 0.85);
    cuteRabbit.add(rightEye);
    
    // Блики в глазах
    const eyeHighlightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeHighlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEyeHighlight = new THREE.Mesh(eyeHighlightGeometry, eyeHighlightMaterial);
    leftEyeHighlight.position.set(0.05, 0.05, 0.05);
    leftEye.add(leftEyeHighlight);
    
    const rightEyeHighlight = new THREE.Mesh(eyeHighlightGeometry, eyeHighlightMaterial);
    rightEyeHighlight.position.set(0.05, 0.05, 0.05);
    rightEye.add(rightEyeHighlight);
    
    // Создаем нос
    const noseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const noseMaterial = new THREE.MeshBasicMaterial({ color: secondaryColor });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, -0.1, 0.9);
    cuteRabbit.add(nose);
    
    // Создаем тело
    const bodyGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const body = new THREE.Mesh(bodyGeometry, mainMaterial);
    body.position.set(0, -1.5, 0);
    body.scale.set(1, 0.8, 1);
    cuteRabbit.add(body);
    
    // Создаем лапы
    const frontPawGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    
    // Передние лапы
    const leftFrontPaw = new THREE.Mesh(frontPawGeometry, secondaryMaterial);
    leftFrontPaw.position.set(-0.7, -2.1, 0.5);
    leftFrontPaw.scale.set(0.8, 0.5, 0.8);
    cuteRabbit.add(leftFrontPaw);
    
    const rightFrontPaw = new THREE.Mesh(frontPawGeometry, secondaryMaterial);
    rightFrontPaw.position.set(0.7, -2.1, 0.5);
    rightFrontPaw.scale.set(0.8, 0.5, 0.8);
    cuteRabbit.add(rightFrontPaw);
    
    // Задние лапы
    const backPawGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    
    const leftBackPaw = new THREE.Mesh(backPawGeometry, secondaryMaterial);
    leftBackPaw.position.set(-0.5, -2.2, -0.5);
    leftBackPaw.scale.set(0.8, 0.6, 1);
    cuteRabbit.add(leftBackPaw);
    
    const rightBackPaw = new THREE.Mesh(backPawGeometry, secondaryMaterial);
    rightBackPaw.position.set(0.5, -2.2, -0.5);
    rightBackPaw.scale.set(0.8, 0.6, 1);
    cuteRabbit.add(rightBackPaw);
    
    // Создаем хвост
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, detailMaterial);
    tail.position.set(0, -1.8, -1.1);
    cuteRabbit.add(tail);
    
    // Добавляем свечение
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: mainColor,
        transparent: true,
        opacity: 0.3
    });
    
    const glowGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(1.1, 1.1, 1.1);
    cuteRabbit.add(glowMesh);
    
    // Масштабируем и добавляем кролика на сцену
    cuteRabbit.scale.set(0.8, 0.8, 0.8);
    scene.add(cuteRabbit);
}

function createParticleSystem() {
    // Создаем систему частиц с милыми цветами
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0xffc0cb); // Нежно-розовый
    const color2 = new THREE.Color(0xff69b4); // Ярко-розовый
    const color3 = new THREE.Color(0xffffff); // Белый
    
    for (let i = 0; i < particleCount; i++) {
        // Позиции
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        
        // Цвета
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
        
        // Размеры
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
    scene.add(particleSystem);
}

function createGrid() {
    // Создаем сетку для фона
    const gridSize = 50;
    const gridDivisions = 50;
    const gridColor = 0xff69b4;
    
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -5;
    scene.add(gridHelper);
}

function createFallbackAnimation() {
    // Создаем простую анимацию без WebGL
    const heroSection = document.getElementById('hero-animation');
    heroSection.style.background = 'radial-gradient(circle at center, rgba(255, 192, 203, 0.2) 0%, transparent 70%)';
    
    // Добавляем несколько "звезд"
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        
        // Используем милые цвета
        const colorChoice = Math.random();
        if (colorChoice < 0.5) {
            star.style.backgroundColor = '#ffc0cb'; // Нежно-розовый
        } else if (colorChoice < 0.8) {
            star.style.backgroundColor = '#ff69b4'; // Ярко-розовый
        } else {
            star.style.backgroundColor = '#ffffff'; // Белый
        }
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.boxShadow = '0 0 10px currentColor';
        star.style.borderRadius = '50%'; // Круглые звезды
        
        // Добавляем анимацию мерцания
        star.style.animation = `starBlink ${Math.random() * 3 + 2}s infinite alternate`;
        
        heroSection.appendChild(star);
    }
    
    // Добавляем стили анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes starBlink {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Добавляем простого кролика в качестве фоллбэка
    const rabbitContainer = document.createElement('div');
    rabbitContainer.style.position = 'absolute';
    rabbitContainer.style.left = '50%';
    rabbitContainer.style.top = '50%';
    rabbitContainer.style.transform = 'translate(-50%, -50%)';
    rabbitContainer.style.width = '100px';
    rabbitContainer.style.height = '150px';
    
    // Создаем простого кролика с помощью CSS
    const rabbitHead = document.createElement('div');
    rabbitHead.style.width = '60px';
    rabbitHead.style.height = '60px';
    rabbitHead.style.backgroundColor = '#ffc0cb';
    rabbitHead.style.position = 'absolute';
    rabbitHead.style.left = '20px';
    rabbitHead.style.top = '30px';
    rabbitHead.style.borderRadius = '50%';
    rabbitHead.style.boxShadow = '0 0 10px #ffc0cb';
    rabbitContainer.appendChild(rabbitHead);
    
    // Уши
    const leftEar = document.createElement('div');
    leftEar.style.width = '15px';
    leftEar.style.height = '40px';
    leftEar.style.backgroundColor = '#ff69b4';
    leftEar.style.position = 'absolute';
    leftEar.style.left = '25px';
    leftEar.style.top = '-10px';
    leftEar.style.borderRadius = '40%';
    leftEar.style.boxShadow = '0 0 10px #ff69b4';
    rabbitContainer.appendChild(leftEar);
    
    const rightEar = document.createElement('div');
    rightEar.style.width = '15px';
    rightEar.style.height = '40px';
    rightEar.style.backgroundColor = '#ff69b4';
    rightEar.style.position = 'absolute';
    rightEar.style.left = '60px';
    rightEar.style.top = '-10px';
    rightEar.style.borderRadius = '40%';
    rightEar.style.boxShadow = '0 0 10px #ff69b4';
    rabbitContainer.appendChild(rightEar);
    
    // Анимация пульсации
    rabbitContainer.style.animation = 'rabbitPulse 2s infinite alternate';
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes rabbitPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(1.1); }
        }
    `;
        document.head.appendChild(pulseStyle);
    
    heroSection.appendChild(rabbitContainer);
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
    
    if (cuteRabbit) {
        // Вращаем модель кролика
        cuteRabbit.rotation.x += 0.003;
        cuteRabbit.rotation.y += 0.005;
        
        // Интерактивное движение в зависимости от положения курсора
        cuteRabbit.rotation.x += (mouseY - cuteRabbit.rotation.x * 0.1) * 0.01;
        cuteRabbit.rotation.y += (mouseX - cuteRabbit.rotation.y * 0.1) * 0.01;
        
        // Пульсация размера
        const pulseFactor = Math.sin(elapsedTime * 1.5) * 0.05 + 1;
        cuteRabbit.scale.set(0.8 * pulseFactor, 0.8 * pulseFactor, 0.8 * pulseFactor);
        
        // Анимация ушей
        if (cuteRabbit.children && cuteRabbit.children.length > 1) {
            const earMovement = Math.sin(elapsedTime * 2) * 0.1;
            cuteRabbit.children[1].rotation.z = -Math.PI / 12 + earMovement; // левое ухо
            cuteRabbit.children[3].rotation.z = Math.PI / 12 - earMovement; // правое ухо
        }
    }
    
    // Вращаем систему частиц
    if (particleSystem) {
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.0008;
    }
    
    renderer.render(scene, camera);
}

// Инициализация Three.js при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    try {
        initThree();
    } catch (error) {
        console.error("Ошибка инициализации Three.js:", error);
        createFallbackAnimation();
    }
});

