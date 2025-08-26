// TestPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TestOverview from "./TestOverview";
import TestInterface from "./TestInterface";
import { AnimatePresence } from "framer-motion";

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tests");
        console.log("Fetched tests:", res.data);
        setTests(res.data || []);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <p>Loading tests...</p>;

  return (
    <AnimatePresence mode="wait">
      {!selectedTest ? (
        <div key="overview-list">
          <h2>Available Tests</h2>
          {tests.length === 0 ? (
            <p>No tests available</p>
          ) : (
            tests.map((test) => (
              <TestOverview
                key={test.id}
                testName={test.test_name}
                subject={test.subject_topic}
                questionCount={test.num_questions}
                duration={test.duration_minutes}
                onStartTest={() => setSelectedTest(test)}
              />
            ))
          )}
        </div>
      ) : (
        <TestInterface
          key="interface"
          id={selectedTest.id}
          duration={selectedTest.duration_minutes} // ✅ PASS THE DURATION PROP
          onBack={() => setSelectedTest(null)}
        />
      )}
    </AnimatePresence>
  );
};

export default TestPage;
