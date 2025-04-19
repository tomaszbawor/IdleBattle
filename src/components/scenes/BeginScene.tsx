import React from 'react';
import { Button } from '../ui/button';
import { Facebook, Twitter, Globe, ExternalLink } from 'lucide-react';

interface BeginSceneProps {
  onPlay: () => void;
}

const BeginScene: React.FC<BeginSceneProps> = ({ onPlay }) => {
  const version = "1.6"; // Same version as in the original game

  return (
    <div className="scene begin-scene bg-white min-h-screen flex flex-col items-center justify-between p-8 relative">
      {/* Game Title */}
      <div className="text-5xl font-bold text-center mt-16 mb-8">
        Idle Battle
      </div>

      {/* Play Button */}
      <div className="flex justify-center my-8">
        <Button 
          variant="flicker" 
          onClick={onPlay} 
          className="text-4xl py-6 px-8 font-semibold"
        >
          Play Game
        </Button>
      </div>

      {/* Footer with Version and Social Media */}
      <div className="w-full flex flex-col items-center mt-auto">
        {/* Social Media Buttons */}
        <div className="flex gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => window.open("https://www.facebook.com/pages/Crit-Game/492086344181628", "_blank")}
            aria-label="Facebook"
          >
            <Facebook className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => window.open("https://twitter.com/jyl111", "_blank")}
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => window.open("http://www.weibo.com/2162569391/", "_blank")}
            aria-label="Weibo"
          >
            <Globe className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
            onClick={() => window.open("http://www.kongregate.com/games/CritGame/battle-without-end", "_blank")}
            aria-label="Kongregate"
          >
            <ExternalLink className="h-6 w-6" />
          </Button>
        </div>

        {/* Version */}
        <div className="text-base text-black mb-2">
          Ver. {version}
        </div>
      </div>
    </div>
  );
};

export default BeginScene;
