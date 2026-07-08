import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, useGLTF, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import solarPanelUrl from '../../assets/solar_panel.glb';
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

// 3D Solar Panel Model Component
function SolarPanelModel({ hovered, modelRef }) {
  const { scene } = useGLTF(solarPanelUrl);
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
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.1;
      // Oscillate Y-rotation so front side is always visible
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.4;
      // Tilt forward slightly so cells catch light
      groupRef.current.rotation.x = 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive 
          object={scene} 
          scale={0.06} // Fit nicely in frame
        />
      </Center>
    </group>
  );
}

// Fallback HTML/SVG Component
function SolarSVGPanel({ hovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative background sun rays */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-72 h-72 rounded-full border border-brand-yellow/10 border-dashed"
      />
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-56 h-56 rounded-full bg-brand-yellow/5 filter blur-2xl"
      />

      {/* SVG Solar Panel Structure */}
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
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-glow-yellow">
          {/* Support pole */}
          <rect x="96" y="110" width="8" height="80" rx="3" fill="#334155" />
          
          {/* Main frame */}
          <rect x="40" y="30" width="120" height="90" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          
          {/* Cells grid */}
          <g fill="#0f172a" stroke="#f9b233" strokeWidth="0.8">
            <rect x="45" y="35" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="73" y="35" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="101" y="35" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="129" y="35" width="24" height="24" rx="2" fill="#1e3a8a" />
            
            <rect x="45" y="63" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="73" y="63" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="101" y="63" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="129" y="63" width="24" height="24" rx="2" fill="#1e3a8a" />

            <rect x="45" y="91" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="73" y="91" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="101" y="91" width="24" height="24" rx="2" fill="#1e3a8a" />
            <rect x="129" y="91" width="24" height="24" rx="2" fill="#1e3a8a" />
          </g>
          
          {/* Reflective shine line */}
          <path d="M 45 40 L 150 115" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-2 font-heading text-[10px] text-brand-yellow/60 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          Interactive Vector
        </span>
      </motion.div>
    </div>
  );
}

export default function SolarCanvas() {
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
            camera={{ position: [0, 0, 4.5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            className="absolute top-0 left-0 w-full h-full md:-top-[15%] md:-left-[15%] md:w-[130%] md:h-[130%] pointer-events-auto cursor-grab active:cursor-grabbing"
            shadows
          >
            {/* Lights */}
            <ambientLight intensity={1.8} />
            <directionalLight position={[5, 10, 7]} intensity={3.5} color="#ffffff" />
            <directionalLight position={[-5, 5, 5]} intensity={1.8} color="#ffffff" />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
            <pointLight position={[-10, 5, -5]} intensity={1.0} color="#f9b233" />
            
            {/* Solar Panel Model */}
            <Suspense fallback={null}>
              <SolarPanelModel hovered={hovered} modelRef={modelRef} />
            </Suspense>

            <AutoCameraFitter modelRef={modelRef} padding={1.2} controlsRef={controlsRef} />
            
            {/* Mouse Drag controls */}
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
              Drag to Orbit • Hover to Charge
            </span>
          </div>
        </>
      ) : (
        <SolarSVGPanel hovered={hovered} />
      )}
    </div>
  );
}
