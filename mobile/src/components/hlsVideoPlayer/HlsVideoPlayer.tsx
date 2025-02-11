import React, { useEffect, useRef, forwardRef } from 'react';
import Hls from 'hls.js';
import { API_BASE_URL } from '../../config';

interface VideoPlayerProps {
  base64Playlist: string;
  timeToStart?: number;
}

const HlsVideoPlayer = ({ base64Playlist, timeToStart = 23 }: VideoPlayerProps) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      let hls: Hls | null = null;

      const playlistUrl = createBlobUrl(base64Playlist);
      const videoElement = localVideoRef.current;

      if (videoElement) {
        videoElement.volume = 0.9;
        videoElement.currentTime = timeToStart;
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

    function createBlobUrl(base64: string): string {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  const updatedLines: string[] = [];

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decodedPlaylist = new TextDecoder().decode(bytes);
  const lines = decodedPlaylist.split('\n');

  for (const line of lines) {
    if (line.startsWith('#EXT')) {
      updatedLines.push(line);
    } else if (line) {
      updatedLines.push(API_BASE_URL + line); 
    }
  }
  const blob = new Blob([updatedLines.join('\n')], { type: 'application/x-mpegURL' });
  return URL.createObjectURL(blob);
}

    return (
      <video
        src="https://office.5scontrol.com/videos/192.168.1.169/2025-02-11_12-26-12-28-192.168.1.169.mp4"
        ref={localVideoRef} 
        controls
        style={{ width: '100%', height: '100%' }}
      >
      </video>
    );
  }

export default HlsVideoPlayer;