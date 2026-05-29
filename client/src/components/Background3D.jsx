import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a2a);
    scene.fog = new THREE.FogExp2(0x0a0a2a, 0.002);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.PointLight(0x667eea, 0.5);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);
    
    const colorLight = new THREE.PointLight(0x764ba2, 0.5);
    colorLight.position.set(2, 1, 2);
    scene.add(colorLight);

    // Floating particles
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 100;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x667eea,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Rotating torus knots
    const torusKnotGeometry = new THREE.TorusKnotGeometry(1.2, 0.3, 200, 32, 3, 4);
    const torusKnotMaterial = new THREE.MeshPhongMaterial({
      color: 0x667eea,
      emissive: 0x1a0a3a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.set(2, 1, -3);
    scene.add(torusKnot);

    const torusKnot2Geometry = new THREE.TorusKnotGeometry(1, 0.25, 200, 32, 3, 4);
    const torusKnot2Material = new THREE.MeshPhongMaterial({
      color: 0x764ba2,
      emissive: 0x1a0a3a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const torusKnot2 = new THREE.Mesh(torusKnot2Geometry, torusKnot2Material);
    torusKnot2.position.set(-2, -1, -4);
    scene.add(torusKnot2);

    // Floating spheres
    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      emissive: 0x331111,
      metalness: 0.8,
      roughness: 0.2,
    });
    
    const spheres = [];
    for (let i = 0; i < 30; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
      sphere.userData = {
        speed: 0.005 + Math.random() * 0.01,
        radius: 3 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 5,
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6),
      };
      sphere.material.color = sphere.userData.color;
      sphere.material.emissive = sphere.userData.color.clone().multiplyScalar(0.3);
      scene.add(sphere);
      spheres.push(sphere);
    }

    // Animation variables
    let time = 0;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.008;
      
      // Rotate torus knots
      torusKnot.rotation.x += 0.005;
      torusKnot.rotation.y += 0.008;
      torusKnot.rotation.z += 0.003;
      
      torusKnot2.rotation.x -= 0.004;
      torusKnot2.rotation.y += 0.006;
      torusKnot2.rotation.z -= 0.005;
      
      // Animate particles
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0003;
      
      // Animate floating spheres
      spheres.forEach((sphere, idx) => {
        sphere.userData.angle += sphere.userData.speed;
        const x = Math.cos(sphere.userData.angle + idx) * sphere.userData.radius;
        const z = Math.sin(sphere.userData.angle * 0.7 + idx) * sphere.userData.radius;
        const y = Math.sin(sphere.userData.angle * 1.3 + idx) * 1.5 + sphere.userData.yOffset;
        sphere.position.set(x, y, z - 5);
      });
      
      // Pulsing lights
      const pulse = 0.5 + Math.sin(time * 2) * 0.2;
      colorLight.intensity = 0.3 + Math.sin(time * 1.5) * 0.2;
      backLight.intensity = 0.4 + Math.sin(time * 1.8) * 0.2;
      
      // Camera slight movement
      camera.position.x += (0 - camera.position.x) * 0.02;
      camera.position.y += (2 + Math.sin(time * 0.3) * 0.1 - camera.position.y) * 0.02;
      camera.lookAt(0, 0.5, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default Background3D;