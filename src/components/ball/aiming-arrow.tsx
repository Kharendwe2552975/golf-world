import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useBall } from './ball-provider';

const AimingArrow = ({ position }: { position: [number, number, number] }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const { state, setShootingAngle } = useBall();
  const { camera } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      if (state !== 'aiming') return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ plane
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      const deltaX = intersectPoint.x - position[0];
      const deltaZ = intersectPoint.z - position[2];
      const angle = Math.atan2(deltaZ, -deltaX);

      setRotationAngle(angle);
    };

    const handleMouseClick = () => {
      if (state !== 'aiming') return;
      setShootingAngle(rotationAngle);
    };

    window.addEventListener('click', handleMouseClick);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [state, camera, position, rotationAngle]);

  return (
    <mesh position={position} rotation={[0, rotationAngle, Math.PI / 2]}>
      <coneGeometry args={[1, 20, 32]} />
      <meshBasicMaterial color={0x00ff00} transparent opacity={0.2} />
      <mesh position={[0, 10, 0]}>
        <coneGeometry args={[1, 20, 32]} />
        <meshBasicMaterial color={0x00ff00} transparent opacity={0.6} />
      </mesh>
    </mesh>
  );
};

export default AimingArrow;
