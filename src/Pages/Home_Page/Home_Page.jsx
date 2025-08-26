import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home_Page.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// --- SVG Icons (No changes, included for completeness) ---
const MyTestsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"></path>
    <line x1="10" y1="16" x2="14" y2="16"></line>
    <line x1="12" y1="12" x2="12" y2="12"></line>
  </svg>
);
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 16.5v-11A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 1 4 14.5v-9z"></path>
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ScheduleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const ResultsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);
const DoubtIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// --- Sample Data ---
const demoTests = [
  {
    id: 1,
    title: "AMU 9th Entrance",
    subject: "Mathematics",
    questions: 25,
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "JEE Mains Mock",
    subject: "Physics",
    questions: 30,
    difficulty: "Hard",
  },
  {
    id: 3,
    title: "NEET Biology Basics",
    subject: "Biology",
    questions: 50,
    difficulty: "Easy",
  },
];

const upcomingTests = [
  {
    id: 1,
    name: "Full Syllabus Mock Test 1",
    date: "2025-08-20",
    time: "10:00 AM",
    duration: "3 Hours",
    syllabus: "Complete Physics, Chemistry, Maths Syllabus",
  },
  {
    id: 2,
    name: "Organic Chemistry Chapter Test",
    date: "2025-08-25",
    time: "2:00 PM",
    duration: "1 Hour",
    syllabus: "Alcohols, Phenols, and Ethers",
  },
  {
    id: 3,
    name: "Advanced Trigonometry",
    date: "2025-09-01",
    time: "11:30 AM",
    duration: "1.5 Hours",
    syllabus: "Trigonometric Identities and Equations",
  },
  {
    id: 4,
    name: "Modern Physics Grand Test",
    date: "2025-09-05",
    time: "3:00 PM",
    duration: "2 Hours",
    syllabus: "Dual Nature of Radiation, Atoms, Nuclei",
  },
];

const recentResults = [
  { id: 1, name: "Algebra Fundamentals", score: 88, rank: 3, status: "Pass" },
  { id: 2, name: "Modern Physics", score: 65, rank: 12, status: "Pass" },
  { id: 3, name: "Thermodynamics Quiz", score: 42, rank: 28, status: "Fail" },
  {
    id: 4,
    name: "General Knowledge Weekly",
    score: 95,
    rank: 1,
    status: "Pass",
  },
];

const doubts = [
  {
    id: 1,
    user: "Aisha Khan",
    question: "Can someone explain the concept of entropy in thermodynamics?",
    upvotes: 12,
  },
  {
    id: 2,
    user: "Rohan Sharma",
    question:
      "What is the best way to solve integration by parts? I keep getting confused.",
    upvotes: 8,
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: "spring",
      stiffness: 100,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- View Components ---

const MyTestsView = () => {
  const [boughtTests, setBoughtTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Mock API Call ---
    // Replace this with your actual fetch call to the database.
    const fetchBoughtTests = () => {
      setLoading(true);
      setTimeout(() => {
        // --- SCENARIO 1: User HAS bought tests ---
        // const mockData = [
        //   {
        //     id: 1,
        //     title: "Advanced Calculus Championship",
        //     subject: "Mathematics",
        //     questions: 50,
        //   },
        //   {
        //     id: 2,
        //     title: "Modern Physics Olympiad",
        //     subject: "Physics",
        //     questions: 45,
        //   },
        //   {
        //     id: 3,
        //     title: "Organic Chemistry Challenge",
        //     subject: "Chemistry",
        //     questions: 60,
        //   },
        //   {
        //     id: 4,
        //     title: "Data Structures & Algorithms Test",
        //     subject: "Computer Science",
        //     questions: 40,
        //   },
        // ];

        // --- SCENARIO 2: User has NOT bought any tests ---
        const mockData = []; // Uncomment this line to see the empty state

        setBoughtTests(mockData);
        setLoading(false);
      }); // Simulate network delay
    };

    fetchBoughtTests();
  }, []); // Empty dependency array means this runs once on component mount
  const navigate = useNavigate();

  const goToShop = () => {
    navigate("/shop"); // This will navigate to the /about route
  };
  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <motion.div
      className="my-tests-view"
      key="my-tests"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="view-title">My Tests</h1>

      {boughtTests.length > 0 ? (
        <motion.div className="tests-grid" variants={containerVariants}>
          {boughtTests.map((test) => (
            <motion.div
              key={test.id}
              className="test-card card"
              variants={itemVariants}
            >
              <div className="test-card-subject">
                <BookIcon />
                <span>{test.subject}</span>
              </div>
              <h3 className="test-card-title">{test.title}</h3>
              <p className="test-card-info">{test.questions} Questions</p>
              <motion.button
                className="start-test-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Start Test</span>
                <ArrowRightIcon />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="empty-tests-container card"
          variants={itemVariants}
        >
          <h2 className="empty-tests-title">No Tests Here!</h2>
          <p className="empty-tests-message">
            It looks like you haven't purchased any tests yet. Browse our
            library to find the perfect test to kickstart your preparation.
          </p>
          <motion.button
            className="browse-tests-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToShop}
          >
            Browse All Tests
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

const DashBoardView = () => (
  <motion.div
    key="my-tests"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="dashboard-grid"
  >
    {/* Progress Report Card */}
    <motion.div className="progress-card card" variants={itemVariants}>
      <div className="progress-visual">
        <CircularProgress percentage={78} />
        <div className="progress-details">
          <h2>Your Progress</h2>
          <p>Great job! Keep it up.</p>
        </div>
      </div>
      <div className="progress-stats">
        <div className="stat-item">
          <span>12</span>
          <p>Tests Taken</p>
        </div>
        <div className="stat-item">
          <span>82%</span>
          <p>Avg. Score</p>
        </div>
        <div className="stat-item">
          <span>#5</span>
          <p>Overall Rank</p>
        </div>
      </div>
    </motion.div>

    {/* Free Demo Tests Section */}
    <motion.section className="dashboard-section" variants={itemVariants}>
      <h2>Free Demo Tests</h2>
      <div className="test-grid">
        {demoTests.map((test) => (
          <motion.div
            key={test.id}
            className="test-card card"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="test-card-header">
              <span className="test-subject">{test.subject}</span>
              <span
                className={`difficulty-badge ${test.difficulty.toLowerCase()}`}
              >
                {test.difficulty}
              </span>
            </div>
            <h3>{test.title}</h3>
            <div className="test-card-footer">
              <span>{test.questions} Questions</span>
              <motion.button
                className="start-test-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Test
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Upcoming Tests Timeline Widget */}
    <motion.section className="dashboard-section" variants={itemVariants}>
      <h2>Upcoming Tests</h2>
      <ul className="upcoming-list">
        {upcomingTests.slice(0, 3).map((test) => (
          <motion.li
            key={test.id}
            className="upcoming-item"
            variants={itemVariants}
          >
            <div className="timeline-icon">
              <ClockIcon />
            </div>
            <div className="timeline-content card">
              <div className="upcoming-info">
                <h4>{test.name}</h4>
                <p>
                  {new Date(test.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  at {test.time}
                </p>
              </div>
              <motion.button
                className="join-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Details
              </motion.button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  </motion.div>
);

const TestScheduleView = () => (
  <motion.div
    key="test-schedule"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <h1 className="view-title">Test Schedule</h1>
    <div className="schedule-list">
      {upcomingTests.map((test) => (
        <motion.div
          key={test.id}
          className="schedule-item card"
          variants={itemVariants}
        >
          <div className="schedule-date">
            <span className="month">
              {new Date(test.date).toLocaleString("en-GB", { month: "short" })}
            </span>
            <span className="day">{new Date(test.date).getDate()}</span>
          </div>
          <div className="schedule-details">
            <h3>{test.name}</h3>
            <p className="syllabus">
              <strong>Syllabus:</strong> {test.syllabus}
            </p>
          </div>
          <div className="schedule-meta">
            <span>
              <ClockIcon /> {test.time}
            </span>
            <span>{test.duration}</span>
            <motion.button
              className="start-test-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const ResultsView = () => (
  <motion.div
    key="results"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <h1 className="view-title">Recent Results</h1>
    <motion.div
      className="results-table-container card"
      variants={itemVariants}
    >
      <table className="results-table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Score</th>
            <th>Rank</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentResults.map((result) => (
            <motion.tr
              key={result.id}
              whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
            >
              <td>{result.name}</td>
              <td>{result.score}%</td>
              <td>#{result.rank}</td>
              <td>
                <span className={`status-tag ${result.status.toLowerCase()}`}>
                  {result.status}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </motion.div>
);

// --- Placeholder Icons (can be moved to a separate file) ---
// Simple SVG components for the buttons.
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px" }}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ marginRight: "8px" }}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.523.074-.797.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

// Animation Variants (assuming these are defined in the parent component)
const containersVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
};

const itemsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AskADoubtView = () => {
  const [username, setUserName] = useState("");
  useEffect(() => {
    // Retrieve the user data string from localStorage
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      // Parse the string back into a JavaScript object
      const userData = JSON.parse(userDataString);

      // Set the user's full name to the state
      setUserName(userData.full_name);
    }
  }, []);
  // IMPORTANT: Replace these with your actual contact details.
  const contactEmail = "support@yourplatform.com";
  const contactPhone = "911234567890"; // Use country code, no spaces or symbols.

  // Pre-fills the email subject for user convenience.
  const emailSubject = `Doubt from ${username || "a user"}`;

  return (
    <motion.div
      key="ask-doubt-contact"
      variants={containersVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="view-title">Have a Question?</h1>
      <motion.div className="contact-doubt-card card" variants={itemsVariants}>
        <p className="contact-description">
          For immediate assistance or to get your doubts cleared by our experts,
          please reach out to us directly using one of the options below.
        </p>
        <div className="contact-buttons">
          <motion.a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(
              emailSubject
            )}`}
            className="contact-button email"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EmailIcon />
            <span>Contact via Email</span>
          </motion.a>
          <motion.a
            href={`https://wa.me/${contactPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button whatsapp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WhatsAppIcon />
            <span>Chat on WhatsApp</span>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Component ---

const HomePage = () => {
  const [username, setUserName] = useState("");
  useEffect(() => {
    // Retrieve the user data string from localStorage
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      // Parse the string back into a JavaScript object
      const userData = JSON.parse(userDataString);

      // Set the user's full name to the state
      setUserName(userData.full_name);
    }
  }, []);
  const [activeItem, setActiveItem] = useState("");
  const [userDoubts, setUserDoubts] = useState(doubts);

  const sidebarMenuItems = [
    { name: "Dashboard", icon: <DashboardIcon /> },
    { name: "My Tests", icon: <MyTestsIcon /> },
    { name: "Test Schedule", icon: <ScheduleIcon /> },
    { name: "Results", icon: <ResultsIcon /> },
    { name: "Ask a Doubt", icon: <DoubtIcon /> },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "My Tests":
        return <MyTestsView />;
      case "Dashboard":
        return <DashBoardView />;
      case "Test Schedule":
        return <TestScheduleView />;
      case "Results":
        return <ResultsView />;
      case "Ask a Doubt":
        return (
          <AskADoubtView
            userDoubts={userDoubts}
            setUserDoubts={setUserDoubts}
          />
        );
      default:
        return <DashBoardView />;
    }
  };

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          {sidebarMenuItems.map((item) => (
            <motion.a
              href="#"
              key={item.name}
              className={`sidebar-btn ${
                activeItem === item.name ? "active" : ""
              }`}
              onClick={() => setActiveItem(item.name)}
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <motion.a
            href="#"
            className="sidebar-btn logout-btn"
            whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          >
            <LogoutIcon />
            <span>Logout</span>
          </motion.a>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="welcome-message">Welcome back, {username}!</h1>
        </header>
        <div className="dashboard-content">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const CircularProgress = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg className="progress-ring" width="120" height="120">
      <circle
        className="progress-ring-bg"
        strokeWidth="10"
        r={radius}
        cx="60"
        cy="60"
      />
      <motion.circle
        className="progress-ring-fg"
        strokeWidth="10"
        r={radius}
        cx="60"
        cy="60"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
        }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="progress-text"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default HomePage;
