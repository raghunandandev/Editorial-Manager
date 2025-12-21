import React from 'react';

const AimsAndScope: React.FC = () => {
  return (
    <section className="bg-white w-full min-h-screen flex flex-col md:flex-row">
      {/* Left side: Title */}
      <div className="md:w-[30%] w-full flex items-start justify-center border-r border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Aims and scope</h1>
      </div>
      {/* Right side: Content */}
      <div className="md:w-[70%] w-full p-8 flex items-center">
        <div className="w-full text-gray-800">
          <p className="font-semibold mb-4">
            <span className="font-bold">Internet of Things; Engineering Cyber Physical Human Systems</span> is a comprehensive journal encouraging cross collaboration between researchers, engineers and practitioners in the field of IoT & Cyber Physical Human Systems. The journal offers a unique platform to exchange scientific information on the entire breadth of technology, science, and societal applications of the IoT.
          </p>
          <p className="mb-4">The journal will place a high priority on timely publication, and provide a home for high quality:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Full Research papers</li>
            <li>Survey Papers</li>
            <li>Open Software and Data</li>
            <li>Tutorials and best practices</li>
            <li>Case studies</li>
            <li>Whitepapers</li>
          </ul>
          <p className="mb-4">Furthermore, IOT is interested in publishing topical Special Issues on any aspect of IOT. Please submit your SI proposal for IOT through the Elsevier CSSI Portal. Detailed instructions could be found at: <a href="https://www.elsevier.com/physical-sciences-and-engineering/computer-science/journals/how-to-prepare-a-special-issue-proposal" className="text-brand-blue underline" target="_blank" rel="noopener noreferrer">https://www.elsevier.com/physical-sciences-and-engineering/computer-science/journals/how-to-prepare-a-special-issue-proposal</a></p>
          <p className="mb-4">The scope of IoT comprises four main blocks to cover the entire spectrum of the field. From Research to Technology, from Applications to their Consequences for life and society.</p>

          <h2 className="font-bold text-lg mt-6 mb-2">Theory and fundamental research</h2>
          <p className="mb-2">Research that addresses the core underlying scientific principles dealing with the analysis and algorithmics of "IoT ecosystem" as a multicomponent system with complex and dynamic dependences at large-scale, such as:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>New formal methods research to create abstractions, formalisms and semantics at IoT layer.</li>
            <li>Artificial Intelligence of Things (AIoT), Explainable Machine Learning for IoT, Intelligent Edge.</li>
            <li>Research on the unique IoT challenges in security, reliability and privacy.</li>
            <li>High-level policy languages for specifying permissible communication patterns.</li>
          </ul>

          <h2 className="font-bold text-lg mt-6 mb-2">Software development, technology and engineering</h2>
          <p className="mb-2">Key enabling IoT technologies related to sensors, actuators and machine intelligence. Development and deployment IoT tools and platforms to ensure security, reliability and efficiency, such as:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Device software development, such as minimal operating systems.</li>
            <li>IoT in Cloud-to-thing-Continuum. Secure communication of IoT with other software layers from edge computing to the Cloud.</li>
            <li>IoT software designs, including addressing security at design phase.</li>
            <li>Best practices for IoT (software) development, test beds and quality assurance. Sensors and actuators; Remote Operations and Control; IoT and Digital Twins.</li>
          </ul>

          <h2 className="font-bold text-lg mt-6 mb-2">Applications of IoT</h2>
          <p className="mb-2">New Applications of connected products and/or connected business processes to create new business value and business models. We are looking for contributions, and lessons learned, from researchers applying IoT in various domains including but not limited to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Energy (smart grids, meters & appliances, renewable energy).</li>
            <li>Transportation and Critical Infrastructures (infrastructures, logistics, road and rail, shipping, aerospace, autonomous vehicles).</li>
            <li>Manufacturing & industry (smart design & smart manufacturing, advanced robotics; Robotic Process Automation).</li>
            <li>Business, marketing & finance (e-commerce, finance, advertising & media).</li>
            <li>Urban life (smart/cyber-cities, home automation, smart buildings).</li>
            <li>Behavioral Sciences, Well-being Society, Sustainable Digital Transformation.</li>
            <li>eLearning, Technology-Enhanced Learning, CSCL, Virtual Campuses, Education and Technology.</li>
            <li>Ecology (precision agriculture, dairy, fishing, wildlife management, water, climate & ecology).</li>
            <li>Medicine & healthcare (delivery & care systems, decision support, wearables).</li>
            <li>Nano IoT (personalized precision medicine, Biological IoT, Chemical IoT).</li>
          </ul>

          <h2 className="font-bold text-lg mt-6 mb-2">Societal aspects of IoT</h2>
          <ul className="list-disc ml-6 mb-4">
            <li>Keeping humans in the loop is vital. Research in cyber-human systems that reflect human understanding and interaction with the physical world and (semi) autonomous systems.</li>
            <li>Societal, political and social impacts of the IoT.</li>
            <li>Ethics & (proposed) laws & regulations.</li>
            <li>IoT Governance.</li>
            <li>IoT Solutions for Pandemics, Disaster Management and Public Safety.</li>
            <li>Human Technology Interaction - at scale.</li>
            <li>Emerging standards and technology in human life.</li>
            <li>And, of course, hot issues, such as auditing, liability and social vulnerabilities.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AimsAndScope;
