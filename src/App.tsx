import { UserProvider, useUser } from "./context/UserContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedLayout from "./components/ProtectedLayout";

const RedirectToHomeIfLoggedIn = () => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectToHomeIfLoggedIn />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
