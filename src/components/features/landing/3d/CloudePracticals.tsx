"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface Particle {
  position: [number, number, number];
  speed: number;
}

interface CloudsProps {
  count?: number;
}

const CloudPracticals = ({ count = 50 }: CloudsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // تحميل texture الغيوم
  const cloudTexture = useMemo(() => new THREE.TextureLoader().load('/models/texture/cloud.png'), []);

  // توليد مواقع الغيوم مرة واحدة
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
           Math.random() * 10 - 5,  // X
          Math.random() * 3 + 2,   // Y: منتصف البرج
          (Math.random() - 0.5) * 10 ,  // Z
        ],
        speed: 0.002 + Math.random() * 0.001, // حركة أبطأ من النجوم
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

  // تحديث حركة الغيوم
  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      let x = pos[i * 3];
      x -= particles[i].speed;
      if (x < -5) x = 5;
      pos[i * 3] = x;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
      </bufferGeometry>
      <pointsMaterial
        map={cloudTexture}   // استخدام صورة الغيوم
        size={2}              // حجم الغيوم أكبر من النجوم
        transparent
        opacity={0.3}         // شفافية الغيوم
        depthWrite={false}
        toneMapped={true}     // تتفاعل مع الضوء الطبيعي
      />
    </points>
  );
};

export default CloudPracticals;
