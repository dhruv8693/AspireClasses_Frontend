import {
  BrowserRouter,
  Routes,
  Route,
  Form,
  useNavigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./Pages/Landing_Page/Landing_Page.jsx";
import Register from "./Pages/Register_page/Register_Page.jsx";
import HomePage from "./Pages/Home_Page/Home_Page.jsx";
import TestPage from "./Pages/Test_Interface/TestPage.jsx";
import LoginPage from "./Pages/Login_Page/Login_Page.jsx";
import ShoppingPage from "./Pages/Shopping_Page/Shopping_Page.jsx";
import UserDetailForm from "./Pages/UserDetail_Page/User_Detail.jsx";
import AdminLogin from "./Pages/Admin_Page/AdminLogin";
import PrivateRoute from "./Pages/Admin_Page/PrivateRoute";
import AdminDashboard from "./Pages/Admin_Page/AdminDashboard";
import AssignTest from "./Pages/Admin_Page/AssignTest";
import { UpdateQuestions } from "./Pages/Admin_Page/UpdateQuestions.jsx";
import CreateNewTest from "./Pages/Admin_Page/CreateNewTest.jsx";

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
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            {/* Nested routes will render inside AdminDashboard's <Outlet> */}
            <Route path="assign-test" element={<AssignTest />} />
            <Route path="update-questions" element={<UpdateQuestions />} />
            <Route path="create-test" element={<CreateNewTest />} />
          </Route>
        </Route>
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/tests/:id" element={<TestPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShoppingPage />} />
        <Route path="/UserDetails" element={<UserDetailForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
