import React, { useEffect, useRef, useState } from "react";

const NoiseMeter = () => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(Math.round(avg));
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    });
  }, []);

  return (
    <div className="my-4">
      <p className="text-sm text-gray-700">🎙 Real-Time Noise Level:</p>
      <div className="h-4 bg-gray-300 rounded overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-200"
          style={{ width: `${Math.min(volume, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default NoiseMeter;
