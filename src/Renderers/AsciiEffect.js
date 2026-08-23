import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D tDiffuse;
  uniform sampler2D tCharacters;

  // rozdzielczosc css pixels
  uniform vec2 resolution;

  // rozmiar komorki w css pixels
  uniform float cellSize;

  uniform float charCount;
  uniform vec3 color;
  uniform bool invert;
  uniform float brightness;

  varying vec2 vUv;

  void main() {
    vec2 cells = max(
      floor(resolution / cellSize),
      vec2(1.0)
    );

    vec2 cellUvSize = 1.0 / cells;

    vec2 cellCoord = floor(vUv / cellUvSize);

    cellCoord = min(cellCoord, cells - 1.0);

    vec2 cellCenterUv =
      (cellCoord + 0.5) / cells;

    // probkowanie obrazu ze srodka komorki
    vec4 srcColor =
      texture2D(tDiffuse, cellCenterUv);

    float luminance = dot(
      srcColor.rgb,
      vec3(0.299, 0.587, 0.114)
    );

    luminance = clamp(
      luminance * brightness,
      0.0,
      1.0
    );

    if (invert) {
      luminance = 1.0 - luminance;
    }

    // wybieranie znaku
    float charIndex = floor(
      luminance * (charCount - 1.0)
    );

    // pozycja w aktualnej komorce
    vec2 localUv =
      fract(vUv * cells);

    // pozycja znaku w atalsie
    vec2 charUv = vec2(
      (charIndex + localUv.x) / charCount,
      localUv.y
    );

    float glyphAlpha =
      texture2D(
        tCharacters,
        charUv
      ).a;

    float alpha =
      glyphAlpha * srcColor.a;

    gl_FragColor = vec4(
      color,
      alpha
    );
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

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  // mipmampy zeby nie bylo moire przy probkowaniu znakow
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  texture.colorSpace = THREE.NoColorSpace;

  return texture;
}

export class AsciiEffect {
  constructor(
    renderer,
    {
      chars = " .,:;irsXA253hMHGS#9B&@",

      //css pixels
      cellSize = 10,

      color = "#ffffff",

      invert = true,

      brightness = 2.5,
    } = {},
  ) {
    this.renderer = renderer;

    this.chars = chars;

    this.cellSize = cellSize;

    this.width = 1;
    this.height = 1;

    this.pixelRatio = renderer.getPixelRatio();

    this.renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: true,
      stencilBuffer: false,
    });

    this.renderTarget.texture.colorSpace = renderer.outputColorSpace;

    this.charTexture = createCharacterAtlas(chars);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: {
          value: this.renderTarget.texture,
        },

        tCharacters: {
          value: this.charTexture,
        },
        //css resolution
        resolution: {
          value: new THREE.Vector2(1, 1),
        },

        cellSize: {
          value: cellSize,
        },

        charCount: {
          value: chars.length,
        },

        color: {
          value: new THREE.Color(color),
        },

        invert: {
          value: invert,
        },

        brightness: {
          value: brightness,
        },
      },

      vertexShader: VERTEX_SHADER,

      fragmentShader: FRAGMENT_SHADER,

      transparent: true,

      depthTest: false,

      depthWrite: false,
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
    this.width = Math.max(width, 1);
    this.height = Math.max(height, 1);
    this.pixelRatio = this.renderer.getPixelRatio();
    const renderWidth = Math.max(Math.ceil(this.width * this.pixelRatio), 1);
    const renderHeight = Math.max(Math.ceil(this.height * this.pixelRatio), 1);

    this.renderTarget.setSize(renderWidth, renderHeight);

    this.material.uniforms.resolution.value.set(this.width, this.height);
  }

  setCellSize(cellSize) {
    this.cellSize = Math.max(cellSize, 1);

    this.material.uniforms.cellSize.value = this.cellSize;
  }

  setBrightness(brightness) {
    this.material.uniforms.brightness.value = brightness;
  }

  setColor(color) {
    this.material.uniforms.color.value.set(color);
  }

  setInvert(invert) {
    this.material.uniforms.invert.value = invert;
  }

  render(scene, camera) {
    const renderer = this.renderer;

    const previousTarget = renderer.getRenderTarget();
    const previousAutoClear = renderer.autoClear;

    renderer.setRenderTarget(this.renderTarget);
    renderer.autoClear = true;
    renderer.clear();
    renderer.render(scene, camera);

    renderer.setRenderTarget(previousTarget);
    renderer.setViewport(0, 0, this.width, this.height);
    renderer.autoClear = previousAutoClear;

    renderer.render(this.quadScene, this.quadCamera);
  }

  dispose() {
    this.renderTarget.dispose();

    this.charTexture.dispose();

    this.material.dispose();

    this.quadMesh.geometry.dispose();
  }
}
