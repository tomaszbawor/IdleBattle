import React from 'react';
import { Button } from '../ui/button';
import { Facebook, Twitter, Globe, ExternalLink } from 'lucide-react';

interface BeginSceneProps {
  onPlay: () => void;
}

const BeginScene: React.FC<BeginSceneProps> = ({ onPlay }) => {
  const version = "1.6"; // Same version as in the original game

  return (
    <div className="scene begin-scene bg-white">
      {/* Game Title */}
      <div
      >
        Idle Battle
      </div>

      {/* Play Button */}
      <div className="absolute top-[350px] left-[300px]">
        <Button 
          variant="flicker" 
          onClick={onPlay} 
          className="w-[200px] h-[80px] text-[40px]"
        >
          Play Game
        </Button>
      </div>

      {/* Version */}
      <div className="absolute bottom-[30px] right-[70px] text-base text-black">
        Ver. {version}
      </div>

      {/* Social Media Buttons */}
      <div className="absolute bottom-[60px] right-[150px] flex gap-5">
        <Button
          variant="ghost"
          size="icon"
          className="w-[50px] h-[50px]"
          onClick={() => window.open("https://www.facebook.com/pages/Crit-Game/492086344181628", "_blank")}
          aria-label="Facebook"
        >
          <Facebook className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-[50px] h-[50px]"
          onClick={() => window.open("https://twitter.com/jyl111", "_blank")}
          aria-label="Twitter"
        >
          <Twitter className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-[50px] h-[50px]"
          onClick={() => window.open("http://www.weibo.com/2162569391/", "_blank")}
          aria-label="Weibo"
        >
          <Globe className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-[50px] h-[50px]"
          onClick={() => window.open("http://www.kongregate.com/games/CritGame/battle-without-end", "_blank")}
          aria-label="Kongregate"
        >
          <ExternalLink className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default BeginScene;
