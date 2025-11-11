import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout"; // adjust path if needed
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Impact from "./pages/Impact";
import Insights from "./pages/Insights";
import Rewards from "./pages/Rewards";
import ProfilePage from "./pages/Profile";
import Tracker from "./pages/Tracker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes wrapped in Layout */}
        <Route element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/insights" element={<Insights/>}/>
          <Route path="/rewards" element={<Rewards/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/tracker" element={<Tracker/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
