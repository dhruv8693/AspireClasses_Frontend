import { BrowserRouter, Routes, Route, Form } from "react-router-dom";
import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";
import Register from "./Pages/Register_page/Register_Page.jsx";
import HomePage from "./Pages/Home_Page/Home_Page.jsx";
import TestPage from "./Pages/Test_Interface/TestPage.jsx";
import LoginPage from "./Pages/Login_Page/Login_Page.jsx";
import ShoppingPage from "./Pages/Shopping_Page/Shopping_Page.jsx";
import UserDetailForm from "./Pages/UserDetail_Page/User_Detail.jsx";
import AdminPage from "./Pages/Admin_Page/Admin_Page.jsx";
import "./App.css";
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
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/tests/:id" element={<TestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShoppingPage />} />
        <Route path="/UserDetails" element={<UserDetailForm />} />
        <Route path="/Admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
