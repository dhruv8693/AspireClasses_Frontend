import React from "react";
import { motion } from "framer-motion";
import "./Creators.css";

const creators = [
  {
    name: "Ali Khan",
    role: "B.Tech Student",
    avatar: "https://placehold.co/100x100/EFEFEF/333333?text=AK",
  },
  {
    name: "Fatima Ahmed",
    role: "MBBS Student",
    avatar: "https://placehold.co/100x100/EFEFEF/333333?text=FA",
  },
  {
    name: "Zoya Mirza",
    role: "B.A. (Hons) Student",
    avatar: "https://placehold.co/100x100/EFEFEF/333333?text=ZM",
  },
];

const Creators = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section id="creators" className="creators-section">
      <div className="container">
        <h2>Crafted by AMU Insiders</h2>
        <p className="creators-intro">
          This test series isn't built by a faceless corporation. It's designed
          and curated by current AMU students who have successfully navigated
          the very entrance exam you're preparing for. Get insights that only a
          peer can provide.
        </p>
        <motion.div
          className="creators-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {creators.map((creator, index) => (
            <motion.div
              key={index}
              className="creator-card"
              variants={itemVariants}
            >
              <img
                src={creator.avatar}
                alt={creator.name}
                className="creator-avatar"
              />
              <h3 className="creator-name">{creator.name}</h3>
              <p className="creator-role">{creator.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Creators;
