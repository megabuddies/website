// Обновленная версия three-animation.js с разделенным фоном и моделью
let scene, camera, renderer;
let backgroundScene, backgroundCamera, backgroundRenderer;
let particleSystem, pixelRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();
let leftEarPivot, rightEarPivot;
let resourcesLoaded = false;
let animationPaused = false;

// Проверка на мобильное устройство
const isMobile = window.innerWidth <= 768;

function initThree() {
    // Сразу инициализируем фон для быстрого отображения
    try {
        initFullscreenBackground();
    } catch (error) {
        console.error("Ошибка инициализации фона Three.js:", error);
    }
    
    // Загружаем 3D модель с задержкой, чтобы приоритет был у загрузки страницы
    setTimeout(() => {
        // Создаем менеджер загрузки для трекинга загрузки ресурсов
        const loadingManager = new THREE.LoadingManager();
        
        loadingManager.onLoad = function() {
            try {
                // Инициализация 3D модели в контейнере
                // (фон уже загружен ранее)
                initModelInContainer();
                
                document.addEventListener('mousemove', onDocumentMouseMove);
                window.addEventListener('resize', onWindowResize);
                
                // Добавляем слушатели видимости страницы для оптимизации производительности
                document.addEventListener('visibilitychange', handleVisibilityChange);
                
                resourcesLoaded = true;
            } catch (error) {
                console.error("Ошибка инициализации модели Three.js:", error);
                createFallbackAnimation();
            }
        };
        
        loadingManager.onError = function(url) {
            console.error("Ошибка загрузки ресурса:", url);
            createFallbackAnimation();
        };
        
        // Имитируем загрузку ресурсов (или здесь можно добавить реальную загрузку)
        loadingManager.itemStart("model");
        
        // Асинхронная загрузка 3D модели
        setTimeout(() => {
            loadingManager.itemEnd("model");
        }, 100);
    }, 1500);  // Задержка в 1.5 секунды для приоритизации загрузки страницы
    
    // Запускаем анимацию сразу (для фона)
    animate();
}

// Обработчик видимости страницы для экономии ресурсов
function handleVisibilityChange() {
    if (document.hidden) {
        // Если страница не видна, приостанавливаем анимацию
        animationPaused = true;
    } else {
        // Если страница становится видна, возобновляем анимацию
        animationPaused = false;
    }
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
        antialias: true,
        powerPreference: "high-performance"
    });
    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
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
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
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
    
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1.5, 8, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.set(0, 0, 0);
    pixelRabbit.add(body);
    
    const headGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 8, 8, 8);
    const head = new THREE.Mesh(headGeometry, material);
    head.position.set(-1.2, 0.5, 0);
    pixelRabbit.add(head);
    
    const noseGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const noseMaterial = new THREE.MeshBasicMaterial({
        color: 0xfeccea,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(-1.8, 0.5, 0);
    pixelRabbit.add(nose);
    
    const eyeGeometry = new THREE.SphereGeometry(0.15, 12, 8);
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
    
    const earGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.2, 4, 8, 2);
    
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
    
    const legGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4, 4, 6, 4);
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
    
    const tailGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(1.2, 0, 0);
    pixelRabbit.add(tail);
    
    // Уменьшаем масштаб модели кролика на 15% (с 1.6 до 1.36)
    pixelRabbit.scale.set(1.2, 1.2, 1.2);
    
    scene.add(pixelRabbit);
}

function createParticleSystem() {
    const particleCount = 1500; // Увеличиваем количество частиц для фона
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
    const gridSize = 80;  // Увеличиваем размер сетки
    const gridDivisions = 80;
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
    
    for (let i = 0; i < 100; i++) {
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
    
    // Если анимация приостановлена, пропускаем отрисовку для экономии ресурсов
    if (animationPaused) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    // Анимация фона - увеличиваем скорость вращения
    if (particleSystem) {
        particleSystem.rotation.x += 0.0008;
        particleSystem.rotation.y += 0.001;
        
        // Добавляем реакцию на движение мыши для фона
        particleSystem.rotation.x += (mouseY * 0.0001);
        particleSystem.rotation.y += (mouseX * 0.0001);
    }
    
    // Рендеринг фона (всегда отображаем фон, даже если модель не загружена)
    if (backgroundRenderer && backgroundScene && backgroundCamera) {
        backgroundRenderer.render(backgroundScene, backgroundCamera);
    }
    
    // Анимация 3D модели только после полной загрузки ресурсов
    if (pixelRabbit && resourcesLoaded) {
        pixelRabbit.rotation.y += 0.01;
        
        pixelRabbit.rotation.x += (mouseY - pixelRabbit.rotation.x * 0.1) * 0.02;
        pixelRabbit.rotation.y += (mouseX - pixelRabbit.rotation.y * 0.1) * 0.02;
        
        // Пульсация с учетом уменьшенного размера модели
        const pulseFactor = Math.sin(elapsedTime * 2) * 0.05 + 1;
        pixelRabbit.scale.set(pulseFactor * 1.2, pulseFactor * 1.2, pulseFactor * 1.2);
        
        // Анимируем уши через контейнеры
        if (leftEarPivot && rightEarPivot) {
            // Используем разную частоту и фазовый сдвиг для каждого уха
            leftEarPivot.rotation.z = Math.PI / 12 + Math.sin(elapsedTime * 1.3) * 0.12;
            rightEarPivot.rotation.z = -Math.PI / 12 + Math.sin(elapsedTime * 1.7 + Math.PI/3) * 0.09;
        }

        if (pixelRabbit.children[3] && pixelRabbit.children[4]) {
            const leftEye = pixelRabbit.children[3];
            const rightEye = pixelRabbit.children[4];
            
            const blinkFactor = Math.sin(elapsedTime * 3) > 0.95 ? 0.2 : 1;
            leftEye.scale.set(1, blinkFactor, 1);
            rightEye.scale.set(1, blinkFactor, 1);
        }
        
        if (pixelRabbit.children[2]) {
            const nose = pixelRabbit.children[2];
            
            const nosePulse = Math.sin(elapsedTime * 1.5) * 0.1 + 1;
            nose.scale.set(nosePulse, nosePulse, nosePulse);
        }
        
        // Анимация ног
        if (pixelRabbit.children[7] && pixelRabbit.children[8] && 
            pixelRabbit.children[9] && pixelRabbit.children[10]) {
            
            const frontLeftLeg = pixelRabbit.children[7];
            const frontRightLeg = pixelRabbit.children[8];
            const backLeftLeg = pixelRabbit.children[9];
            const backRightLeg = pixelRabbit.children[10];
            
            frontLeftLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5) * 0.1;
            frontRightLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 + Math.PI) * 0.1;
            backLeftLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5 + Math.PI) * 0.1;
            backRightLeg.position.y = -0.95 + Math.sin(elapsedTime * 1.5) * 0.1;
            
            // Добавляем небольшое вращение для более естественного движения
            frontLeftLeg.rotation.x = Math.sin(elapsedTime * 1.5) * 0.3;
            frontRightLeg.rotation.x = Math.sin(elapsedTime * 1.5 + Math.PI) * 0.3;
            backLeftLeg.rotation.x = Math.sin(elapsedTime * 1.5 + Math.PI) * 0.3;
            backRightLeg.rotation.x = Math.sin(elapsedTime * 1.5) * 0.3;
        }
        
        // Рендеринг 3D модели, только если все ресурсы загружены
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
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

// Регулировка настроек для производительности
if (isMobile) {
    // Уменьшаем качество рендеринга для мобильных устройств
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    // Уменьшаем количество частиц
    let particleReductionFactor = window.innerWidth <= 576 ? 0.3 : 0.5;
    
    // Применяем к существующим системам частиц
    if (typeof particlesCount !== 'undefined') {
        particlesCount = Math.floor(particlesCount * particleReductionFactor);
    }
    
    // Уменьшаем кол-во треугольников в геометриях
    if (typeof backgroundParticles !== 'undefined' && backgroundParticles.geometry) {
        const geometryVertexCount = backgroundParticles.geometry.attributes.position.count;
        const reducedCount = Math.floor(geometryVertexCount * particleReductionFactor);
        
        if (reducedCount < geometryVertexCount) {
            const tempPositions = new Float32Array(reducedCount * 3);
            const tempColors = new Float32Array(reducedCount * 3);
            const tempSizes = new Float32Array(reducedCount);
            
            // Копируем только часть данных
            for (let i = 0; i < reducedCount; i++) {
                tempPositions[i * 3] = backgroundParticles.geometry.attributes.position.array[i * 3];
                tempPositions[i * 3 + 1] = backgroundParticles.geometry.attributes.position.array[i * 3 + 1];
                tempPositions[i * 3 + 2] = backgroundParticles.geometry.attributes.position.array[i * 3 + 2];
                
                if (backgroundParticles.geometry.attributes.color) {
                    tempColors[i * 3] = backgroundParticles.geometry.attributes.color.array[i * 3];
                    tempColors[i * 3 + 1] = backgroundParticles.geometry.attributes.color.array[i * 3 + 1];
                    tempColors[i * 3 + 2] = backgroundParticles.geometry.attributes.color.array[i * 3 + 2];
                }
                
                if (backgroundParticles.geometry.attributes.size) {
                    tempSizes[i] = backgroundParticles.geometry.attributes.size.array[i];
                }
            }
            
            backgroundParticles.geometry.setAttribute('position', new THREE.BufferAttribute(tempPositions, 3));
            if (backgroundParticles.geometry.attributes.color) {
                backgroundParticles.geometry.setAttribute('color', new THREE.BufferAttribute(tempColors, 3));
            }
            if (backgroundParticles.geometry.attributes.size) {
                backgroundParticles.geometry.setAttribute('size', new THREE.BufferAttribute(tempSizes, 1));
            }
        }
    }
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Обновляем размеры камеры и рендерера
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Проверяем, изменился ли тип устройства
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile && typeof resizeRendererToDisplaySize === 'function') {
        // Вызываем функцию ресайза, если она существует
        resizeRendererToDisplaySize(renderer);
    }
});

// Функция для оптимизации размера рендерера
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    
    return needResize;
}
