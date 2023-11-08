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
import ChangePss from "./pages/ChangePassword";
import Substore from "./pages/ViewSubStores";
import PendingShop from "./pages/PendingShopItems";
import PendingSsale from "./pages/PendingSaleItems";
import Credits from "./pages/Credit";
import ForgotPassword from "./pages/ForgotPassword";
import History from "./pages/History";
import Expense from "./pages/Expense";
import SaleHistory from "./pages/SalesHistory";
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
            {isMobile ? <main className="content" style={{ padding: 0 }}>
              <Topbar setIsSidebar={setIsSidebar} />
              <Outlet />
            </main> :
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
        {
          path: "/credits",
          element: <Credits />
        },
        {
          path: "/storehistory",
          element: <History />
        },
        {
          path: "/saleshistory",
          element: <SaleHistory />
        },
        {
          path: "/exspense_pending",
          element: <Expense />
        },
        {
          path: "/change-password",
          element: <ChangePss />
        },
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot_pass",
      element: <ForgotPassword />,
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
