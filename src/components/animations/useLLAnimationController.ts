import { useState, useEffect } from 'react';

export function useLLAnimationController(stepsLength: number, defaultSpeed: number = 2) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);

  useEffect(() => {
    let timer: any;
    if (isPlaying && currentStep < stepsLength - 1) {
      const speeds = [1500, 1000, 700, 400, 200];
      timer = setTimeout(() => setCurrentStep(s => s + 1), speeds[speed]);
    } else if (currentStep >= stepsLength - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, stepsLength, speed]);

  const play = () => {
    if (currentStep >= stepsLength - 1) setCurrentStep(0);
    setIsPlaying(true);
  };
  
  const pause = () => setIsPlaying(false);
  
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (currentStep < stepsLength - 1) setCurrentStep(currentStep + 1);
    setIsPlaying(false);
  };

  const stepBackward = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    setIsPlaying(false);
  };

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setCurrentStep
  };
}
