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
    const playlistUrl = createBlobUrl(base64Playlist);
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
      ref={playerRef} 
      controls
      onLoadedData={() => onLoad && onLoad(playerRef.current as HTMLVideoElement)}
      style={{ width: '100%', height: '100%' }}
    >
    </video>
  );
}

export default HlsVideoPlayer;