import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Results = () => {
  const [features, setFeatures] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [denoisedData, setDenoisedData] = useState([]);
  const [rawWaveform, setRawWaveform] = useState(null);
  const [denoisedWaveform, setDenoisedWaveform] = useState(null);
  const [rawSpectrogram, setRawSpectrogram] = useState(null);
  const [denoisedSpectrogram, setDenoisedSpectrogram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://localhost:8000/latest-results'); // change to your backend URL
        const data = res.data;

        setRawData([
          data.raw.duration,
          data.raw.noise_level,
          data.raw.loudness,
          data.raw.pitch,
        ]);
        setDenoisedData([
          data.denoised.duration,
          data.denoised.noise_level,
          data.denoised.loudness,
          data.denoised.pitch,
        ]);
        setFeatures(['Duration', 'Noise Level', 'Loudness', 'Pitch']);

        setRawWaveform(data.raw.waveform_plot);
        setDenoisedWaveform(data.denoised.waveform_plot);
        setRawSpectrogram(data.raw.spectrogram);
        setDenoisedSpectrogram(data.denoised.spectrogram);
      } catch (err) {
        console.error("Error loading results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const chartData = {
    labels: features,
    datasets: [
      {
        label: 'Raw Audio',
        data: rawData,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
      },
      {
        label: 'Denoised Audio',
        data: denoisedData,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Speech Representation Comparison' },
    },
  };

  const hasData = rawData.length > 0 && denoisedData.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Speech Results</h1>

        {loading ? (
          <p className="text-center text-lg">Loading or insufficient data...</p>
        ) : hasData ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <Line data={chartData} options={chartOptions} />

            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Visual Representations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-center font-semibold">Raw Audio</h3>
                  {rawWaveform && (
                    <img src={`data:image/png;base64,${rawWaveform}`} alt="Raw Waveform" className="w-full rounded my-2" />
                  )}
                  {rawSpectrogram && (
                    <img src={`data:image/png;base64,${rawSpectrogram}`} alt="Raw Spectrogram" className="w-full rounded" />
                  )}
                </div>
                <div>
                  <h3 className="text-center font-semibold">Denoised Audio</h3>
                  {denoisedWaveform && (
                    <img src={`data:image/png;base64,${denoisedWaveform}`} alt="Denoised Waveform" className="w-full rounded my-2" />
                  )}
                  {denoisedSpectrogram && (
                    <img src={`data:image/png;base64,${denoisedSpectrogram}`} alt="Denoised Spectrogram" className="w-full rounded" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Analysis</h2>
              <p className="text-lg">
                Feature comparison and visual inspection show how the denoising has affected pitch, noise levels, and audio quality.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-red-500">No valid data found.</p>
        )}
      </div>
    </div>
  );
};

export default Results;
