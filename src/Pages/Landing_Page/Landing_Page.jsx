// src/landing_page.jsx

import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FaBookOpen,
  FaBullseye,
  FaChartLine,
  FaUsers,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { TfiAgenda } from "react-icons/tfi";

// React-Bootstrap Components
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";

import logo from "./logo.png";
import "./Landing_Page.css"; // We'll use a much smaller CSS file

// Reusable animation variants (unchanged)
const sectionFadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cardHover = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 300 },
};

// Helper component for animated sections (unchanged)
const AnimatedSection = ({ children, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionFadeIn}
      className="py-5" // Bootstrap padding utility
    >
      {children}
    </motion.section>
  );
};

// --- Component Definitions (Refactored with React-Bootstrap) ---

const AppNavbar = () => {
  return (
    <Navbar
      variant="dark"
      expand="lg"
      sticky="top"
      className="navbar-custom" // Custom class for backdrop filter
    >
      <Container>
        <Navbar.Brand href="/#home">
          <img src={logo} alt="PrepSphere Logo" className="nav-logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/#home">Home</Nav.Link>
            <Nav.Link href="/#why-us">Why Us</Nav.Link>
            <Nav.Link href="/#features">Features</Nav.Link>
            <Nav.Link href="/#exams">Exams</Nav.Link>
            <Nav.Link href="/#pricing">Pricing</Nav.Link>
            <Nav.Link href="/#contact">Contact</Nav.Link>
            <Button
              as={Link}
              to="/register"
              variant="primary"
              className="ms-lg-2 mt-2 mt-lg-0"
            >
              Register Now
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const Hero = () => (
  <motion.div
    id="home"
    className="hero-section d-flex align-items-center text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <Container>
      <motion.h1
        className="display-3 fw-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Unlock Your Potential
        <br />
        Conquer Your Entrance Exam
      </motion.h1>
      <motion.p
        className="lead my-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        High-quality, affordable test series crafted by successful students to
        empower your journey to top schools.
      </motion.p>
      <motion.div
        className="d-grid gap-2 d-sm-flex justify-content-sm-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Button
          as={Link}
          to="/register"
          variant="primary"
          size="lg"
          className="px-4 gap-3"
        >
          Start Your Test Series
        </Button>
        <Button
          href="#exams"
          variant="outline-secondary"
          size="lg"
          className="px-4"
        >
          Explore Exams
        </Button>
      </motion.div>
    </Container>
  </motion.div>
);

const WhyChooseUs = () => (
  <AnimatedSection id="why-us">
    <Container>
      <h2 className="text-center display-5 mb-3">Why Choose AspireClasses?</h2>
      <p className="text-center text-muted fs-5 mb-5">
        We focus on what truly matters for your success.
      </p>
      <Row className="g-4">
        {[
          {
            icon: <TfiAgenda className="card-icon" />,
            title: "Legacy of Excellence: AMU",
            text: "Master the AMU 9th Entrance with test series designed around its prestigious and unique pattern, giving you a competitive edge.",
          },
          {
            icon: <FaBookOpen className="card-icon" />,
            title: "Diverse Exam Coverage",
            text: "Beyond AMU, we offer expertly crafted series for JMI, Sainik School, Navodaya, ensuring comprehensive preparation for all your goals.",
          },
          {
            icon: <FaUsers className="card-icon" />,
            title: "Created by Achievers",
            text: "Our content is developed by students who have successfully cleared these very exams, providing insights you can't find anywhere else.",
          },
        ].map((item, index) => (
          <Col md={4} key={index}>
            <motion.div whileHover={cardHover} className="h-100">
              <Card className="h-100 text-center glass-card">
                <Card.Body>
                  {item.icon}
                  <Card.Title as="h3" className="mb-2">
                    {item.title}
                  </Card.Title>
                  <Card.Text>{item.text}</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      <CredibilitySection />
    </Container>
  </AnimatedSection>
);

const CredibilitySection = () => (
  <div className="mt-5">
    <h3 className="text-center fs-2 mb-4">From Those Who've Walked the Path</h3>
    <Row className="g-4 justify-content-center">
      <Col md={5}>
        <Card className="glass-card">
          <Card.Body className="text-center">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Student avatar 1"
              className="avatar mb-3"
            />
            <blockquote className="blockquote mb-2">
              <p>
                "The mock tests were almost identical to the real exam. It made
                all the difference."
              </p>
            </blockquote>
            <footer className="blockquote-footer">
              Aisha K., <cite title="Source Title">AMU Class IX</cite>
            </footer>
          </Card.Body>
        </Card>
      </Col>
      <Col md={5}>
        <Card className="glass-card">
          <Card.Body className="text-center">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="Student avatar 2"
              className="avatar mb-3"
            />
            <blockquote className="blockquote mb-2">
              <p>
                "The analytics helped me pinpoint my weak areas. Invaluable for
                my JMI prep!"
              </p>
            </blockquote>
            <footer className="blockquote-footer">
              Rohan S., <cite title="Source Title">JMI Aspirant</cite>
            </footer>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

const Features = () => (
  <AnimatedSection id="features">
    <Container>
      <h2 className="text-center display-5 mb-5">Features Built for Victory</h2>
      <Row className="g-4">
        {[
          {
            icon: <FaBullseye />,
            title: "Realistic Mock Tests",
            text: "Simulate the actual exam environment to build confidence and time management skills.",
          },
          {
            icon: <FaBookOpen />,
            title: "Previous Year Papers",
            text: "Analyze trends and understand the exam pattern with a vast library of past papers.",
          },
          {
            icon: <FaChartLine />,
            title: "Performance Analytics",
            text: "Get detailed reports on your strengths and weaknesses to focus your efforts effectively.",
          },
          {
            icon: <FaUsers />,
            title: "Expert Doubt Support",
            text: "Clarify your doubts with our team of mentors who have aced these exams.",
          },
        ].map((feature, index) => (
          <Col lg={3} md={6} key={index}>
            <motion.div whileHover={cardHover} className="h-100">
              <Card className="h-100 text-center glass-card">
                <Card.Body>
                  <div className="card-icon text-primary">{feature.icon}</div>
                  <Card.Title as="h3">{feature.title}</Card.Title>
                  <Card.Text>{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  </AnimatedSection>
);

const ExamsOffered = () => (
  <AnimatedSection id="exams">
    <Container>
      <h2 className="text-center display-5 mb-5">Exams We Cover</h2>
      <Row className="justify-content-center text-center g-3">
        <Col md={3} sm={6}>
          <div className="p-4 border rounded bg-primary text-white fs-5 fw-bold">
            AMU 9th Entrance
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div className="p-4 border rounded fs-5 fw-bold">
            Navodaya (JNVST)
          </div>
        </Col>
        <Col md={3} sm={6}>
          <div className="p-4 border rounded bg-light text-muted fs-5 fw-bold">
            Coming Soon
          </div>
        </Col>
      </Row>
    </Container>
  </AnimatedSection>
);

const Pricing = () => (
  <AnimatedSection id="pricing">
    <Container>
      <h2 className="text-center display-5 mb-3">Simple & Affordable Access</h2>
      <Row className="justify-content-center">
        <Col lg={5} md={8}>
          <Card className="text-center border-primary border-2 shadow-lg">
            <Card.Header as="h3" className="bg-primary text-white">
              All-Access Pass
            </Card.Header>
            <Card.Body>
              <Card.Title className="display-4 fw-bold my-3">
                ₹699{" "}
                <span className="fs-5 text-muted fw-normal">/ Full Access</span>
              </Card.Title>
              <ul className="list-unstyled my-4">
                <li>✓ Access to All Test Series</li>
                <li>✓ Unlimited Mock Tests</li>
                <li>✓ Detailed Performance Analytics</li>
                <li>✓ Previous Year Question Papers</li>
                <li>✓ 24/7 Doubt Support via Chat</li>
              </ul>
              <Button
                href="#contact"
                variant="primary"
                size="lg"
                className="w-100"
              >
                Get Started Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </AnimatedSection>
);

const Contact = () => (
  <AnimatedSection id="contact">
    <Container className="text-center">
      <h2 className="display-5">Ready to Begin?</h2>
      <p className="lead text-muted">
        Reach out to us and take the first step towards your dream school.
      </p>
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
        <Button
          href="https://wa.me/910000000000" // Replace with your number
          target="_blank"
          rel="noopener noreferrer"
          variant="success"
          size="lg"
          className="d-inline-flex align-items-center justify-content-center"
        >
          <FaWhatsapp className="me-2" /> Chat on WhatsApp
        </Button>
        <Button
          href="mailto:support@prepsphere.com"
          variant="outline-secondary"
          size="lg"
          className="d-inline-flex align-items-center justify-content-center"
        >
          <FaEnvelope className="me-2" /> Send an Email
        </Button>
      </div>
    </Container>
  </AnimatedSection>
);

const AppFooter = () => (
  <footer className="py-4 text-center">
    <Container>
      <div className="social-links mb-3">
        <a href="#" className="fs-4 text-muted mx-2">
          <FaInstagram />
        </a>
        <a href="#" className="fs-4 text-muted mx-2">
          <FaFacebook />
        </a>
        <a href="#" className="fs-4 text-muted mx-2">
          <FaEnvelope />
        </a>
      </div>
      <p className="text-muted">
        &copy; {new Date().getFullYear()} AspireClasses. All Rights Reserved.
      </p>
    </Container>
  </footer>
);

// --- Main Landing Page Component ---
const LandingPage = () => {
  return (
    <>
      <AppNavbar />
      <main>
        <Hero />
        <WhyChooseUs />
        <Features />
        <ExamsOffered />
        <Pricing />
        <Contact />
      </main>
      <AppFooter />
    </>
  );
};

export default LandingPage;
