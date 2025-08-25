import React from 'react';
import teamImage from '../assets/images/team.jpg'; // Ensure you have a team image in this path

const About = () => {
  const developers = [
    {
      name: "John Doe",
      role: "Frontend Developer",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      image: "/src/assets/images/slide1.png"
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      github: "https://github.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      image: "/src/assets/images/slide2.png"
    },
    {
      name: "Mike Johnson",
      role: "Full Stack Developer",
      github: "https://github.com/mikejohnson",
      linkedin: "https://linkedin.com/in/mikejohnson",
      image: "/src/assets/images/slide3.jpg"
    },
    {
      name: "Sarah Wilson",
      role: "UI/UX Designer",
      github: "https://github.com/sarahwilson",
      linkedin: "https://linkedin.com/in/sarahwilson",
      image: "/src/assets/images/logo.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          {/* Left Side - Paragraph */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-[var(--darker-bg-color)] mb-6">About Our Team</h1>
            <p className="text-md text-[var(--primary-color)] leading-relaxed">
              Our journey began at the ITI (Information Technology Institute) in Alexandria, Egypt, where a group of passionate aspiring developers came together with a shared goal: to master full-stack development and build something meaningful. Over 4-5 intense months, we immersed ourselves in learning Python, web frameworks, databases, and modern development practices—transforming from beginners into capable developers.            </p>
            <p className="text-md text-[var(--primary-color)] leading-relaxed mt-4">
              Late-night coding sessions, debugging marathons, and countless cups of tea fueled our progress. Through collaboration, mentorship, and perseverance, we turned our vision into reality. This platform isn’t just a project—it’s a testament to our growth, teamwork, and the skills we gained at ITI.

              Today, we’re proud to present our work, knowing it’s just the beginning of our journey.</p>
          </div>
          {/* Right Side - Team Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg shadow-lg p-4">
              <img
                src={teamImage}
                alt="Our Team"
                className="w-full h-auto object-contain rounded hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
        {/* Bottom Section - Hall of Fame */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--darker-bg-color)] mb-4">Our Developers</h2>
          <p className="text-lg text-[var(--primary-color)] max-w-2xl mx-auto">
            Meet the talented individuals who make our projects come to life
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((developer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Full-size Developer Image */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Developer Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[var(--primary-color)] mb-2">{developer.name}</h3>
                <p className="text-text-[var(--primary-color)] mb-4">{developer.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;