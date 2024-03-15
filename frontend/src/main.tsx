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
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Homepage from "./pages/Homepage/Homepage";
import NotFoundPage from "./pages/NotFoungPage/NotFoundPage";
import ProjectViewPage from "./pages/ProjectViewPage/ProjectViewPage";
import LoginSignup from "./pages/SignupLoginpage/LoginSignup";

// Contexts
import { UserProvider, useUser } from "./hooks/UserContext";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

interface AuthRouteProps {
  children: React.ReactNode;
  path: string;
}
const AuthRoute = ({ children, path }: AuthRouteProps) => {
  const { user } = useUser();

  if (!user && path !== "/login") {
    return <Navigate to="/login" />;
  }

  if (user && path === "/login") {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route
            path="/"
            element={
              <AuthRoute path="/">
                <Homepage />
              </AuthRoute>
            }
          />
          <Route
            path="/projectview"
            element={
              <AuthRoute path="/projectview">
                <ProjectViewPage />
              </AuthRoute>
            }
          />
          <Route path="error-not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginSignup />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
