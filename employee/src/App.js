import "./App.css";
import Footer from "./Components/Footer/Footer";
import { useAuthContext } from "./Hooks/useAuthContext";
import HomePage from "./Pages/Home/HomePage";
import LeadsPage from "./Pages/Leads/LeadsPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import SchedulePage from "./Pages/Schedule/SchedulePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";

function Layout({ children }) {
  const location = useLocation();

  const hideFooter = location.pathname === "/auth";

  return (
    <div className="app-layout">
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  const { emp } = useAuthContext();
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route
              path="/auth"
              element={emp ? <Navigate to="/home" replace /> : <LoginPage />}
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  {" "}
                  <HomePage />{" "}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <LeadsPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePage />{" "}
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="*"
              element={<Navigate to={emp ? "/home" : "/auth"} replace />}
            />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
