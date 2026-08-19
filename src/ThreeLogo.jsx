import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";

function ThreeLogo({ ascii }) {
  const containerRef = useRef(null);
  const asciiMode = useRef(ascii);
  const rendererRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    asciiMode.current = ascii;

    const container = containerRef.current;
    const renderer = rendererRef.current;
    const effect = effectRef.current;

    if (!container || !renderer || !effect) return;

    if (ascii) {
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      if (effect.domElement.parentNode !== container) {
        container.appendChild(effect.domElement);
      }
    } else {
      if (effect.domElement.parentNode === container) {
        container.removeChild(effect.domElement);
      }

      if (renderer.domElement.parentNode !== container) {
        container.appendChild(renderer.domElement);
      }
    }
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

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );

    camera.position.set(0, 1, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const effect = new AsciiEffect(renderer, " .:-=+*#%@", {
      invert: true,
      resolution: 0.3,
    });

    effect.setSize(container.clientWidth, container.clientHeight);

    rendererRef.current = renderer;
    effectRef.current = effect;

    if (asciiMode.current) {
      container.appendChild(effect.domElement);
    } else {
      container.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 100); //reversed light because of alpha renderer background

    light.position.set(0, 1, 2);
    scene.add(light);

    const loader = new FontLoader();

    loader.load(
      "/fonts/Alba_Regular.typeface.json",
      (font) => {
        if (disposed) return;

        geometry = new TextGeometry("ciessDev", {
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

        textMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
        });

        text = new THREE.Mesh(geometry, textMaterial);

        scene.add(text);

        function animate() {
          if (!text) return;

          text.rotation.y += 0.01;

          if (asciiMode.current) {
            camera.position.x = -2.8;
            effect.render(scene, camera);
          } else {
            camera.position.x = 0.0;
            renderer.render(scene, camera);
          }

          frameId = requestAnimationFrame(animate);
        }

        animate();
      },
      undefined,
      (error) => {
        console.error("Font loading error:", error);
      },
    );

    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);

      if (text) {
        scene.remove(text);
      }

      if (geometry) {
        geometry.dispose();
      }

      if (textMaterial) {
        textMaterial.dispose();
      }

      renderer.dispose();

      if (effect.domElement.parentNode === container) {
        container.removeChild(effect.domElement);
      }

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      rendererRef.current = null;
      effectRef.current = null;
    };
  }, []);

  return <div className="three-logo" ref={containerRef} />;
}

export default ThreeLogo;
