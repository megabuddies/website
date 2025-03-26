// Обновленная версия three-animation.js с использованием пиксельного кролика
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
    // Создаем группу для всех элементов кролика
    pixelRabbit = new THREE.Group();
    
    // Основное тело кролика (белое)
    const bodyGeometry = new THREE.BoxGeometry(1.6, 1.4, 0.2);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    pixelRabbit.add(body);
    
    // Голова кролика (белая)
    const headGeometry = new THREE.BoxGeometry(1.8, 1.2, 0.2);
    const headMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.3;
    pixelRabbit.add(head);
    
    // Уши кролика (черная обводка)
    const earOutlineGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.1);
    const earOutlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: false
    });
    
    // Левое ухо (черная обводка)
    const leftEarOutline = new THREE.Mesh(earOutlineGeometry, earOutlineMaterial);
    leftEarOutline.position.set(-0.5, 2.1, 0);
    pixelRabbit.add(leftEarOutline);
    
    // Правое ухо (черная обводка)
    const rightEarOutline = new THREE.Mesh(earOutlineGeometry, earOutlineMaterial);
    rightEarOutline.position.set(0.5, 2.1, 0);
    pixelRabbit.add(rightEarOutline);
    
    // Внутренняя часть ушей (розовая)
    const earInnerGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.12);
    const earInnerMaterial = new THREE.MeshBasicMaterial({
        color: 0xf7a18c, // Розовый цвет для внутренней части ушей
        wireframe: false
    });
    
    // Левое ухо (внутренняя часть)
    const leftEarInner = new THREE.Mesh(earInnerGeometry, earInnerMaterial);
    leftEarInner.position.set(-0.5, 2.1, 0.02);
    pixelRabbit.add(leftEarInner);
    
    // Правое ухо (внутренняя часть)
    const rightEarInner = new THREE.Mesh(earInnerGeometry, earInnerMaterial);
    rightEarInner.position.set(0.5, 2.1, 0.02);
    pixelRabbit.add(rightEarInner);
    
    // Глаза (черные)
    const eyeGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.12);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: false
    });
    
    // Левый глаз
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 1.3, 0.12);
    pixelRabbit.add(leftEye);
    
    // Правый глаз
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 1.3, 0.12);
    pixelRabbit.add(rightEye);
    
    // Нос (черный)
    const noseGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.12);
    const noseMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: false
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 1.1, 0.12);
    pixelRabbit.add(nose);
    
    // Черная обводка для тела и головы
    const outlineGeometry = new THREE.BoxGeometry(2, 2.8, 0.15);
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        transparent: true,
        opacity: 1
    });
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outline.position.y = 0.7;
    pixelRabbit.add(outline);
    
    // Добавляем зеленую подставку (трава)
    const grassGeometry = new THREE.BoxGeometry(2.2, 0.3, 0.2);
    const grassMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aa00,
        wireframe: false
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.y = -1;
    pixelRabbit.add(grass);
    
    // Масштабируем и добавляем на сцену
    pixelRabbit.scale.set(0.8, 0.8, 0.8);
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
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.02;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.02;
        
        // Пульсация размера
        const pulseFactor = Math.sin(elapsedTime * 2) * 0.05 + 1;
        pixelRabbit.scale.set(pulseFactor * 0.8, pulseFactor * 0.8, pulseFactor * 0.8);
        
        // Легкое покачивание вверх-вниз
        pixelRabbit.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
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
