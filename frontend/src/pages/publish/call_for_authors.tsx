import React from "react";
import { Link, useParams } from "react-router-dom";

type Call = {
  id: string;
  date: string;
  title: string;
  summary: string;
  guestEditors: string;
  deadline: string;
};

const calls: Call[] = [
  {
    id: "isc2-2025",
    date: "20 October 2025",
    title:
      '"Resilient & Sustainable Smart Communities” Extended Best Papers from IEEE ISC2-2025',
    summary:
      "The International Smart Cities Conference ISC2 is the flagship IEEE conference for Smart Cities, sponsored by the IEEE Smart Cities Community and the IEEE Power & Energy Society. ISC2 is a highly selective conference that brings together academic and industrial experts of the networking community to discuss the most recent advances in smart city infrastructure, data management, service delivery and cybersecurity to highlight key issues, identify trends, and develop a vision of smart cities and communities from a design, deployment and operation standpoints. The 11th ISC2 held at the University of Patras (UP) in Patras, Greece, showcased cutting-edge research that pushes the boundaries of Internet of Things (IoT) in topics across broad application and functional domains, within the context of smart urban and peri-urban systems.",
    guestEditors: "Ioannis Chatzigiannakis, Luis Muñoz, Georgios Mylonas",
    deadline: "15 December 2025",
  },
  {
    id: "iot-2026",
    date: "15 November 2025",
    title:
      '"Advanced IoT Applications in Healthcare” Special Issue from IoT 2026 Conference',
    summary:
      "The Internet of Things (IoT) has revolutionized healthcare by enabling continuous monitoring, personalized treatment, and remote patient care. This special issue invites extended versions of the best papers from the IoT 2026 Conference, focusing on innovative IoT applications in medical devices, telemedicine, health data analytics, and cybersecurity in healthcare systems. Authors are encouraged to submit manuscripts that demonstrate significant advancements in IoT-enabled healthcare solutions.",
    guestEditors: "Maria Rodriguez, John Smith, Sarah Chen",
    deadline: "30 January 2026",
  },
  {
    id: "ai-2025",
    date: "10 December 2025",
    title:
      '"AI-Driven Smart Systems” Extended Papers from AI Conference 2025',
    summary:
      "Artificial Intelligence continues to transform various domains through intelligent automation, predictive analytics, and adaptive systems. This special issue welcomes extended versions of outstanding papers from the AI Conference 2025, with emphasis on AI applications in smart cities, industrial automation, environmental monitoring, and human-computer interaction. Submissions should highlight novel AI methodologies, practical implementations, and real-world impact.",
    guestEditors: "David Johnson, Emily Wang, Michael Brown",
    deadline: "15 February 2026",
  },
];

export default function CallForAuthorsList(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto px-3 py-10">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4 relative">
        Call for papers
      </h1>

      <div className="relative pt-6">
        <div className="absolute top-0 left-0 w-[10%] h-px bg-blue-300"></div>
        {calls.map((c) => (
          <article key={c.id} className="py-7 border-b border-gray-100">
            <time className="block text-sm text-gray-500 mb-3">{c.date}</time>

            <h2 className="text-2xl font-semibold mb-4">
              <Link
                to={`/publish/call-for-authors/${c.id}`}
                className="text-gray-900 hover:text-sky-600 underline-offset-2 hover:underline"
              >
                {c.title}
              </Link>
            </h2>

            <div className="text-gray-700 space-y-4 max-w-[120ch]">
              <p>{c.summary}</p>
              <p>
                <strong className="font-medium">Guest editors:</strong> {c.guestEditors}
              </p>
              <p>
                <strong className="font-medium">Submission deadline:</strong>{" "}
                <span className="text-gray-900">{c.deadline}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CallForAuthorsDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const call = calls.find((c) => c.id === id);

  if (!call) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-10">
        <Link to="/publish/call-for-authors" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Call for papers
        </Link>
        <h1 className="text-2xl font-semibold mt-6">Announcement not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 py-10">
      <Link to="/publish/call-for-authors" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to Call for papers
      </Link>

      <time className="block text-sm text-gray-500 mt-6">{call.date}</time>
      <h1 className="text-3xl font-semibold text-gray-900 mt-2 mb-6 relative">
        {call.title}
        <span className="absolute bottom-0 left-0 w-[10%] h-0.5 bg-blue-600"></span>
      </h1>

      <div className="prose prose-slate max-w-none">
        <p>{call.summary}</p>

        <p>
          Building on the success of the conference, this Special Issue (SI) invites the authors of
          the highest-rated ISC2-2025 papers to submit substantially extended and strengthened
          journal versions of their work. Manuscripts must contain at least 50% new technical
          material, deeper theoretical/experimental insights and be rewritten to avoid any copyright
          overlap with the IEEE conference proceedings.
        </p>

        <p>
          <strong>Guest editors:</strong> {call.guestEditors}
        </p>

        <p>
          <strong>Submission deadline:</strong> {call.deadline}
        </p>
      </div>
    </div>
  );
}