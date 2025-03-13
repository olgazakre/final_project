import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Register from "./components/Register";
import Login from "./components/Login";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AuthLoader from "./utils/AuthLoader";

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
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
