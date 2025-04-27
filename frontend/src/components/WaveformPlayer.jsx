// components/WaveformPlayer.js
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveformPlayer = ({ audioBlob }) => {
  const waveformRef = useRef();
  const wavesurfer = useRef();

  useEffect(() => {
    if (!audioBlob) return;

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    const blobUrl = URL.createObjectURL(new Blob([audioBlob]));
    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#bbb",
      progressColor: "#4f46e5",
      barWidth: 2,
      height: 100,
    });

    wavesurfer.current.load(blobUrl);

    return () => {
      if (wavesurfer.current) wavesurfer.current.destroy();
      URL.revokeObjectURL(blobUrl);
    };
  }, [audioBlob]);

  return <div ref={waveformRef}></div>;
};

export default WaveformPlayer;
