'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import { Mesh } from 'three';

export default function BurjKhalfa(props: any) {
  const glbPath = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return '/models/burj_khalifa.glb';
  }, []);
  const [scale, setScale] = useState(0.03);
  const [position, setPosition] = useState<[number, number, number]>([0, -5, 0]);

  useEffect(() => {
    const updateScene = () => {
      if (window.innerWidth < 768) {
        setScale(0.02);
        setPosition([0, -3, 0]);
      } else if (window.innerWidth < 1024) {
        setScale(0.02);
        setPosition([0, -4, 0]);
      } else {
        setScale(0.03);
        setPosition([0, -5, 0]);
      }
    };

    updateScene();
    window.addEventListener('resize', updateScene);

    return () => window.removeEventListener('resize', updateScene);
  }, []);
  const { nodes, materials } = useGLTF(glbPath, true); // true = client-side only

  if (!glbPath) return null;

  return (
    <group {...props} scale={scale} position={position} dispose={null}>
      <group rotation={[-Math.PI, 0, 0]}>
        <mesh geometry={(nodes.Object_2 as Mesh).geometry} material={materials.color_10526880} />
        <mesh geometry={(nodes.Object_3 as Mesh).geometry} material={materials.color_9215658} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/burj_khalifa.glb');
