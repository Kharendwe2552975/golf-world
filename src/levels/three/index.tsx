import Ball from '@/components/ball/ball';
import FlagWithPole from '@/components/goal-point-flag';
import Hill from './hill';

const Level3 = ({ increaseScore }: { increaseScore: () => void }) => {
  return (
    <>
      <Hill position={[0, 10, 0]} />
      <FlagWithPole position={[20, 20, 125]} />
      <Ball increaseScore={increaseScore} />
    </>
  );
};

export default Level3;
