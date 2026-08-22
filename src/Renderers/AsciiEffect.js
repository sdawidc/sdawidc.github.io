import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D tDiffuse;
  uniform sampler2D tCharacters;
  uniform vec2 resolution;
  uniform float cellSize;
  uniform float charCount;
  uniform vec3 color;
  uniform bool invert;

  varying vec2 vUv;

  void main() {
    vec2 cells = floor(resolution / cellSize);
    vec2 cellUvSize = 1.0 / cells;

    vec2 cellCoord = floor(vUv / cellUvSize);
    vec2 cellCenterUv = (cellCoord + 0.5) * cellUvSize;

    vec4 srcColor = texture2D(tDiffuse, cellCenterUv);
    float brightness = dot(
    srcColor.rgb,
    vec3(0.299, 0.587, 0.114)
);

brightness = clamp(brightness * 2.5, 0.0, 1.0);
    if (invert) brightness = 1.0 - brightness;

    float charIndex = floor(brightness * (charCount - 1.0));

    vec2 localUv = fract(vUv / cellUvSize);
    vec2 charUv = vec2((charIndex + localUv.x) / charCount, localUv.y);

    float glyphAlpha = texture2D(tCharacters, charUv).a;

    gl_FragColor = vec4(color, glyphAlpha * srcColor.a);
  }
`;

function createCharacterAtlas(chars, fontSize = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = fontSize * chars.length;
  canvas.height = fontSize;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${Math.floor(fontSize * 0.9)}px monospace`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(
      chars[i],
      i * fontSize + fontSize / 2,
      fontSize / 2 + fontSize * 0.05,
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export class AsciiEffect {
  constructor(
    renderer,
    {
      chars = " .,:;irsXA253hMHGS#9B&@",
      cellSize = 10,
      color = "#ffffff",
      invert = true,
    } = {},
  ) {
    this.renderer = renderer;
    this.chars = chars;

    this.renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    this.charTexture = createCharacterAtlas(chars);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: this.renderTarget.texture },
        tCharacters: { value: this.charTexture },
        resolution: { value: new THREE.Vector2(1, 1) },
        cellSize: { value: cellSize },
        charCount: { value: chars.length },
        color: { value: new THREE.Color(color) },
        invert: { value: invert },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
    });

    this.quadScene = new THREE.Scene();
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.material,
    );
    this.quadScene.add(this.quadMesh);
  }

  setSize(width, height) {
    this.renderTarget.setSize(width, height);
    this.material.uniforms.resolution.value.set(width, height);
  }

  setCellSize(cellSize) {
    this.material.uniforms.cellSize.value = cellSize;
  }

  render(scene, camera) {
    const renderer = this.renderer;
    const prevTarget = renderer.getRenderTarget();
    const prevAutoClear = renderer.autoClear;

    renderer.setRenderTarget(this.renderTarget);
    renderer.autoClear = true;
    renderer.clear();
    renderer.render(scene, camera);

    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAutoClear;
    renderer.render(this.quadScene, this.quadCamera);
  }

  dispose() {
    this.renderTarget.dispose();
    this.charTexture.dispose();
    this.material.dispose();
    this.quadMesh.geometry.dispose();
  }
}
