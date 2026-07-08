import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function AutoCameraFitter({ modelRef, padding = 1.25, controlsRef }) {
  const { camera, size } = useThree();
  const hasFit = useRef(false);
  const prevSize = useRef({ width: 0, height: 0 });

  // Re-fit when viewport size changes
  if (size.width !== prevSize.current.width || size.height !== prevSize.current.height) {
    hasFit.current = false;
    prevSize.current = { width: size.width, height: size.height };
  }

  useFrame(() => {
    if (hasFit.current) return;
    if (!modelRef.current) return;

    // Force update matrix world to ensure accurate geometry positioning/scaling
    modelRef.current.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    const radius = sphere.radius;
    // Assume origin (0,0,0) as the center because <Center> aligns geometries there.
    // This keeps rotation and translation animations stable.
    const center = new THREE.Vector3(0, 0, 0);

    if (radius <= 0.001 || isNaN(radius)) return;

    const fov = camera.fov;
    const fovRad = (fov * Math.PI) / 180;
    const aspect = size.width / size.height;

    // Vertical half-angle of the camera field of view
    const halfFovV = fovRad / 2;
    // Horizontal half-angle of the camera field of view based on aspect ratio
    const halfFovH = Math.atan(aspect * Math.tan(halfFovV));

    // Distances required to fit the sphere vertically and horizontally
    const distV = (radius * padding) / Math.sin(halfFovV);
    const distH = (radius * padding) / Math.sin(halfFovH);

    // Choose the larger distance to avoid cropping on either axis
    const distance = Math.max(distV, distH);

    // Compute the direction from the center to the camera
    const currentCameraPosition = new THREE.Vector3().copy(camera.position);
    const direction = currentCameraPosition.sub(center).normalize();
    if (direction.lengthSq() === 0) {
      direction.set(0, 0, 1);
    }

    // Set new camera position at calculated distance
    const newPosition = direction.multiplyScalar(distance).add(center);
    camera.position.copy(newPosition);

    // Dynamically adjust near and far clipping planes
    camera.near = Math.max(0.01, distance / 100);
    camera.far = Math.max(100, distance * 10);
    camera.updateProjectionMatrix();

    // Sync OrbitControls target
    if (controlsRef && controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }

    hasFit.current = true;
  });

  return null;
}
