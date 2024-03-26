import React from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Bootstrap
import "bootstrap/dist/css/bootstrap.css";
// Global styles
import "./styles.scss";

// Pages and components
import Chat from "./components/Chat/Chat";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Homepage from "./pages/Homepage/Homepage";
import NotFoundPage from "./pages/NotFoungPage/NotFoundPage";
import ProjectViewPage from "./pages/ProjectViewPage/ProjectViewPage";
import LoginSignup from "./pages/SignupLoginpage/LoginSignup";
import LandingPage from "./pages/LandingPage/LandingPage";
// Contexts
import { UserProvider, useUser } from "./hooks/UserContext";
import Adminpage from "./pages/AdminPage/Adminpage";

// Declaration for google
declare global {
  interface Window {
    google: any;
  }
}

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Chat />
      <Footer />
    </>
  );
}

interface AuthRouteProps {
  children: React.ReactNode;
  // path: string;
}
const AuthRoute = ({ children }: AuthRouteProps) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} path="/projects">
            <Route
              path="/projects"
              element={
                <AuthRoute>
                  <Homepage />
                </AuthRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <AuthRoute>
                  <ProjectViewPage />
                </AuthRoute>
              }
            />
            <Route path="/projects/404" element={<NotFoundPage />} />
            <Route path="/projects/*" element={<Navigate to={"/projects/404"} />} />
          </Route>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/admin" element={<Adminpage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to={"/"}/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
