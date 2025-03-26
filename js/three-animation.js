// Обновленная версия three-animation.js с использованием кролика как основной модели
let scene, camera, renderer;
let particleSystem, pixelRabbit;
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
            
            // Создаем пиксельного кролика
            createPixelRabbit();
            
            // Создаем систему частиц в стиле MegaETH
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

function createPixelRabbit() {
    // Создаем группу для кролика
    pixelRabbit = new THREE.Group();
    
    // Основные цвета
    const mainColor = 0x32b288;
    const earInnerColor = 0xf6ae5c;
    
    // Материалы
    const mainMaterial = new THREE.MeshBasicMaterial({
        color: mainColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const earInnerMaterial = new THREE.MeshBasicMaterial({
        color: earInnerColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    // Создаем голову кролика (основной куб)
    const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const head = new THREE.Mesh(headGeometry, mainMaterial);
    pixelRabbit.add(head);
    
    // Создаем левое ухо
    const leftEarGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.3);
    const leftEar = new THREE.Mesh(leftEarGeometry, mainMaterial);
    leftEar.position.set(-0.5, 1.3, 0);
    pixelRabbit.add(leftEar);
    
    // Создаем внутреннюю часть левого уха
    const leftEarInnerGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.1);
    const leftEarInner = new THREE.Mesh(leftEarInnerGeometry, earInnerMaterial);
    leftEarInner.position.set(0, 0, 0.1);
    leftEar.add(leftEarInner);
    
    // Создаем правое ухо
    const rightEarGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.3);
    const rightEar = new THREE.Mesh(rightEarGeometry, mainMaterial);
    rightEar.position.set(0.5, 1.3, 0);
    pixelRabbit.add(rightEar);
    
    // Создаем внутреннюю часть правого уха
    const rightEarInnerGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.1);
    const rightEarInner = new THREE.Mesh(rightEarInnerGeometry, earInnerMaterial);
    rightEarInner.position.set(0, 0, 0.1);
    rightEar.add(rightEarInner);
    
    // Создаем глаза
    const eyeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.1);
    const leftEye = new THREE.Mesh(eyeGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    leftEye.position.set(-0.4, 0.2, 0.8);
    pixelRabbit.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    rightEye.position.set(0.4, 0.2, 0.8);
    pixelRabbit.add(rightEye);
    
    // Создаем нос
    const noseGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
    const nose = new THREE.Mesh(noseGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    nose.position.set(0, -0.1, 0.8);
    pixelRabbit.add(nose);
    
    // Создаем тело
    const bodyGeometry = new THREE.BoxGeometry(1.2, 1, 1.8);
    const body = new THREE.Mesh(bodyGeometry, mainMaterial);
    body.position.set(0, -1.2, 0);
    pixelRabbit.add(body);
    
    // Создаем лапы
    const frontPawGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.6);
    
    const leftFrontPaw = new THREE.Mesh(frontPawGeometry, mainMaterial);
    leftFrontPaw.position.set(-0.5, -1.8, 0.6);
    pixelRabbit.add(leftFrontPaw);
    
    const rightFrontPaw = new THREE.Mesh(frontPawGeometry, mainMaterial);
    rightFrontPaw.position.set(0.5, -1.8, 0.6);
    pixelRabbit.add(rightFrontPaw);
    
    // Создаем задние лапы
    const backPawGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
    
    const leftBackPaw = new THREE.Mesh(backPawGeometry, mainMaterial);
    leftBackPaw.position.set(-0.4, -1.8, -0.6);
    pixelRabbit.add(leftBackPaw);
    
    const rightBackPaw = new THREE.Mesh(backPawGeometry, mainMaterial);
    rightBackPaw.position.set(0.4, -1.8, -0.6);
    pixelRabbit.add(rightBackPaw);
    
    // Создаем хвост
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, mainMaterial);
    tail.position.set(0, -1.2, -1);
    pixelRabbit.add(tail);
    
    // Масштабируем кролика
    pixelRabbit.scale.set(0.8, 0.8, 0.8);
    
    // Добавляем свечение
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: mainColor,
        transparent: true,
        opacity: 0.3
    });
    
    // Создаем общую геометрию для свечения
    const glowGeometry = new THREE.BoxGeometry(3, 4, 3);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(1.1, 1.1, 1.1);
    pixelRabbit.add(glowMesh);
    
    scene.add(pixelRabbit);
}

function createParticleSystem() {
    // Создаем систему частиц с новыми цветами
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x32b288); // Бирюзовый
    const color2 = new THREE.Color(0xf7519b); // Розовый
    const color3 = new THREE.Color(0xf6ae5c); // Оранжевый
    
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
    // Создаем сетку для фона с новым цветом
    const gridSize = 50;
    const gridDivisions = 50;
    const gridColor = 0x32b288;
    
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColor);
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -5;
    scene.add(gridHelper);
}

function createFallbackAnimation() {
    // Создаем простую анимацию без WebGL с новыми цветами
    const heroSection = document.getElementById('hero-animation');
    heroSection.style.background = 'radial-gradient(circle at center, rgba(50, 178, 136, 0.2) 0%, transparent 70%)';
    
    // Добавляем несколько "звезд"
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        
        // Используем новые цвета
        const colorChoice = Math.random();
        if (colorChoice < 0.5) {
            star.style.backgroundColor = '#32b288'; // Бирюзовый
        } else if (colorChoice < 0.8) {
            star.style.backgroundColor = '#f7519b'; // Розовый
        } else {
            star.style.backgroundColor = '#f6ae5c'; // Оранжевый
        }
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.boxShadow = '0 0 10px currentColor';
        star.style.borderRadius = '0'; // Пиксельные звезды
        
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
    
    // Добавляем пиксельного кролика в качестве фоллбэка
    const rabbitContainer = document.createElement('div');
    rabbitContainer.style.position = 'absolute';
    rabbitContainer.style.left = '50%';
    rabbitContainer.style.top = '50%';
    rabbitContainer.style.transform = 'translate(-50%, -50%)';
    rabbitContainer.style.width = '100px';
    rabbitContainer.style.height = '150px';
    
    // Создаем пиксельного кролика с помощью CSS
    const rabbitHead = document.createElement('div');
    rabbitHead.style.width = '60px';
    rabbitHead.style.height = '60px';
    rabbitHead.style.backgroundColor = '#32b288';
    rabbitHead.style.position = 'absolute';
    rabbitHead.style.left = '20px';
    rabbitHead.style.top = '30px';
    rabbitHead.style.boxShadow = '0 0 10px #32b288';
    rabbitContainer.appendChild(rabbitHead);
    
    // Уши
    const leftEar = document.createElement('div');
    leftEar.style.width = '15px';
    leftEar.style.height = '40px';
    leftEar.style.backgroundColor = '#32b288';
    leftEar.style.position = 'absolute';
    leftEar.style.left = '25px';
    leftEar.style.top = '-10px';
    leftEar.style.boxShadow = '0 0 10px #32b288';
    rabbitContainer.appendChild(leftEar);
    
    const rightEar = document.createElement('div');
    rightEar.style.width = '15px';
    rightEar.style.height = '40px';
    rightEar.style.backgroundColor = '#32b288';
    rightEar.style.position = 'absolute';
    rightEar.style.left = '60px';
    rightEar.style.top = '-10px';
    rightEar.style.boxShadow = '0 0 10px #32b288';
    rabbitContainer.appendChild(rightEar);
    
    // Тело
    const body = document.createElement('div');
    body.style.width = '50px';
    body.style.height = '40px';
    body.style.backgroundColor = '#32b288';
    body.style.position = 'absolute';
    body.style.left = '25px';
    body.style.top = '90px';
    body.style.boxShadow = '0 0 10px #32b288';
    rabbitContainer.appendChild(body);
    
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
    
    if (pixelRabbit) {
        // Вращаем модель кролика
        pixelRabbit.rotation.x += 0.003;
        pixelRabbit.rotation.y += 0.008;
        
        // Интерактивное движение в зависимости от положения курсора
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.01;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.01;
        
                // Пульсация размера
        const pulseFactor = Math.sin(elapsedTime * 1.5) * 0.05 + 1;
        pixelRabbit.scale.set(pulseFactor, pulseFactor, pulseFactor);
        
        // Добавляем небольшое покачивание ушей
        if (pixelRabbit.children) {
            const earMovement = Math.sin(elapsedTime * 3) * 0.1;
            pixelRabbit.children[1].rotation.z = earMovement; // левое ухо
            pixelRabbit.children[3].rotation.z = -earMovement; // правое ухо
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
