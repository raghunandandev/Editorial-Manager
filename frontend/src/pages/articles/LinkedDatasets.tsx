import React from 'react';
import { Database, Download, Calendar, FileText, ExternalLink } from 'lucide-react';

const LinkedDatasets: React.FC = () => {
  const datasets = [
    {
      id: 1,
      title: "IoT Sensor Network Dataset - Smart City Deployment",
      description: "Comprehensive dataset containing sensor readings from a large-scale IoT deployment in urban environments, including temperature, humidity, air quality, and traffic flow data.",
      associatedArticle: "Edge Intelligence for IoT: A Comprehensive Framework",
      size: "2.5 GB",
      format: "CSV, JSON",
      records: "15.2 million",
      datePublished: "2024-11-15",
      license: "CC BY 4.0",
      downloads: 1247
    },
    {
      id: 2,
      title: "Industrial IoT Security Attack Patterns Dataset",
      description: "Dataset containing anonymized attack patterns and security logs from industrial IoT systems, useful for developing intrusion detection and prevention systems.",
      associatedArticle: "Blockchain-Based Security Architecture for Industrial IoT",
      size: "850 MB",
      format: "CSV, Parquet",
      records: "3.8 million",
      datePublished: "2024-10-20",
      license: "CC BY-NC 4.0",
      downloads: 892
    },
    {
      id: 3,
      title: "5G Network Performance Metrics for IoT Applications",
      description: "Real-world performance measurements from 5G networks supporting various IoT applications, including latency, throughput, and reliability metrics.",
      associatedArticle: "Machine Learning-Driven Resource Optimization in 5G Networks",
      size: "1.2 GB",
      format: "JSON, HDF5",
      records: "8.5 million",
      datePublished: "2024-09-10",
      license: "CC BY 4.0",
      downloads: 2156
    },
    {
      id: 4,
      title: "Healthcare IoT Device Telemetry Dataset",
      description: "Anonymized telemetry data from wearable IoT devices used in healthcare monitoring, including heart rate, activity levels, and sleep patterns.",
      associatedArticle: "AI-Driven IoT Systems for Healthcare",
      size: "3.1 GB",
      format: "CSV, JSON",
      records: "22.3 million",
      datePublished: "2024-08-05",
      license: "CC BY 4.0",
      downloads: 1834
    },
    {
      id: 5,
      title: "Smart Grid IoT Sensor Readings",
      description: "Time-series data from IoT sensors deployed in smart grid infrastructure, including power consumption, voltage levels, and grid stability metrics.",
      associatedArticle: "Sustainable IoT Solutions for Smart Cities",
      size: "4.5 GB",
      format: "CSV, Time Series DB",
      records: "35.7 million",
      datePublished: "2024-07-18",
      license: "CC BY 4.0",
      downloads: 967
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Linked Datasets</h1>
          <p className="text-gray-600">
            Research datasets associated with published articles, available for download and reuse
          </p>
        </div>

        {/* Datasets List */}
        <div className="space-y-6">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Database className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-brand-blue cursor-pointer">
                    {dataset.title}
                  </h2>
                  <p className="text-gray-700 mb-3 leading-relaxed">{dataset.description}</p>
                  
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      <strong>Associated Article:</strong>{" "}
                      <span className="text-brand-blue hover:underline cursor-pointer">
                        {dataset.associatedArticle}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600"><strong>Size:</strong></span>
                      <span className="ml-1 text-gray-900">{dataset.size}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600"><strong>Format:</strong></span>
                      <span className="ml-1 text-gray-900">{dataset.format}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600"><strong>Records:</strong></span>
                      <span className="ml-1 text-gray-900">{dataset.records}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600"><strong>License:</strong></span>
                      <span className="ml-1 text-gray-900">{dataset.license}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Published: {new Date(dataset.datePublished).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={16} />
                      <span>{dataset.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  <Download size={16} />
                  Download Dataset
                </button>
                <button className="flex items-center gap-2 text-brand-blue hover:text-brand-orange transition-colors">
                  <FileText size={16} />
                  View Documentation
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ExternalLink size={16} />
                  Access via API
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About Linked Datasets</h3>
          <p className="text-blue-800 mb-2">
            Linked datasets are research data associated with published articles, made available to support reproducibility, 
            enable further research, and promote open science. All datasets are peer-reviewed and include comprehensive documentation.
          </p>
          <p className="text-blue-800">
            <strong>Usage:</strong> Please cite both the dataset and the associated article when using these datasets in your research.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LinkedDatasets;

