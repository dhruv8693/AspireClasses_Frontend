import React from "react";
import { motion } from "framer-motion";
import "./Pricing.css";

const pricingPlans = [
  {
    plan: "Basic",
    price: "Free",
    features: [
      "1 Full Mock Test",
      "Access to 2 Previous Year Papers",
      "Basic Performance Analytics",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    plan: "Premium",
    price: "₹499",
    duration: "/ lifetime",
    features: [
      "10+ Full Mock Tests",
      "All Previous Year Papers",
      "Timed Test Sessions",
      "Detailed Analytics & Reports",
      "Priority Support",
    ],
    cta: "Get Premium Access",
    popular: true,
  },
];

const Pricing = () => {
  const cardVariants = {
    offscreen: { y: 100, opacity: 0 },
    onscreen: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <h2>Choose Your Plan</h2>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              custom={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <h3 className="plan-name">{plan.plan}</h3>
              <div className="plan-price">
                {plan.price}{" "}
                <span className="plan-duration">{plan.duration}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>
              <motion.button
                className="plan-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
