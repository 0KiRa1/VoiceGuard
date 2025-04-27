import React, { useState } from "react";
import axios from "axios";

const AudioUpload = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [rawResult, setRawResult] = useState(null);
  const [denoisedResult, setDenoisedResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setRawResult(null);
    setDenoisedResult(null);
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please upload an audio file first.");
      return;
    }

    setProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/process-audio/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRawResult(response.data.raw);
      setDenoisedResult(response.data.denoised);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process audio.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadAudio = (base64Data, fileName, fileExtension) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, {
      type: fileExtension === ".mp3" ? "audio/mp3" : "audio/wav",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName + fileExtension;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold flex items-center mb-4">🎵 Audio Upload & Noise Filtering</h2>

      <label className="block border-2 border-dashed border-gray-400 p-6 rounded-lg cursor-pointer text-center hover:bg-gray-100 transition">
        <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
        {file ? (
          <p className="text-lg font-semibold">{file.name}</p>
        ) : (
          <p className="text-gray-500">Drag & drop an audio file or click to select</p>
        )}
      </label>

      {file && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <audio controls className="w-full">
            <source src={URL.createObjectURL(file)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={processing}
        className="mt-4 px-5 py-2 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 w-full"
      >
        {processing ? "⏳ Processing..." : "⚡ Process Audio"}
      </button>

      {rawResult && denoisedResult && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-red-600 mb-2">🎧 Raw Audio</h2>
            <p className="text-sm text-gray-600">{rawResult.message}</p>
            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p>⏱ Duration: <span className="font-semibold">{rawResult.duration}s</span></p>
              <p>🔊 Noise: <span className="font-semibold">{rawResult.noise_level}</span></p>
              <p>📢 Loudness: <span className="font-semibold">{rawResult.loudness} dB</span></p>
              <p>🎵 Pitch: <span className="font-semibold">{rawResult.pitch} Hz</span></p>
            </div>
            <img src={`data:image/png;base64,${rawResult.waveform_plot}`} alt="Waveform" className="mt-4 rounded shadow" />
            <img src={`data:image/png;base64,${rawResult.spectrogram}`} alt="Spectrogram" className="mt-4 rounded shadow" />

            <audio
              controls
              src={`data:audio/mpeg;base64,${rawResult.audio_data}`}
              className="mt-4 w-full"
            />

            <button
              onClick={() => downloadAudio(rawResult.audio_data, "raw_audio", rawResult.file_extension)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Raw Audio
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-green-700 mb-2">🧹 Denoised Audio</h2>
            <p className="text-sm text-gray-600">{denoisedResult.message}</p>
            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p>⏱ Duration: <span className="font-semibold">{denoisedResult.duration}s</span></p>
              <p>🔊 Noise: <span className="font-semibold">{denoisedResult.noise_level}</span></p>
              <p>📢 Loudness: <span className="font-semibold">{denoisedResult.loudness} dB</span></p>
              <p>🎵 Pitch: <span className="font-semibold">{denoisedResult.pitch} Hz</span></p>
            </div>
            <img src={`data:image/png;base64,${denoisedResult.waveform_plot}`} alt="Waveform" className="mt-4 rounded shadow" />
            <img src={`data:image/png;base64,${denoisedResult.spectrogram}`} alt="Spectrogram" className="mt-4 rounded shadow" />

            <audio
              controls
              src={`data:audio/mpeg;base64,${denoisedResult.audio_data}`}
              className="mt-4 w-full"
            />

            <button
              onClick={() => downloadAudio(denoisedResult.audio_data, "denoised_audio", denoisedResult.file_extension)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download Denoised Audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
