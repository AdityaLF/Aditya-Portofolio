"use client"

import { useState } from "react";
import { Gamepad2, PcCase, Youtube, ChevronDown, ChevronUp, Globe } from "lucide-react";

const recentlyPlayed = [
  {
    name: "Visual Studio Code",
    platform: "PC",
    imageUrl: "https://raw.githubusercontent.com/leonardssh/vscord/refs/heads/main/assets/icons/idle-vscode.png",
  },
  {
    name: "Resident Evil 4",
    platform: "PC",
    imageUrl: "https://th.bing.com/th/id/OIP.IXjQkadghOjpIYHL2ONEXQAAAA?rs=1&pid=ImgDetMain",
  },
  {
    name: "YouTube",
    platform: "Web",
    imageUrl: "https://vectorseek.com/wp-content/uploads/2023/06/Youtube-Symbol-Vector.jpg",
  },
  {
    name: "Lies of P",
    platform: "PC",
    imageUrl: "https://c.clc2l.com/t/L/i/Lies-of-P-t0kxA6.jpg",
  },

  {
    name: "Rise of the Tomb Raider",
    platform: "PC",
    imageUrl: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/rise-of-the-tomb-raider/6/6f/Rise-of-the-tomb-raider.jpg",
  },
  {
    name: "The Sinking City",
    platform: "PC",
    imageUrl: "https://gamecritics.com/wp-content/uploads/2019/10/Sinking-City.jpg",
  }
];

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "pc": return <PcCase className="w-3 h-3 text-gray-400" />;
    case "web": return <Globe className="w-3 h-3 text-gray-400" />;
    default: return <Gamepad2 className="w-3 h-3 text-gray-400" />;
  }
};

export function DiscordWidget() {

  const [isExpanded, setIsExpanded] = useState(false);
  const initialDisplayCount = 4; 

  const gamesToShow = isExpanded ? recentlyPlayed : recentlyPlayed.slice(0, initialDisplayCount);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <Gamepad2 className="w-5 h-5 text-blue-400" />
        <h2 className="text-white font-semibold text-sm">Activity History</h2>
      </div>

      <div className="space-y-3">
        {gamesToShow.map((game, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden bg-gray-700">
              <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">{game.name}</p>
              <div className="flex items-center gap-1.5">{getPlatformIcon(game.platform)}<p className="text-gray-400 text-xs">{game.platform}</p></div>
            </div>
          </div>
        ))}
      </div>

      {recentlyPlayed.length > initialDisplayCount && (
        <div className="mt-4 pt-2 border-t border-gray-700/50">
          <button 
            onClick={toggleExpanded} 
            className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show {recentlyPlayed.length - initialDisplayCount} More <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
