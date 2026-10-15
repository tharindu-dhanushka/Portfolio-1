import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uLightTheme;

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 point = (vUv - 0.5) * vec2(aspect, 1.0);
    float time = uTime * 0.12;

    vec2 centerA = vec2(sin(time) * 0.28, cos(time * 0.83) * 0.22);
    vec2 centerB = vec2(cos(time * 0.67) * 0.36, sin(time * 0.91) * 0.3);
    if (uPointer.x >= 0.0) {
      vec2 pointer = (uPointer - 0.5) * vec2(aspect, 1.0);
      centerA += pointer * 0.16;
      centerB -= pointer * 0.09;
    }

    float glowA = exp(-dot(point - centerA, point - centerA) * 3.8);
    float glowB = exp(-dot(point - centerB, point - centerB) * 5.2);
    float wave = 0.5 + 0.5 * sin(point.x * 5.0 + sin(point.y * 4.0 + time) * 1.4 + time);
    float intensity = glowA * 0.58 + glowB * 0.38 + wave * glowA * 0.12;

    vec3 deepBlue = mix(vec3(0.12, 0.28, 0.57), vec3(0.23, 0.43, 0.75), uLightTheme);
    vec3 paleBlue = mix(vec3(0.34, 0.57, 0.9), vec3(0.48, 0.65, 0.88), uLightTheme);
    vec3 color = mix(deepBlue, paleBlue, clamp(glowB * 0.75 + wave * 0.18, 0.0, 1.0));
    float alpha = clamp(intensity * mix(0.19, 0.15, uLightTheme), 0.0, 0.2);

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) || "Unknown shader compilation error.";
    gl.deleteShader(shader);
    throw new Error(error);
  }

  return shader;
}

function createProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program.");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) || "Unknown WebGL program linking error.";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  return program;
}

export default function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return undefined;

    let program;
    let buffer;
    try {
      program = createProgram(gl);
      buffer = gl.createBuffer();
      if (!buffer) throw new Error("Unable to create WebGL geometry buffer.");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const position = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    } catch (error) {
      console.error("Unable to initialize the animated WebGL background.", error);
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      return undefined;
    }

    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const themeLocation = gl.getUniformLocation(program, "uLightTheme");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const themeObserver = new MutationObserver(() => draw());
    let animationFrame = 0;
    let pointerX = -1;
    let pointerY = -1;
    let startTime = performance.now();
    let lastFrame = 0;

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    }

    function draw(now = performance.now()) {
      if (gl.isContextLost()) return;
      resize();
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(timeLocation, motionPreference.matches ? 0 : (now - startTime) / 1000);
      gl.uniform1f(themeLocation, document.documentElement.dataset.theme === "light" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function animate(now) {
      if (now - lastFrame >= 1000 / 30) {
        draw(now);
        lastFrame = now;
      }
      if (!motionPreference.matches && document.visibilityState === "visible") {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function startAnimation() {
      window.cancelAnimationFrame(animationFrame);
      draw();
      if (!motionPreference.matches && document.visibilityState === "visible") {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    function handlePointerMove(event) {
      pointerX = event.clientX / window.innerWidth;
      pointerY = 1 - event.clientY / window.innerHeight;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") startAnimation();
      else window.cancelAnimationFrame(animationFrame);
    }

    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionPreference.addEventListener("change", startAnimation);
    startAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionPreference.removeEventListener("change", startAnimation);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas className="ambient-canvas" ref={canvasRef} aria-hidden="true" />;
}
