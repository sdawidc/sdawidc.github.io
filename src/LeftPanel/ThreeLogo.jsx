import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { AsciiEffect } from "../Renderers/AsciiEffect.js";

function ThreeLogo({
  ascii = false,
  text: label = "Dawid Ciesielski",
  invert = false,
}) {
  const containerRef = useRef(null);
  const asciiRef = useRef(ascii);

  useEffect(() => {
    asciiRef.current = ascii;
  }, [ascii]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationId = null;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      alpha: !invert,
      antialias: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, invert);

    container.appendChild(renderer.domElement);

    const asciiEffect = new AsciiEffect(renderer, {
      cellSize: window.innerWidth < 800 ? 2 : 3,
      color: "#00e5ff",
      invert: invert,
    });

    asciiEffect.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.3);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0, 0.2, 4);
    light.distance = 8;

    const group = new THREE.Group();

    scene.add(group);
    //group.add(light);

    let video = document.createElement("video");
    let videoTexture = null;
    let videoGeometry = null;
    let videoMaterial = null;
    let videoMesh = null;

    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";
    video.style.display = "none";

    document.body.appendChild(video);

    videoTexture = new THREE.VideoTexture(video);

    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;

    videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    videoGeometry = new THREE.PlaneGeometry(12, 9);

    videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    videoMesh.position.set(0, -1.5, 0);
    group.add(videoMesh);

    const defaultVideo = "/marketsim.mp4";

    function changeVideo(event) {
      const src = event.detail || defaultVideo;
      if (!video) return;

      video.pause();
      video.src = src;
      video.load();

      video.play().catch((err) => {
        //console.log(err);
      });
    }

    window.addEventListener("three-logo-video", changeVideo);

    changeVideo({ detail: defaultVideo });

    let textGeometry = null;
    let textMaterial = null;
    let textMesh = null;

    const fontLoader = new FontLoader();

    fontLoader.load("/fonts/Alba_Regular.typeface.json", (font) => {
      if (disposed) return;

      textGeometry = new TextGeometry(label, {
        font,
        size: 1.4,
        depth: 0.2,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 1,
      });

      textGeometry.center();

      textMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.45,
        metalness: 0,
      });

      textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.set(0, 5, 0.5);

      group.add(textMesh);
    });

    const targetLight = new THREE.Vector3(0, 0.2, 4);

    let mouseOver = false;

    function handleMouseMove(event) {
      const rect = container.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetLight.set(x * 5, y * 3, 2);

      mouseOver = true;
    }

    function handleMouseLeave() {
      mouseOver = false;
    }

    container.addEventListener("mousemove", handleMouseMove);

    container.addEventListener("mouseleave", handleMouseLeave);

    function animate(time) {
      if (disposed) return;

      animationId = requestAnimationFrame(animate);

      group.rotation.y = Math.sin(time * 0.001) * 0.4;

      //light.position.lerp(targetLight, 0.08);

      if (!mouseOver) {
        //targetLight.set(Math.sin(time * 0.0007) * 4.2, 5, 2);
      }

      if (asciiRef.current) {
        asciiEffect.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
    }

    animate(0);

    function handleResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      asciiEffect.setSize(w, h);
      asciiEffect.setCellSize(window.innerWidth < 800 ? 2 : 3);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      window.removeEventListener("resize", handleResize);

      window.removeEventListener("three-logo-video", changeVideo);

      container.removeEventListener("mousemove", handleMouseMove);

      container.removeEventListener("mouseleave", handleMouseLeave);

      video.pause();
      video.removeAttribute("src");
      video.load();

      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }

      videoTexture?.dispose();
      videoGeometry?.dispose();
      videoMaterial?.dispose();

      textGeometry?.dispose();
      textMaterial?.dispose();

      asciiEffect.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [label]);

  return <div ref={containerRef} className="three-logo" />;
}

export default ThreeLogo;
