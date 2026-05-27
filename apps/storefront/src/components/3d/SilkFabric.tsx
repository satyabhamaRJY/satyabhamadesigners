'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Create beautiful flowing silk waves
  float elevation = sin(modelPosition.x * 2.0 + uTime * 1.5) * 0.2;
  elevation += sin(modelPosition.y * 1.5 + uTime * 1.2) * 0.15;
  
  modelPosition.z += elevation;
  vElevation = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`;

const fragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Mix colors based on the elevation to create depth and shimmer
  float mixStrength = (vElevation + 0.35) * 1.5;
  vec3 color = mix(uColor1, uColor2, mixStrength);
  
  // Add a fake specular highlight for silk gloss
  float gloss = pow(max(0.0, vElevation * 2.0 + 0.5), 3.0) * 0.3;
  color += gloss;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function SilkFabric() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Deep royal crimson to elegant dark gold for a premium saree feel
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#4a0000') }, // Deep Red
      uColor2: { value: new THREE.Color('#8b0000') }, // Crimson
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.5, 0, 0]} position={[0, 0, -2]}>
      <planeGeometry args={[12, 12, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
