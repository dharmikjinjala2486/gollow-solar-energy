import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, useGLTF, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import solarLampUrl from '../../assets/solar_lamp__lampara_solar__solar_street_light.glb';
import AutoCameraFitter from './AutoCameraFitter';

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// 3D Solar Lamp Model Component
function BatteryModel({ hovered, modelRef }) {
  const { scene } = useGLTF(solarLampUrl);
  const groupRef = useRef();

  useEffect(() => {
    if (modelRef) {
      modelRef.current = scene;
    }
  }, [scene, modelRef]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle floating up and down
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.15;
      // Gentle Y oscillation so the front lamp fixtures are highlighted
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive 
          object={scene} 
          scale={0.35} // Scaled up to make it clearly visible
        />
      </Center>
    </group>
  );
}

// Fallback Battery Component (SVG + CSS)
function BatterySVG({ hovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        animate={{ scale: hovered ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-56 h-56 rounded-full bg-brand-green/5 filter blur-2xl"
      />
      <motion.div
        animate={{ 
          rotateY: hovered ? 15 : 0,
          rotateX: hovered ? 25 : 20,
          y: hovered ? -10 : 0
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ perspective: 1000 }}
        className="relative z-10 w-64 h-64 flex flex-col items-center justify-center cursor-pointer"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-glow-green">
          {/* Support base */}
          <rect x="75" y="155" width="50" height="20" rx="4" fill="#334155" />
          
          {/* Main battery case */}
          <rect x="50" y="30" width="100" height="120" rx="8" fill="#111827" stroke="#374151" strokeWidth="3" />
          
          {/* Charge levels */}
          <g fill="#10b981">
            <motion.rect 
              x="62" y="115" width="76" height="20" rx="3"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.rect 
              x="62" y="85" width="76" height="20" rx="3"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
            <motion.rect 
              x="62" y="55" width="76" height="20" rx="3"
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            />
          </g>
        </svg>
        <span className="absolute bottom-2 font-heading text-[10px] text-brand-green/60 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          Interactive Cabinet
        </span>
      </motion.div>
    </div>
  );
}

export default function BatteryCanvas() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [hovered, setHovered] = useState(false);
  const modelRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    setWebGLSupported(hasWebGL());
  }, []);

  return (
    <div 
      className="w-full h-[350px] md:h-[450px] relative select-none overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {webGLSupported ? (
        <>
          <Canvas
            camera={{ position: [0, 0.4, 2.5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            className="absolute top-0 left-0 w-full h-full md:-top-[15%] md:-left-[15%] md:w-[130%] md:h-[130%] pointer-events-auto cursor-grab active:cursor-grabbing"
            shadows
          >
            <ambientLight intensity={1.8} />
            <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" />
            <directionalLight position={[-5, 4, 3]} intensity={1.8} color="#ffffff" />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <pointLight position={[-10, -5, -5]} intensity={1.0} color="#4caf50" />
            
            <Suspense fallback={null}>
              <BatteryModel hovered={hovered} modelRef={modelRef} />
            </Suspense>

            <AutoCameraFitter modelRef={modelRef} padding={1.2} controlsRef={controlsRef} />
            
            <OrbitControls 
              ref={controlsRef}
              enableZoom={false} 
              enablePan={false}
              enableDamping
              dampingFactor={0.05}
              autoRotate={!hovered} 
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={0.2}
            />
          </Canvas>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="font-heading text-[10px] text-white/30 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              Drag to Orbit • Hover to Speed
            </span>
          </div>
        </>
      ) : (
        <BatterySVG hovered={hovered} />
      )}
    </div>
  );
}
