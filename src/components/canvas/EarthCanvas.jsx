import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
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

// 3D Holographic Globe Component
function GlobeModel({ hovered, modelRef }) {
  const globeRef = useRef();
  const cloudRef = useRef();
  const markerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * (hovered ? 0.15 : 0.05);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = -t * 0.03;
      cloudRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
    if (markerRef.current) {
      // Scale pulsing of UAE marker
      const scale = Math.sin(t * 4) * 0.05 + 0.15;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={modelRef}>
      {/* Central Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#0c4a6e" transparent opacity={0.2} />
      </mesh>

      {/* Main Wireframe Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color="#4caf50" 
          wireframe 
          emissive="#2e7d32" 
          emissiveIntensity={hovered ? 1.5 : 0.6}
        />
      </mesh>

      {/* Floating Outer Holographic Mesh */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.6, 24, 24]} />
        <meshStandardMaterial 
          color="#f9b233" 
          wireframe 
          transparent 
          opacity={0.15} 
          emissive="#b45309"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* UAE Location Marker Hub (Placed roughly on the sphere surface) */}
      {/* UAE Coordinates on a sphere: roughly latitude 25N, longitude 55E */}
      {/* Let's place it at x=0.7, y=0.6, z=1.3 (which is roughly on the surface of radius 1.5) */}
      <group position={[0.65, 0.6, 1.3]}>
        <mesh ref={markerRef}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#f9b233" transparent opacity={0.8} />
        </mesh>
        <mesh scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#4caf50" transparent opacity={0.2} wireframe />
        </mesh>
      </group>
    </group>
  );
}

// Fallback Globe Component (SVG + CSS)
function GlobeSVG({ hovered }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        animate={{ scale: hovered ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-64 h-64 rounded-full bg-brand-green/5 filter blur-3xl"
      />

      <motion.div
        animate={{ 
          rotate: hovered ? 12 : 5,
          scale: hovered ? 1.02 : 1
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-64 h-64 flex flex-col items-center justify-center cursor-pointer"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-glow-green">
          {/* Outer circle */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(76, 175, 80, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(76, 175, 80, 0.3)" strokeWidth="1" />
          
          {/* Grid lines */}
          {/* Latitude lines */}
          <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="rgba(76, 175, 80, 0.2)" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="80" ry="50" fill="none" stroke="rgba(76, 175, 80, 0.2)" strokeWidth="0.8" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(76, 175, 80, 0.3)" strokeWidth="0.8" />
          
          {/* Longitude lines */}
          <ellipse cx="100" cy="100" rx="25" ry="80" fill="none" stroke="rgba(76, 175, 80, 0.2)" strokeWidth="0.8" />
          <ellipse cx="100" cy="100" rx="50" ry="80" fill="none" stroke="rgba(76, 175, 80, 0.2)" strokeWidth="0.8" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(76, 175, 80, 0.3)" strokeWidth="0.8" />
          
          {/* Holographic Continents wireframe layout */}
          <path d="M 60,60 Q 75,50 90,65 T 120,60 T 140,80 T 120,110 T 80,120 Z" fill="none" stroke="#4caf50" strokeWidth="1.5" />
          <path d="M 40,90 Q 50,110 60,130 T 80,140 T 70,160 Z" fill="none" stroke="#4caf50" strokeWidth="1.2" />

          {/* UAE Node location */}
          <g>
            {/* Pulsing ring */}
            <motion.circle 
              cx="115" cy="75" r="8" fill="none" stroke="#f9b233" strokeWidth="1"
              animate={{ r: [3, 14], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Center dot */}
            <circle cx="115" cy="75" r="4" fill="#f9b233" />
            
            {/* Pulse text indicator */}
            <text x="125" y="78" fill="#f9b233" fontSize="8" fontWeight="bold" fontFamily="Sora">Dubai Hub</text>
          </g>
        </svg>
        <span className="absolute bottom-2 font-heading text-[10px] text-brand-green/60 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          Holographic Earth
        </span>
      </motion.div>
    </div>
  );
}

export default function EarthCanvas() {
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
            camera={{ position: [0, 0, 3.2], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            className="absolute top-0 left-0 w-full h-full md:-top-[15%] md:-left-[15%] md:w-[130%] md:h-[130%] pointer-events-auto cursor-grab active:cursor-grabbing"
            shadows
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-10, -5, -5]} intensity={0.5} color="#4caf50" />
            <directionalLight position={[1, 2, 2]} intensity={1.0} color="#ffffff" />
            
            <GlobeModel hovered={hovered} modelRef={modelRef} />

            <AutoCameraFitter modelRef={modelRef} padding={1.25} controlsRef={controlsRef} />
            
            <OrbitControls 
              ref={controlsRef}
              enableZoom={false} 
              enablePan={false}
              autoRotate={!hovered} 
              autoRotateSpeed={0.5}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="font-heading text-[10px] text-white/30 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
              Drag to Spin • Hover to Accelerate
            </span>
          </div>
        </>
      ) : (
        <GlobeSVG hovered={hovered} />
      )}
    </div>
  );
}
