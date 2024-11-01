import { useBox } from '@react-three/cannon';

interface PlaneProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  thickness?: number;
}

const Plane: React.FC<PlaneProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [100, 100],
  thickness = 0.1,
}) => {
  const [ref] = useBox(() => ({
    position,
    rotation,
    type: 'Static',
    args: [size[0], thickness, size[1]], // Very thin box for the plane
  }));

  return (
    //@ts-ignore
    <mesh ref={ref}>
      <boxGeometry args={[size[0], thickness, size[1]]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
};

export default Plane;
