'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

const silkVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalMatrix * normal;
  
  vec3 pos = position;

  // Simulate digital breeze with sine waves
  float wave1 = sin(pos.x * 2.0 + uTime * 1.5) * 0.1;
  float wave2 = cos(pos.y * 3.0 + uTime * 2.0) * 0.1;
  
  pos.z += wave1 + wave2;

  // Slight bulging towards mouse on hover
  float distToMouse = distance(uv, uMouse);
  pos.z += smoothstep(0.4, 0.0, distToMouse) * 0.3 * uHover;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const silkFragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  
  // Zari Magnifier: Golden metallic reflections based on mouse position
  vec3 lightDir = normalize(vec3(uMouse.x - 0.5, uMouse.y - 0.5, 1.0));
  float diff = max(dot(vNormal, lightDir), 0.0);
  
  // Specular highlight for metallic zari threads
  vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming orthographic/straight camera for reflection
  vec3 reflectDir = reflect(-lightDir, vNormal);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
  
  // Gold specularity mask based on texture luminance (assume brighter parts are zari)
  float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  vec3 specularColor = vec3(1.0, 0.84, 0.0) * spec * luminance * uHover * 2.0;

  vec3 finalColor = texColor.rgb + specularColor;

  gl_FragColor = vec4(finalColor, texColor.a);
}
`;

interface SilkSareeMeshProps {
  position: [number, number, number];
  imageUrl: string;
  title: string;
  subtitle: string;
  price: string;
}

export function SilkSareeMesh({ position, imageUrl, title, subtitle, price }: SilkSareeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture(imageUrl);
  
  const [hovered, setHovered] = useState(false);
  const targetHover = useRef(0);
  const currentHover = useRef(0);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 }
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover.current, 0.1);
      materialRef.current.uniforms.uHover.value = currentHover.current;

      // Update mouse local to screen, simplified
      mouse.current.set(
        (state.pointer.x * 0.5) + 0.5,
        (state.pointer.y * 0.5) + 0.5
      );
      materialRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => {
          targetHover.current = 1;
          setHovered(true);
        }}
        onPointerOut={() => {
          targetHover.current = 0;
          setHovered(false);
        }}
      >
        <planeGeometry args={[3, 4, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={silkVertexShader}
          fragmentShader={silkFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Invisible UI: Appears only on hover */}
      <Html position={[2, 0, 0]} className={`transition-opacity duration-700 w-64 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-stone-100 font-serif drop-shadow-2xl">
          <h3 className="text-2xl text-gold">{title}</h3>
          <p className="text-sm text-stone-300 italic mb-2">{subtitle}</p>
          <p className="font-mono text-xs tracking-widest">{price}</p>
          <div className="h-[1px] w-12 bg-gold mt-4" />
          <p className="text-xs text-stone-400 mt-2">Click to view details</p>
        </div>
      </Html>
    </group>
  );
}
