import React, { useState, useRef, useEffect } from "react";

const Dashboard = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [denoisedAudio, setDenoisedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#4f46e5";
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      audioCtxRef.current = audioContext;
      analyserRef.current = analyser;
      drawWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        cancelAnimationFrame(animationRef.current);
        canvasRef.current.getContext("2d").clearRect(0, 0, 500, 100);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcessAudio = async () => {
    if (!audioBlob) return alert("No recorded audio to process!");

    setProcessing(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.webm");

    try {
      const response = await fetch("http://127.0.0.1:8000/process-audio/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setResult({ message: "Processing failed!" });
      } else {
        setResult(data);

        if (data.denoised_audio_url) {
          const res = await fetch(data.denoised_audio_url);
          const blob = await res.blob();
          setDenoisedAudio(blob);
        }
      }
    } catch (error) {
      console.error("🔥 Error processing audio:", error);
      setResult({ message: "Error occurred while processing." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🎙️ Real-Time Audio Dashboard</h1>

        <div className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{isRecording ? "Recording..." : "Not Recording"}</h2>
            <canvas ref={canvasRef} width={500} height={100} className="border mt-2" />
          </div>

          <div className="flex gap-4">
            <button onClick={handleStartRecording} className="bg-green-600 text-white px-4 py-2 rounded">
              Start Recording
            </button>
            <button onClick={handleStopRecording} className="bg-red-600 text-white px-4 py-2 rounded">
              Stop
            </button>
            <button onClick={handleProcessAudio} className="bg-blue-600 text-white px-4 py-2 rounded" disabled={processing}>
              {processing ? "Processing..." : "Process Audio"}
            </button>
          </div>

          {audioBlob && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">🎧 Raw Audio Playback</h3>
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mt-1" />
            </div>
          )}

          {denoisedAudio && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">🧹 Denoised Audio Playback</h3>
              <audio controls src={URL.createObjectURL(denoisedAudio)} className="w-full mt-1" />
            </div>
          )}

          {result && (
            <div className="mt-6 bg-white shadow p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-700 mb-2">🎧 Raw Audio Playback</h2>
              {result.raw?.audio_data ? (
                <audio controls className="w-full mb-4">
                  <source src={`data:audio/mp3;base64,${result.raw.audio_data}`} type="audio/mp3" />
                </audio>
              ) : (
                <p className="text-red-500 mb-4">⚠️ No raw audio found.</p>
              )}

              <h2 className="text-xl font-semibold text-blue-700 mb-2">🎧 Denoised Audio Playback</h2>
              {result.denoised?.audio_data ? (
                <audio controls className="w-full mb-4">
                  <source src={`data:audio/mp3;base64,${result.denoised.audio_data}`} type="audio/mp3" />
                </audio>
              ) : (
                <p className="text-red-500 mb-4">⚠️ No denoised audio found.</p>
              )}

              <h3 className="text-lg font-semibold text-gray-800 mb-1">🔍 Raw Audio Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                <p>⏱ Duration: <strong>{result.raw.duration || "Not Available"}</strong></p>
                <p>🔊 Noise Level: <strong>{result.raw.noise_level || "Not Available"}</strong></p>
                <p>📢 Loudness: <strong>{result.raw.loudness ? result.raw.loudness + " dB" : "Not Available"}</strong></p>
                <p>🎵 Pitch: <strong>{result.raw.pitch ? result.raw.pitch + " Hz" : "Not Available"}</strong></p>
              </div>

              {/* Side-by-Side Comparison */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🎨 Raw vs Denoised Comparison</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Raw Spectrogram and Waveform */}
                <div>
                  <h4 className="text-lg font-semibold">Raw Spectrogram</h4>
                  {result.raw?.spectrogram && (
                    <img src={`data:image/png;base64,${result.raw.spectrogram}`} alt="Raw Spectrogram" className="w-full mb-4" />
                  )}

                  <h4 className="text-lg font-semibold">Raw Waveform Plot</h4>
                  {result.raw?.waveform_plot && (
                    <img src={`data:image/png;base64,${result.raw.waveform_plot}`} alt="Raw Waveform Plot" className="w-full mb-4" />
                  )}
                </div>

                {/* Denoised Spectrogram and Waveform */}
                <div>
                  <h4 className="text-lg font-semibold">Denoised Spectrogram</h4>
                  {result.denoised?.spectrogram && (
                    <img src={`data:image/png;base64,${result.denoised.spectrogram}`} alt="Denoised Spectrogram" className="w-full mb-4" />
                  )}

                  <h4 className="text-lg font-semibold">Denoised Waveform Plot</h4>
                  {result.denoised?.waveform_plot && (
                    <img src={`data:image/png;base64,${result.denoised.waveform_plot}`} alt="Denoised Waveform Plot" className="w-full mb-4" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
