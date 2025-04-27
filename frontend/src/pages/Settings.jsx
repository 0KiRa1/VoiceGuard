import React, { useState } from 'react';

const Settings = () => {
  const [noiseLevel, setNoiseLevel] = useState(0.5);
  const [modelType, setModelType] = useState('default');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Implement settings save logic
    console.log('Settings saved:', { noiseLevel, modelType, notifications });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>
        
        <form onSubmit={handleSave} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="noiseLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Noise Reduction Level
            </label>
            <input
              type="range"
              id="noiseLevel"
              min="0"
              max="1"
              step="0.1"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{noiseLevel}</span>
          </div>
          
          <div className="mb-6">
            <label htmlFor="modelType" className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              id="modelType"
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="default">Default</option>
              <option value="advanced">Advanced</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
