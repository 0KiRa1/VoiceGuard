import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Speech Representation Learning for Noisy Environments
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Enhancing speech recognition accuracy in challenging acoustic conditions.
          </p>
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/audio-upload"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300"
            >
              Upload Audio
            </Link>
            <Link
              to="/results"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300"
            >
              View Results
            </Link>
          </div>
        </div>
      </header>

      {/* Project Overview */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Project Overview</h2>
          <p className="text-lg mb-4 text-justify">
            Our Speech Representation Learning project aims to revolutionize speech recognition technology by developing robust models that perform exceptionally well in noisy environments. By leveraging advanced machine learning techniques and self-supervised learning, we're pushing the boundaries of what's possible in speech processing.
          </p>
          <p className="text-lg text-justify">
            Whether it's busy streets, crowded cafes, or industrial settings, our technology adapts to challenging acoustic conditions, ensuring clear and accurate speech recognition where traditional systems fall short.
          </p>
        </div> 
      </section>


      {/* Key Features */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard title="Self-supervised Learning" description="Improved generalization for better performance across various scenarios." />
            <FeatureCard title="Noise-adaptive Training" description="Strategies to handle different types and levels of background noise." />
            <FeatureCard title="Multi-task Learning" description="Simultaneous processing of clean and noisy speech for robust representations." />
            <FeatureCard title="Real-time Processing" description="Fast and efficient algorithms for immediate results." />
            <FeatureCard title="Scalable Architecture" description="Flexible deployment options for various use cases and environments." />
            <FeatureCard title="Continuous Improvement" description="Ongoing research and updates to enhance performance." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          <StepCard number="1" title="Audio Input" description="Upload or record audio samples, including those with background noise." />
          <StepCard number="2" title="Advanced Processing" description="AI model analyzes audio, separating speech from noise." />
          <StepCard number="3" title="Accurate Results" description="Receive high-quality speech recognition results, even in noisy environments." />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to experience next-gen speech recognition?</h2>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition duration-300 inline-block mt-4"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="bg-blue-100 p-6 rounded-lg text-center max-w-xs">
    <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

export default Home;
