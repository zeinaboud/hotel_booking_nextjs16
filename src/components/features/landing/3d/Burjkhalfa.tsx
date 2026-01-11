"use client";

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Mesh } from 'three';

export default function BurjKhalfa(props: any) {

  const glbPath = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return "/models/burj_khalifa.glb"
  }, [])

  const { nodes, materials } = useGLTF(glbPath, true) // true = client-side only

  if (!glbPath) return null

  return (
    <group {...props} scale={0.03}  position={[0, -5, 0]} dispose={null}>
      <group rotation={[-Math.PI, 0, 0]}>
        <mesh
          geometry={(nodes.Object_2 as Mesh).geometry}
          material={materials.color_10526880}
        />
        <mesh
          geometry={(nodes.Object_3 as Mesh).geometry}
          material={materials.color_9215658}
        />
      </group>
    </group>
  )
}

useGLTF.preload("/models/burj_khalifa.glb");
