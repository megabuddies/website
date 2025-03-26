// Обновленная версия three-animation.js с моделью кролика
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
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Ограничиваем pixelRatio для оптимизации
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
    // Создаем геометрию кролика из примитивов
    const rabbitGroup = new THREE.Group();
    
    // Тело кролика
    const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1, 8, 8, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0x32b288,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    rabbitGroup.add(body);
    
    // Голова кролика
    const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 8, 8, 8);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0, 1.4, 0);
    rabbitGroup.add(head);
    
    // Уши кролика
    const earGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.2, 4, 8, 2);
    
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(-0.4, 2.2, 0);
    leftEar.rotation.z = Math.PI / 12;
    rabbitGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
    rightEar.position.set(0.4, 2.2, 0);
    rightEar.rotation.z = -Math.PI / 12;
    rabbitGroup.add(rightEar);
    
    // Лапки кролика
    const legGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4, 4, 4, 4);
    
    const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    frontLeftLeg.position.set(-0.5, -1.2, 0.3);
    rabbitGroup.add(frontLeftLeg);
    
    const frontRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    frontRightLeg.position.set(0.5, -1.2, 0.3);
    rabbitGroup.add(frontRightLeg);
    
    const backLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    backLeftLeg.position.set(-0.5, -1.2, -0.3);
    rabbitGroup.add(backLeftLeg);
    
    const backRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    backRightLeg.position.set(0.5, -1.2, -0.3);
    rabbitGroup.add(backRightLeg);
    
    // Хвост
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(0, -0.8, -0.7);
    rabbitGroup.add(tail);
    
    // Добавляем свечение
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x32b288,
        transparent: true,
        opacity: 0.3
    });
    
    const bodyGlow = new THREE.Mesh(bodyGeometry.clone(), glowMaterial);
    bodyGlow.scale.set(1.1, 1.1, 1.1);
    body.add(bodyGlow);
    
    const headGlow = new THREE.Mesh(headGeometry.clone(), glowMaterial);
    headGlow.scale.set(1.1, 1.1, 1.1);
    head.add(headGlow);
    
    // Масштабируем всего кролика
    rabbitGroup.scale.set(0.8, 0.8, 0.8);
    
    pixelRabbit = rabbitGroup;
    scene.add(pixelRabbit);
}

function createParticleSystem() {
    // Создаем систему частиц с оптимизированным количеством
    const particleCount = window.innerWidth < 768 ? 500 : 1000; // Меньше частиц на мобильных устройствах
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
    
    // Оптимизированный материал
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function createGrid() {
    // Создаем сетку для фона с новым цветом
    const gridSize = 50;
    const gridDivisions = 30; // Уменьшаем количество делений для оптимизации
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
    if (!heroSection) return;
    
    heroSection.style.background = 'radial-gradient(circle at center, rgba(50, 178, 136, 0.2) 0%, transparent 70%)';
    
    // Добавляем несколько "звезд"
    const starCount = window.innerWidth < 768 ? 50 : 100; // Меньше звезд на мобильных устройствах
    for (let i = 0; i < starCount; i++) {
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
    
    // Добавляем простую 2D анимацию кролика
    const rabbit = document.createElement('div');
    rabbit.style.position = 'absolute';
    rabbit.style.left = '50%';
    rabbit.style.top = '50%';
    rabbit.style.transform = 'translate(-50%, -50%)';
    rabbit.style.width = '100px';
    rabbit.style.height = '100px';
    rabbit.style.backgroundColor = 'transparent';
    rabbit.style.boxShadow = '0 0 20px rgba(50, 178, 136, 0.5)';
    rabbit.style.animation = 'rabbitPulse 3s infinite alternate';
    rabbit.innerHTML = `
        <div style="position: absolute; width: 50px; height: 70px; border: 2px solid #32b288; left: 25px; top: 30px;"></div>
        <div style="position: absolute; width: 40px; height: 40px; border: 2px solid #32b288; left: 30px; top: 0;"></div>
        <div style="position: absolute; width: 10px; height: 40px; border: 2px solid #32b288; left: 20px; top: -20px; transform: rotate(-10deg);"></div>
        <div style="position: absolute; width: 10px; height: 40px; border: 2px solid #32b288; left: 70px; top: -20px; transform: rotate(10deg);"></div>
    `;
    
    heroSection.appendChild(rabbit);
    
    style.textContent += `
        @keyframes rabbitPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(1.1); }
        }
    `;
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
        pixelRabbit.rotation.x += 0.003; // Уменьшаем скорость вращения для плавности
        pixelRabbit.rotation.y += 0.007;
        
        // Интерактивное движение в зависимости от положения курсора
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.01;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.01;
        
        // Пульсация размера
        const pulseFactor = Math.sin(elapsedTime * 1.5) * 0.05 + 1; // Уменьшаем частоту для плавности
        pixelRabbit.scale.set(pulseFactor * 0.8, pulseFactor * 0.8, pulseFactor * 0.8);
        
        // Анимация ушей кролика
        if (pixelRabbit.children[2] && pixelRabbit.children[3]) {
            pixelRabbit.children[2].rotation.z = Math.PI / 12 + Math.sin(elapsedTime * 2) * 0.1;
            pixelRabbit.children[3].rotation.z = -Math.PI / 12 - Math.sin(elapsedTime * 2) * 0.1;
        }
    }
    
    // Вращаем систему частиц с оптимизированной скоростью
    if (particleSystem) {
        particleSystem.rotation.x += 0.0003;
        particleSystem.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
}

// Оптимизированная инициализация Three.js с проверкой поддержки WebGL
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем поддержку WebGL
    if (window.WebGLRenderingContext) {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl && gl instanceof WebGLRenderingContext) {
                initThree();
            } else {
                createFallbackAnimation();
            }
        } catch (error) {
            console.error("Ошибка при проверке WebGL:", error);
            createFallbackAnimation();
        }
    } else {
        createFallbackAnimation();
    }
});
