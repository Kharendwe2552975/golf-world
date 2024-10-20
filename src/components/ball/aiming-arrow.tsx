import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useBall } from './ball-provider';

const AimingArrow = ({ position }: { position: [number, number, number] }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const { isAiming, setShootingAngle } = useBall();

  const { camera } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      if (!isAiming) return;
      // Convert mouse screen coordinates to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = 1; //-(event.clientY / window.innerHeight) * 2 + 1;

      // Set the raycaster to cast from the camera into the scene based on mouse coordinates
      raycaster.setFromCamera(mouse, camera);

      // Intersect the ray with a plane (XZ plane in this case)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Y-up plane (XZ plane)
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      // Calculate the angle between the arrow base (position) and the intersection point
      const deltaX = intersectPoint.x - position[0];
      const deltaZ = intersectPoint.z - position[2]; // XZ plane, so use z
      const angle = Math.atan2(deltaZ, deltaX); // Calculate the angle in radians

      setRotationAngle(angle); // Update the angle state
    };

    const handleMouseClick = () => {
      if (!isAiming) return;
      setShootingAngle(rotationAngle);
    };

    window.addEventListener('click', handleMouseClick);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, position]);

  return (
    <mesh position={position} rotation={[0, rotationAngle, Math.PI / 2]}>
      {/* Offset the cone geometry so its base is at the origin */}
      <coneGeometry args={[1, 20, 32]} />
      <meshBasicMaterial color={0x00ff00} transparent opacity={0.2} />
      <mesh position={[0, 10, 0]}>
        {/* Translate the cone up by half its height */}
        <coneGeometry args={[1, 20, 32]} />
        <meshBasicMaterial color={0x00ff00} transparent opacity={0.6} />
      </mesh>
    </mesh>
  );
};

export default AimingArrow;
