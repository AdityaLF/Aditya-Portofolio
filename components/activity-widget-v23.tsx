"use client"

import { useState, useEffect } from "react"
import { Code, Gamepad2, RefreshCw, Youtube } from "lucide-react" 
import type { LanyardData, Activity } from "@/hooks/use-lanyard" 

interface ActivityWidgetV23Props {
  data?: LanyardData | null
  loading?: boolean
  onRefresh?: () => void
}

const ActivityRow = ({ activity }: { activity: Activity }) => {
  const [elapsedTime, setElapsedTime] = useState("");
  const [progress, setProgress] = useState(0);

  const [durationText, setDurationText] = useState("elapsed");

  const formatDuration = (ms: number) => {
    if (!ms || ms <= 0) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
  };

  useEffect(() => {
    if (!activity.timestamps?.start) {
      setElapsedTime("");
      setProgress(0);
      return;
    };

    const GAME_MAX_DURATION_MS = 10 * 60 * 60 * 1000; // 10 hour

    const startTime = activity.timestamps.start;
    const endTime = activity.timestamps.end;
    const activityName = activity.name?.toLowerCase() ?? '';

    if (activityName === 'youtube' && endTime) {
        const totalMs = endTime - startTime;
        setDurationText(formatDuration(totalMs));
    } else {
        setDurationText("elapsed");
    }

    const updateElapsed = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;

      if (elapsedMs < 0) return;

      const totalSeconds = Math.floor(elapsedMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      let formatted = "";
      if (hours > 0) formatted += `${hours}h `;
      if (minutes > 0 || hours > 0) formatted += `${minutes}m `;
      formatted += `${seconds}s`;
      setElapsedTime(formatted.trim());

      if (activityName === 'youtube' && endTime) {
        const totalMs = endTime - startTime;
        const percentage = totalMs > 0 ? (elapsedMs / totalMs) * 100 : 0;
        setProgress(Math.min(percentage, 100));
      } else {
        const percentage = (elapsedMs / GAME_MAX_DURATION_MS) * 100;
        setProgress(Math.min(percentage, 100));
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activity.timestamps, activity.name]);

  const renderActivityImage = (act: Activity) => {
    const name = act.name?.toLowerCase() ?? '';

    if (name === 'youtube') {
      return <Youtube className="w-8 h-8 text-red-500" />;
    }

    if (name.includes('visual studio code')) {
      return <Code className="w-8 h-8 text-blue-400" />;
    }

    const imageUrl = act.assets?.large_image ? `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png` : null;
    if (imageUrl) {
      return <img src={imageUrl} alt={act.name} className="w-full h-full object-cover" />;
    }

    return <Gamepad2 className="w-8 h-8 text-green-400" />;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
          {renderActivityImage(activity)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate" title={activity.name}>
            {activity.name}
          </p>
          {activity.details && <p className="text-gray-400 text-xs truncate" title={activity.details}>{activity.details}</p>}
          {activity.state && <p className="text-gray-400 text-xs truncate" title={activity.state}>{activity.state}</p>}
        </div>
      </div>

      {elapsedTime && (
        <div className="space-y-2 pl-15">
          <div className="w-full bg-gray-700 rounded-full h-1 overflow-hidden">
            <div
              className="bg-blue-500 h-1 rounded-full w-1/3 animate-pulse"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{elapsedTime}</span>

            <span>{durationText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function ActivityWidgetV23({ data, loading, onRefresh }: ActivityWidgetV23Props) {
  
  const blockedNames = ['Spotify', 'Café']; 

  const allActivities = data?.activities?.filter(
    act => act.type !== 4 && !blockedNames.includes(act.name)
  ) || [];

  const mainActivity = allActivities[0]; 

  const getActivityInfo = () => {
    if (!mainActivity) return null
    if (mainActivity.name.toLowerCase().includes("visual studio code")) {
      return { type: "Currently Coding", icon: <Code className="w-5 h-5 text-blue-400" /> }
    }
    return { type: "Currently Playing", icon: <Gamepad2 className="w-5 h-5 text-green-400" /> }
  }

  const getStatusColor = () => {
    switch (data?.discord_status) {
      case "online": return "bg-green-500 status-glow-green"
      case "idle": return "bg-yellow-500 status-glow-yellow"
      case "dnd": return "bg-red-500 status-glow-red"
      default: return "bg-gray-500 status-glow-gray"
    }
  }

  const activityInfo = getActivityInfo()

  if (loading) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div><div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div></div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></div><div className="w-4 h-4 bg-gray-700 rounded-md animate-pulse"></div></div></div>
        <div className="animate-pulse"><div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-700 rounded w-1/2"></div></div>
      </div>
    )
  }

  if (!activityInfo) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><Gamepad2 className="w-5 h-5 text-gray-400" /><span className="text-white text-sm font-medium">Activity</span></div><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div><button onClick={onRefresh} className="text-gray-400 hover:text-white transition-colors" title="Refresh"><RefreshCw className="w-4 h-4" /></button></div></div>
        <p className="text-gray-400 text-sm">Aditya is not doing anything right now.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {activityInfo.icon}
          <span className="text-white text-sm font-medium">{activityInfo.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <button onClick={onRefresh} className="text-gray-400 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {allActivities.map((activity, index) => (
          <ActivityRow key={index} activity={activity} />
        ))}
      </div>
      
    </div>
  )
}
