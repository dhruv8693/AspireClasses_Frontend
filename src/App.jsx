import { BrowserRouter, Routes, Route, Form } from "react-router-dom";
import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home/Landing Page */}
        <Route
          path="/"
          element={
            <>
              <main>
                <LandingPage />
              </main>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
