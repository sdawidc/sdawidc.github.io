import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AsciiEffect } from "./Renderers/AsciiEffect.js";
import { clamp } from "three/src/math/MathUtils.js";

function ThreeLogo({ ascii = true, text: label = "ciess.dev", cellSize = 8 }) {
  const containerRef = useRef(null);
  const asciiMode = useRef(ascii);

  useEffect(() => {
    asciiMode.current = ascii;
  }, [ascii]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let geometry = null;
    let textMaterial = null;
    let text = null;
    let frameId = null;

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    function getAsciiCellSize(width) {
      if (width < 800) return 4;
      if (width < 1200) return 6;
      return 8;
    }

    const asciiEffect = new AsciiEffect(renderer, {
      cellSize: getAsciiCellSize(width),
      color: "#00e5ff",
      invert: false,
    });
    asciiEffect.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 50);
    light.castShadow = false;
    light.distance = 8;
    light.position.set(0, 0.2, 4);
    //scene.add(light);

    const logoGroup = new THREE.Group();
    logoGroup.add(light);
    scene.add(logoGroup);

    //light on scene following mouse
    const mouse = new THREE.Vector2();
    const targetLightPosition = new THREE.Vector3(0, 0.2, 4);
    let isMouseOver = false;
    function handleMouseMove(event) {
      isMouseOver = true;
      const rect = container.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetLightPosition.x = mouse.x * 5;
      targetLightPosition.y = mouse.y * 3;
      targetLightPosition.z = 2;
    }
    function onMouseOut(event) {
      isMouseOver = false;
    }
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseout", onMouseOut);
    const loader = new FontLoader();
    loader.load(
      "/fonts/Alba_Regular.typeface.json",
      (font) => {
        if (disposed) return;

        geometry = new TextGeometry(label, {
          font,
          size: 2.4,
          depth: 0.2,
          curveSegments: 3,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 1,
        });
        geometry.center();

        textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        text = new THREE.Mesh(geometry, textMaterial);
        logoGroup.add(text);

        const FPS = 60;
        const frameInterval = 1000 / FPS;
        let lastFrameTime = 0;
        const rotationRange = 0.4;
        const rotationSpeed = 0.001;

        const lightRange = 4.2;
        const lightSpeed = 0.0007;

        function animate(currentTime) {
          if (!text || disposed) return;

          frameId = requestAnimationFrame(animate);

          if (currentTime - lastFrameTime < frameInterval) return;
          lastFrameTime = currentTime;

          logoGroup.rotation.y =
            Math.sin(currentTime * rotationSpeed) * rotationRange;

          light.position.lerp(targetLightPosition, 0.08);
          if (!isMouseOver) {
            targetLightPosition.set(
              Math.sin(currentTime * lightSpeed) * lightRange,
              0.2,
              2,
            );
          }
          if (asciiMode.current) {
            asciiEffect.render(scene, camera);
          } else {
            renderer.render(scene, camera);
          }
        }

        animate(0);
      },
      undefined,
      (error) => console.error("Font loading error:", error),
    );

    function handleResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      const ratio = renderer.getPixelRatio();
      asciiEffect.setSize(w, h);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      if (text) scene.remove(text);
      if (geometry) geometry.dispose();
      if (textMaterial) textMaterial.dispose();

      asciiEffect.dispose();
      renderer.dispose();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseout", onMouseOut);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [label, cellSize]);

  return <div className="three-logo" ref={containerRef} />;
}

export default ThreeLogo;
