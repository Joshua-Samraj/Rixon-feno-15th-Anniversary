gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ringGeometry = new THREE.TorusGeometry(2, 0.12, 32, 100);
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.9,
    roughness: 0.2
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(ring);

const imageGeometry = new THREE.CircleGeometry(1.85, 64);
const textureLoader = new THREE.TextureLoader();

const images = [
    textureLoader.load('image1.jpg'),
    textureLoader.load('image2.jpg'),
    textureLoader.load('image3.jpg'),
    textureLoader.load('image4.jpg')
];

const imageMaterial = new THREE.MeshBasicMaterial({ 
    map: images[0], 
    side: THREE.DoubleSide,
    transparent: true
});
const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
ring.add(imageMesh);

camera.position.z = 6;

gsap.to(".header-text, .subtitle-text", {
    opacity: 0,
    y: -50,
    scrollTrigger: {
        trigger: ".header-section",
        start: "top top",
        end: "bottom center",
        scrub: true
    }
});

let flipCount = 0;
gsap.to(ring.rotation, {
    y: Math.PI * 6,
    scrollTrigger: {
        trigger: ".flip-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const newFlipCount = Math.floor(progress * 6);
            
            if (newFlipCount !== flipCount && newFlipCount % 2 !== 0) {
                flipCount = newFlipCount;
                const imageIndex = Math.floor(flipCount / 2) % images.length;
                imageMaterial.map = images[imageIndex];
                imageMaterial.needsUpdate = true;
            }
        }
    }
});

gsap.to(ring.position, {
    x: -3,
    scrollTrigger: {
        trigger: ".invitation-section",
        start: "top bottom",
        end: "center center",
        scrub: true,
        onEnter: () => {
            textureLoader.load('couple-avatar.png', (tex) => {
                imageMaterial.map = tex;
                imageMaterial.needsUpdate = true;
            });
        },
        onLeaveBack: () => {
            imageMaterial.map = images[images.length - 1];
            imageMaterial.needsUpdate = true;
        }
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();