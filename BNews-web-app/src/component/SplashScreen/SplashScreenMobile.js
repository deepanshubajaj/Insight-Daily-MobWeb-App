import React, { useState } from "react";
import phoneNewsGif from '../../SplashScreenAssets/phone-news-video.gif';
import newsAudio from '../../SplashScreenAssets/news_audio.mp3';
import './SplashScreen.css';

function SplashScreenMobile({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(true);
  const [showGif, setShowGif] = useState(false);

  const handleStart = async () => {
    if (!isWaitingForPlay) return;

    try {
      const audio = new Audio(newsAudio);
      await audio.play();

      setIsWaitingForPlay(false);
      setShowGif(true);

      setTimeout(() => {
        setIsVisible(false);
        audio.pause();
        if (onComplete) onComplete();
      }, 5000);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div
      className={`splash-container mobile ${isVisible ? 'visible' : 'hidden'} ${isWaitingForPlay ? 'waiting' : ''}`}
      onClick={handleStart}
    >
      {showGif && <img className="gif-image" src={phoneNewsGif} alt="Loading animation" />}
      {isWaitingForPlay && <div className="start-message">Tap anywhere to start</div>}
    </div>
  );
}

export default SplashScreenMobile;
