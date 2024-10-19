import FlagWithPole from '@/components/goal-point-flag';
import Hill from './hill';

const Level3 = () => {
  return (
    <>
      <Hill position={[0, 10, 0]} />
      <FlagWithPole position={[20, 20, 125]} />
    </>
  );
};

export default Level3;
