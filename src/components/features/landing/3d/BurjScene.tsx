"use client"

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import BurjKhalfa from "./Burjkhalfa";
import CloudPracticals from "./CloudePracticals";
import StarPracticals from "./Practicals";

export default function BurjScene() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only read theme after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <Canvas
      camera={{ position: [0, 3, 12], fov: 35 }}
      frameloop="demand"
      dpr={[1, 1.5]}
      className="w-full h-full"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={7} />

      <OrbitControls
        enablePan={false}
        maxDistance={20}
        minDistance={20}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />

      <BurjKhalfa />
      {mounted && (isDarkMode ? <StarPracticals count={100} /> : <CloudPracticals count={20} />)}
    </Canvas>
  );
}
