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
import Messages from "./pages/Messages";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthLoader />
        <Routes>
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<RequestPasswordReset />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/*" element={<Layout />}>
            <Route path="" element={<Home />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="explore" element={<Explore />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
