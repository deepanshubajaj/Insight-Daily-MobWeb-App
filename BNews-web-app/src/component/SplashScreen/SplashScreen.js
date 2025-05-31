import React, { useEffect, useState } from 'react';
import newsVideo from '../../SplashScreenAssets/newsVideo.mp4';
import newsAudio from '../../SplashScreenAssets/news_audio.mp3';
import './SplashScreen.css';

function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = document.getElementById('splashVideo');

    const handleVideoEnd = () => {
      setIsVisible(false);
      if (onComplete) onComplete();
    };

    const handleVideoError = (e) => {
      console.error('Video error:', e);
      setError('Video error: ' + (e.message || 'Unknown error'));
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onComplete]);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const video = document.getElementById('splashVideo');
      const audio = new Audio(newsAudio);

      // Start playing both
      await Promise.all([video.play(), audio.play()]);

      setIsWaitingForPlay(false);
      setIsPlaying(true);

      // Set timer to end splash screen after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        video.pause();
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);

    } catch (error) {
      console.error('Error playing media:', error);
    }
  };

  return (
    <div 
      className={`splash-container ${isVisible ? 'visible' : 'hidden'} ${isWaitingForPlay ? 'waiting' : ''}`}
      onClick={handleStart}
    >
      {isWaitingForPlay && <div className="start-message">Tap anywhere to start</div>}
      <video
        id="splashVideo"
        className={`splash-video ${isPlaying ? 'playing' : ''}`}
        playsInline
        muted={false}
        loop
      >
        <source src={newsVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default SplashScreen;
