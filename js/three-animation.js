// Обновленная версия three-animation.js с использованием кролика
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
    
    // Создаем тело кролика - квадратное
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 8, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0x32b288,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = -0.2;
    pixelRabbit.add(body);
    
    // Создаем голову кролика
    const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 8, 8, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.2;
    pixelRabbit.add(head);
    
    // Добавляем нос
    const noseGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({
        color: 0xf7519b,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 1.2, 0.6);
    pixelRabbit.add(nose);
    
    // Добавляем глаза
    const eyeGeometry = new THREE.SphereGeometry(0.15, 12, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x44445c,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 1.3, 0.6);
    pixelRabbit.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 1.3, 0.6);
    pixelRabbit.add(rightEye);
    
    // Создаем уши кролика
    const earGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.2, 4, 8, 2);
    
    const leftEar = new THREE.Mesh(earGeometry, material);
    leftEar.position.set(-0.4, 2.2, 0);
    leftEar.rotation.z = Math.PI / 12;
    pixelRabbit.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, material);
    rightEar.position.set(0.4, 2.2, 0);
    rightEar.rotation.z = -Math.PI / 12;
    pixelRabbit.add(rightEar);
    
    // Создаем лапы кролика
    const legGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4, 4, 6, 4);
    
    const frontLeftLeg = new THREE.Mesh(legGeometry, material);
    frontLeftLeg.position.set(-0.5, -1.4, 0.3);
    pixelRabbit.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, material);
    frontRightLeg.position.set(0.5, -1.4, 0.3);
    pixelRabbit.add(frontRightLeg);
    
    const backLeftLeg = new THREE.Mesh(legGeometry, material);
    backLeftLeg.position.set(-0.5, -1.4, -0.3);
    pixelRabbit.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(legGeometry, material);
    backRightLeg.position.set(0.5, -1.4, -0.3);
    pixelRabbit.add(backRightLeg);
    
    // Создаем хвост кролика
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(0, -0.8, -0.8);
    pixelRabbit.add(tail);
    
    // Добавляем свечение
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x32b288,
        transparent: true,
        opacity: 0.3
    });
    
    // Создаем копию каждой части для свечения
    pixelRabbit.children.forEach(part => {
        const glowMesh = new THREE.Mesh(part.geometry.clone(), glowMaterial);
        glowMesh.position.copy(part.position);
        glowMesh.rotation.copy(part.rotation);
        glowMesh.scale.set(1.1, 1.1, 1.1);
        pixelRabbit.add(glowMesh);
    });
    
    // Масштабируем кролика до подходящего размера
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
        pixelRabbit.rotation.x += 0.005;
        pixelRabbit.rotation.y += 0.01;
        
        // Интерактивное движение в зависимости от положения курсора
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.02;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.02;
        
        // Пульсация размера
        const pulseFactor = Math.sin(elapsedTime * 2) * 0.05 + 1;
        pixelRabbit.scale.set(pulseFactor * 0.8, pulseFactor * 0.8, pulseFactor * 0.8);
        
        // Анимация ушей кролика
        if (pixelRabbit.children[5] && pixelRabbit.children[6]) {
            const leftEar = pixelRabbit.children[5];
            const rightEar = pixelRabbit.children[6];
            
            leftEar.rotation.z = Math.PI / 12 + Math.sin(elapsedTime * 1.5) * 0.1;
            rightEar.rotation.z = -Math.PI / 12 + Math.sin(elapsedTime * 1.5) * 0.1;
        }
        
        // Анимация глаз и носа
        if (pixelRabbit.children[2] && pixelRabbit.children[3] && pixelRabbit.children[4]) {
            const nose = pixelRabbit.children[2];
            const leftEye = pixelRabbit.children[3];
            const rightEye = pixelRabbit.children[4];
            
            // Небольшое мигание глаз
            const blinkFactor = Math.sin(elapsedTime * 3) > 0.95 ? 0.1 : 1;
            leftEye.scale.y = blinkFactor;
            rightEye.scale.y = blinkFactor;
            
            // Небольшая пульсация носа
            const nosePulse = Math.sin(elapsedTime * 1.5) * 0.1 + 1;
            nose.scale.set(nosePulse, nosePulse, nosePulse);
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
