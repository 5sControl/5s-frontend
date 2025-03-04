import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { API_BASE_URL } from '../../config';

interface VideoPlayerProps {
  manifestPath: string;
  onLoad?: (videoElement: HTMLVideoElement) => void;
}

const HlsVideoPlayer = ({ manifestPath, onLoad }: VideoPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    let hls: Hls | null = null;
    const playlistUrl = API_BASE_URL + manifestPath;
    const videoElement = playerRef.current;
    console.log(manifestPath, 1);
    let timeLogger;

    if (videoElement) {
      videoElement.muted = true;
      videoElement.volume = 0.9;

      timeLogger = setInterval(() => {
        console.log('currentTime:', videoElement.currentTime);
      }, 1000);
      
    }

    if (Hls.isSupported() && playlistUrl) {
      hls = new Hls();
      hls.loadSource(playlistUrl);
      if (videoElement) {
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('Ошибка HLS:', data);
        });
      }
    } else if (videoElement?.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = playlistUrl;
      videoElement.addEventListener('loadedmetadata', () => {
        console.log(12);
        
        videoElement.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
        clearInterval(timeLogger);
      }
    };
  }, [manifestPath]);

  return (
    <video
      ref={playerRef} 
      controls
      onLoadedData={() => onLoad && onLoad(playerRef.current as HTMLVideoElement)}
      style={{ width: '100%', height: '100%' }}
    >
    </video>
  );
}

export default HlsVideoPlayer;