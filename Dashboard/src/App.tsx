import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Tests from "./pages/tests/Tests";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import "./styles/global.scss";
import Test from "./pages/test/Test";
import Analytics from "./pages/analytics/Analytics";
import Courses from "./pages/courses/Courses";
import DescriptiveQuestions from "./components/alltests/test2";
import Mcq from "./components/alltests/test1";
import Login from "./pages/Login/login";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";


const queryClient = new QueryClient();

const isAuthenticated = () => {
  return sessionStorage.getItem("user") !== null;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {

  const Layout = () => {
    return (
      <div className="main" style={{overflowX: "hidden", height: "100%", width: "100%"}}>
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/tests",
          element: <Tests />,
        },
        {
          path: "/tests/evaluate/:id",
          element: <Test />,
        },
        {
          path: "/tests/attempt/1",
          element: <Mcq />,
        },
        {
          path: "/tests/attempt/2",
          element: <DescriptiveQuestions />,
        },
        {
          path: "/analytics",
          element: <Analytics />,
        },
        {
          path: "/courses",
          element: <Courses />,
        },    
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
