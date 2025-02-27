import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { API_BASE_URL } from '../../config';

interface VideoPlayerProps {
  base64Playlist: string;
  onLoad?: (videoElement: HTMLVideoElement) => void;
}

const HlsVideoPlayer = ({ base64Playlist, onLoad }: VideoPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    let hls: Hls | null = null;
    const playlistUrl = API_BASE_URL + base64Playlist;
    const videoElement = playerRef.current;

    if (videoElement) {
      videoElement.volume = 0.9;
    }

    if (Hls.isSupported() && playlistUrl) {
      hls = new Hls();
      hls.loadSource(playlistUrl);
      if (videoElement) {
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
      }
    } else if (videoElement?.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = playlistUrl;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      URL.revokeObjectURL(playlistUrl);
    };
  }, [base64Playlist]);

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