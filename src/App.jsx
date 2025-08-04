import React from "react";
import Navbar from "./Pages/Landing_Page/components/Navbar/Navbar";
import Hero from "./Pages/Landing_Page/components/Hero/Hero";
import Legacy from "./Pages/Landing_Page/components/Legacy/Legacy";
import Creators from "./Pages/Landing_Page/components/Creators/Creators";
import Features from "./Pages/Landing_Page/components/Features/Features";
import Pricing from "./Pages/Landing_Page/components/Pricing/Pricing";
import Contact from "./Pages/Landing_Page/components/Contact/Contact";
import Footer from "./Pages/Landing_Page/components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <Legacy />
        <Creators />
        <Features />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
