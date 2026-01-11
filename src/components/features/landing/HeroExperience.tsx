"use client"
import { Canvas } from "@react-three/fiber"

const HeroExperience = () => {
  return (
    <>
      <Canvas
      camera={{ position: [0, 2, 8], fov: 35 }}
      frameloop="demand"
      dpr={[1, 1.5]}
      className="w-full h-full"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />


     </Canvas>
    </>
  )
}

export default HeroExperience
