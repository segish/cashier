import { useContext, useState } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./pages/Login";
import Shop from "./pages/ViewShopItems";
import Substore from "./pages/ViewSubStores";
import PendingShop from "./pages/PendingShopItems";
import PendingSsale from "./pages/PendingSaleItems";
import { AuthContext } from "./context/Context";

function App() {

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const ProtectedRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext)

    if (currentUser === null) {
      return <Navigate to="/login" />
      // return children

    } else {
      return children
    }
  }


  const Layout = () => {
    return (

      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (<ProtectedRoute>
        <Layout />
      </ProtectedRoute>),
      children: [
        {
          path: "/",
          element: <Shop />
        },
        {
          path: "/shop",
          element: <Shop />
        },
        {
          path: "/substore",
          element: <Substore />
        },
        {
          path: "/shoppendinng",
          element: <PendingShop />
        },
        {
          path: "/salespendinng",
          element: <PendingSsale />
        },
      ]
    },
    {
      path: "/login",
      element: <Login />,
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
