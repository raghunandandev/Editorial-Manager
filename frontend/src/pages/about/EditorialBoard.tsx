import React from 'react';
import { Users, Mail, Building, Award, Globe } from 'lucide-react';

const EditorialBoard: React.FC = () => {
  const editorialBoard = {
    editorInChief: {
      name: "Professor F. Xhafa",
      affiliation: "Universitat Politècnica de Catalunya, Barcelona, Spain",
      email: "f.xhafa@upc.edu",
      expertise: ["Distributed Systems", "IoT", "Cloud Computing"],
      image: "https://via.placeholder.com/150?text=Prof+Xhafa"
    },
    associateEditors: [
      {
        name: "Prof. Sarah Chen",
        affiliation: "Massachusetts Institute of Technology, USA",
        email: "s.chen@mit.edu",
        expertise: ["Edge Computing", "IoT Security", "Machine Learning"],
        image: "https://via.placeholder.com/150?text=Prof+Chen"
      },
      {
        name: "Prof. Michael Zhang",
        affiliation: "University of Cambridge, UK",
        email: "m.zhang@cam.ac.uk",
        expertise: ["Wireless Sensor Networks", "IoT Protocols", "Network Optimization"],
        image: "https://via.placeholder.com/150?text=Prof+Zhang"
      },
      {
        name: "Prof. Maria Garcia",
        affiliation: "Technical University of Madrid, Spain",
        email: "m.garcia@upm.es",
        expertise: ["Smart Cities", "Sustainable IoT", "Urban Computing"],
        image: "https://via.placeholder.com/150?text=Prof+Garcia"
      },
      {
        name: "Prof. Robert Brown",
        affiliation: "ETH Zurich, Switzerland",
        email: "r.brown@ethz.ch",
        expertise: ["Industrial IoT", "Cybersecurity", "Blockchain"],
        image: "https://via.placeholder.com/150?text=Prof+Brown"
      },
      {
        name: "Prof. Emily Davis",
        affiliation: "National University of Singapore, Singapore",
        email: "e.davis@nus.edu.sg",
        expertise: ["IoT Applications", "Healthcare IoT", "Wearable Devices"],
        image: "https://via.placeholder.com/150?text=Prof+Davis"
      },
      {
        name: "Prof. Christopher Lee",
        affiliation: "University of Tokyo, Japan",
        email: "c.lee@u-tokyo.ac.jp",
        expertise: ["5G Networks", "IoT Communication", "Network Protocols"],
        image: "https://via.placeholder.com/150?text=Prof+Lee"
      }
    ],
    advisoryBoard: [
      {
        name: "Prof. John Smith",
        affiliation: "Stanford University, USA",
        expertise: ["IoT Architecture", "Distributed Systems"]
      },
      {
        name: "Prof. Lisa Wang",
        affiliation: "Tsinghua University, China",
        expertise: ["AIoT", "Edge Intelligence"]
      },
      {
        name: "Prof. David Martinez",
        affiliation: "University of California, Berkeley, USA",
        expertise: ["IoT Security", "Privacy"]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Editorial Board</h1>
          <p className="text-gray-600">
            Meet the distinguished editors and advisors who guide the journal's editorial direction
          </p>
        </div>

        {/* Editor-in-Chief */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="text-brand-orange" size={28} />
            Editor-in-Chief
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={editorialBoard.editorInChief.image} 
                  alt={editorialBoard.editorInChief.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-brand-blue"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {editorialBoard.editorInChief.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building size={18} />
                    <span>{editorialBoard.editorInChief.affiliation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={18} />
                    <span>{editorialBoard.editorInChief.email}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Research Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {editorialBoard.editorInChief.expertise.map((area, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Associate Editors */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="text-brand-blue" size={28} />
            Associate Editors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorialBoard.associateEditors.map((editor, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <img 
                    src={editor.image} 
                    alt={editor.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{editor.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        <span>{editor.affiliation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{editor.email}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">Expertise:</h4>
                      <div className="flex flex-wrap gap-1">
                        {editor.expertise.map((area, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Board */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="text-purple-600" size={28} />
            Advisory Board
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {editorialBoard.advisoryBoard.map((member, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{member.affiliation}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.expertise.map((area, i) => (
                      <span key={i} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Editorial Office</h3>
          <p className="text-blue-800">
            For editorial inquiries, please contact the editorial office at{" "}
            <a href="mailto:editorial@iotjournal.com" className="underline hover:text-blue-600">
              editorial@iotjournal.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorialBoard;

