//@ts-nocheck

const ServerBall = ({ position }) => {
  return (
    <mesh castShadow position={position}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default ServerBall;
