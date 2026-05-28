'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Magical Breathing and Mouse Parallax (slowed down)
  float distanceToMouse = distance(uMouse, uv);
  float ripple = sin(distanceToMouse * 20.0 - uTime * 1.0) * 0.02 * uHover;
  
  // Parallax based on mouse (made extremely subtle)
  pos.x += uMouse.x * 0.02;
  pos.y += uMouse.y * 0.02;
  pos.z += ripple;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec2 uResolution;
uniform vec2 uImageRes;
varying vec2 vUv;

// Classic Perlin 2D Noise 
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); 
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Correct aspect ratio calculation for "object-fit: cover"
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageRes.x / uImageRes.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageRes.y / uImageRes.x), 1.0)
  );
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 1.0
  );
  
  // Ethereal noise distortion flowing upwards (slowed down)
  float noise = snoise(uv * 4.0 + vec2(0.0, -uTime * 0.05)) * 0.01;
  
  // Mouse hover ripple (slowed down)
  float dist = distance(uv, uMouse);
  float ripple = sin(dist * 30.0 - uTime * 1.5) * 0.005 * smoothstep(0.3, 0.0, dist) * uHover;
  
  uv.x += noise + ripple;
  uv.y += noise + ripple;

  vec4 texColor = texture2D(uTexture, uv);
  
  // Boost the gold/pink hues for that divine sunset look
  vec3 color = texColor.rgb;
  
  // Magical ethereal glow
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 glow = color * (luminance * 1.5) * (0.8 + 0.2 * sin(uTime * 2.0));
  
  // Mix original with glow
  vec3 finalColor = mix(color, glow, 0.3);
  
  gl_FragColor = vec4(finalColor, texColor.a);
}
`;

export function DivineImage({ url }: { url: string }) {
  const texture = useTexture(url);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  
  // Using a ref to track target hover state for smooth interpolation
  const targetHover = useRef(0);
  const currentHover = useRef(0);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uImageRes: { value: new THREE.Vector2((texture.image as any).width, (texture.image as any).height) }
    }),
    [texture, viewport]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Update resolution continuously in case of resize
      materialRef.current.uniforms.uResolution.value.set(viewport.width, viewport.height);
      
      // Smooth interpolation for hover effects
      currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover.current, 0.05);
      materialRef.current.uniforms.uHover.value = currentHover.current;

      // Update mouse position from state, map from [-1, 1] to [0, 1]
      mouse.current.set(
        (state.pointer.x * 0.5) + 0.5,
        (state.pointer.y * 0.5) + 0.5
      );
      // Smoothly move uniform mouse
      materialRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.1);
    }
  });

  return (
    <mesh 
      onPointerOver={() => targetHover.current = 1}
      onPointerOut={() => targetHover.current = 0}
    >
      {/* Plane covers the entire viewport */}
      <planeGeometry args={[viewport.width, viewport.height, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}
