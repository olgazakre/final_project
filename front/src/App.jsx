import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AuthLoader from "./utils/AuthLoader";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import EditProfile from "./pages/EditProfile";
import RequireAuth from "./utils/RequireAuth";
import PublicRoute from "./utils/PublicRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthLoader />
        <Routes>
          <Route
            path="/auth/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/auth/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/*" element={<Layout />}>
              <Route path="" element={<Home />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="explore" element={<Explore />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
