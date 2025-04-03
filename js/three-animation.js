// Обновленная версия three-animation.js с разделенным фоном и моделью
let scene, camera, renderer;
let backgroundScene, backgroundCamera, backgroundRenderer;
let particleSystem, pixelRabbit;
let mouseX = 0, mouseY = 0;
let clock = new THREE.Clock();
let leftEarPivot, rightEarPivot;

function initThree() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = function() {
        try {
            // Инициализация фона на весь экран
            initFullscreenBackground();
            
            // Инициализация 3D модели в контейнере
            initModelInContainer();
            
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
    camera.position.z = 5;
    
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
    pixelRabbit = createPixelRabbit();
    scene.add(pixelRabbit);
}

function createPixelRabbit() {
    // Create a group to hold all the rabbit parts
    const rabbitGroup = new THREE.Group();

    // Create the body - main cube
    const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 0, 0);
    rabbitGroup.add(body);

    // Create the head - slightly smaller cube
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.9, 0);
    rabbitGroup.add(head);

    // Create the ears - two thin rectangles
    const earGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.1);
    const earMaterial = new THREE.MeshPhongMaterial({ color: 0xffccff });
    
    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.25, 1.5, 0);
    leftEar.rotation.z = -0.2;
    rabbitGroup.add(leftEar);
    
    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.25, 1.5, 0);
    rightEar.rotation.z = 0.2;
    rabbitGroup.add(rightEar);

    // Create eyes - small spheres
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 1, 0.35);
    rabbitGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 1, 0.35);
    rabbitGroup.add(rightEye);

    // Create nose - small sphere
    const noseGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xffcccc });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0.85, 0.4);
    rabbitGroup.add(nose);

    // Create feet - small cubes
    const footGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.5);
    const footMaterial = new THREE.MeshPhongMaterial({ color: 0xffccff });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.25, -0.6, 0.2);
    rabbitGroup.add(leftFoot);
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.25, -0.6, 0.2);
    rabbitGroup.add(rightFoot);
    
    // Add small tail 
    const tailGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const tailMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, -0.3, -0.6);
    rabbitGroup.add(tail);

    // Scale down the whole rabbit (reduced by 15% from 1.4)
    rabbitGroup.scale.set(1.19, 1.19, 1.19);
    
    return rabbitGroup;
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
    // Request the next animation frame for continuous rendering
    animationFrameId = requestAnimationFrame(animate);

    // Handle background animation
    const time = Date.now() * 0.001;
    
    // Rotate the background particles
    if (particleSystem) {
        particleSystem.rotation.x = time * 0.0008;
        particleSystem.rotation.y = time * 0.001;
    }

    // Pulse the rabbit to make it more dynamic
    if (pixelRabbit) {
        const pulseFactor = 1 + Math.sin(time * 2) * 0.03;
        // Use the reduced scale (1.19) as the base for the pulse effect
        pixelRabbit.scale.set(1.19 * pulseFactor, 1.19 * pulseFactor, 1.19 * pulseFactor);
        
        // Gentle rotation for the rabbit
        pixelRabbit.rotation.y = Math.sin(time * 0.5) * 0.3;
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
    try {
        initThree();
    } catch (error) {
        console.error("Ошибка инициализации Three.js:", error);
        createFallbackAnimation();
    }
});
