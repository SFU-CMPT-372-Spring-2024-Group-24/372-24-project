import React from 'react'
import ReactDOM from 'react-dom/client'
import { Outlet, RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
// Global styles
import './styles.scss';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Homepage from './pages/Homepage/Homepage';
import NotFoundPage from './pages/NotFoungPage/NotFoundPage';
import ProjectViewPage from './pages/ProjectViewPage/ProjectViewPage';

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

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Homepage />
      },
      {
        path: '/projectview',
        element: <ProjectViewPage />
      },
      {
        path: 'error-not-found',
        element: <NotFoundPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
