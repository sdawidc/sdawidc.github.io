import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

class AsciiRenderer {
  constructor(canvas, fontSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.chars = " .:-=+*#%@";
    this.fontSize = fontSize;
    this.background = "transparent";

    this.sourceCanvas = document.createElement("canvas");
    this.sourceCtx = this.sourceCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.cols = Math.floor(width / this.fontSize);
    this.rows = Math.floor(height / (this.fontSize * 2));

    this.sourceCanvas.width = this.cols;
    this.sourceCanvas.height = this.rows;
  }

  render(sourceCanvas) {
    const { cols, rows } = this;

    if (!cols || !rows) return;

    this.sourceCtx.clearRect(0, 0, cols, rows);
    this.sourceCtx.drawImage(sourceCanvas, 0, 0, cols, rows);

    const imageData = this.sourceCtx.getImageData(0, 0, cols, rows);
    const data = imageData.data;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "#00e5ff";
    this.ctx.imageSmoothingEnabled = false;
    const cellWidth = this.canvas.width / cols;
    const cellHeight = this.canvas.height / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = (y * cols + x) * 4;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        if (a === 0) continue;

        const brightness = 0.299 * r + 0.587 * g + 0.114 * b; //rgb to luminance https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color

        const charIndex = Math.floor(
          (brightness / 255) * (this.chars.length - 1),
        );

        const char = this.chars[charIndex];

        this.ctx.fillText(
          char,
          x * cellWidth + cellWidth / 2,
          y * cellHeight + cellHeight / 2,
        );
      }
    }
  }

  dispose() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sourceCtx.clearRect(
      0,
      0,
      this.sourceCanvas.width,
      this.sourceCanvas.height,
    );
  }
}

function ThreeLogo({ ascii }) {
  const containerRef = useRef(null);

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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    });

    renderer.domElement.style.display = "none"; // ascii override
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const asciiCanvas = document.createElement("canvas");

    container.appendChild(asciiCanvas);

    const getFontSize = (width) => {
      if (width < 400) return 2;
      if (width < 800) return 3;
      return 4;
    };
    const asciiRenderer = new AsciiRenderer(asciiCanvas, getFontSize(width));

    asciiRenderer.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);

    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 20);

    light.position.set(0, 0.2, 2);

    scene.add(light);

    const logoGroup = new THREE.Group();
    scene.add(logoGroup);
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

        logoGroup.add(text);

        const FPS = 10;
        const frameInterval = 1000 / FPS;
        let lastFrameTime = 0;
        const rotationRange = 0.4;
        const rotationSpeed = 0.001;

        function animate(currentTime) {
          if (!text || disposed) return;

          frameId = requestAnimationFrame(animate);

          if (currentTime - lastFrameTime < frameInterval) {
            return;
          }

          lastFrameTime = currentTime;

          text.rotation.y =
            Math.sin(currentTime * rotationSpeed) * rotationRange;

          renderer.render(scene, camera);

          asciiRenderer.render(renderer.domElement);
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

      asciiRenderer.fontSize = getFontSize(width);
      asciiRenderer.setSize(width, height);
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

      asciiRenderer.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      if (asciiCanvas.parentNode === container) {
        container.removeChild(asciiCanvas);
      }
    };
  }, []);

  return <div className="three-logo" ref={containerRef} />;
}

export default ThreeLogo;
