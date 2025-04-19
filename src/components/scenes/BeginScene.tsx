import React from 'react';
import FlickerButton from '../ui/FlickerButton';
import SocialButton from '../ui/SocialButton';
import { useGame } from '../../context/GameContext';

interface BeginSceneProps {
  onPlay: () => void;
}

const BeginScene: React.FC<BeginSceneProps> = ({ onPlay }) => {
  const { state } = useGame();
  const version = "1.6"; // Same version as in the original game

  return (
    <div className="scene begin-scene bg-white">
      {/* Game Title */}
      <div 
        className="absolute top-[10px] left-[-20px] scale-[1.8] text-3xl font-bold text-primary"
      >
        Battle Without End
      </div>

      {/* Play Button */}
      <div className="absolute top-[350px] left-[300px]">
        <FlickerButton text="Play Game" onClick={onPlay} width={200} height={80} fontSize={40} />
      </div>

      {/* Version */}
      <div className="absolute bottom-[30px] right-[70px] text-base text-black">
        Ver. {version}
      </div>

      {/* Social Media Buttons */}
      <div className="absolute bottom-[60px] right-[150px] flex gap-5">
        <SocialButton 
          platform="facebook" 
          url="https://www.facebook.com/pages/Crit-Game/492086344181628" 
        />
        <SocialButton 
          platform="twitter" 
          url="https://twitter.com/jyl111" 
        />
        <SocialButton 
          platform="weibo" 
          url="http://www.weibo.com/2162569391/" 
        />
        <SocialButton 
          platform="kongregate" 
          url="http://www.kongregate.com/games/CritGame/battle-without-end" 
        />
      </div>
    </div>
  );
};

export default BeginScene;
