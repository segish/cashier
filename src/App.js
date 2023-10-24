import { useContext, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./pages/Login";
import Shop from "./pages/ViewShopItems";
import Substore from "./pages/ViewSubStores";
import PendingShop from "./pages/PendingShopItems";
import PendingSsale from "./pages/PendingSaleItems";
import { AuthContext } from "./context/Context";

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = ({ children }) => {

    if (!currentUser) {
      return <Navigate to="/login" />
    } else {
      return children
    }
  }
  const ProtectedRouteFromSubstore = ({ children }) => {

    if (!currentUser.isSubstore) {
      return <Navigate to="/" />
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
            {isMobile ? <main className="content" style={{padding:0}}>
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main>:
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main>}
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
          element: <ProtectedRouteFromSubstore>
            <Substore />
          </ProtectedRouteFromSubstore>
        },
        {
          path: "/shoppendinng",
          element: <ProtectedRouteFromSubstore>
            <PendingShop />
            </ProtectedRouteFromSubstore>
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
