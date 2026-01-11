"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface Particle {
  position: [number, number, number];
  speed: number;
  opacity: number;
  flickerSpeed: number;
}

const StarPracticals = ({ count = 200 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // توليد مواقع النجوم مرة واحدة
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          Math.random() * 10 - 5,  // X
          Math.random() * 3 + 2,   // Y: منتصف البرج
          (Math.random() - 0.5) * 10 ,  // Z
        ],
        speed: 0.01 + Math.random() * 0.01,
        opacity: 0.8 + Math.random() * 0.2,      // بداية عشوائية للسطوع
        flickerSpeed: Math.random() * 0.05 + 0.01, // سرعة التومض
      });
    }
    return temp;
  }, [count]);

  // مصفوفة المواقع
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      arr[i * 3] = p.position[0];
      arr[i * 3 + 1] = p.position[1];
      arr[i * 3 + 2] = p.position[2];
    });
    return arr;
  }, [particles, count]);

  // مصفوفة opacities
  const opacities = useMemo(() => {
    const arr = new Float32Array(count);
    particles.forEach((p, i) => {
      arr[i] = p.opacity;
    });
    return arr;
  }, [particles, count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const alpha = (pointsRef.current.geometry.attributes as any).opacity.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // حركة X
      let x = pos[i * 3];
      x -= particles[i].speed;
      if (x < -5) x = 5;
      pos[i * 3] = x;

      // تومض النجوم
      let o = alpha[i];
      o += (Math.random() - 0.5) * particles[i].flickerSpeed;
      o = THREE.MathUtils.clamp(o, 0.5, 1);
      alpha[i] = o;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    (pointsRef.current.geometry.attributes as any).opacity.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={count}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.08}
        vertexColors={false}
        transparent
        opacity={1}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
};

export default StarPracticals;
