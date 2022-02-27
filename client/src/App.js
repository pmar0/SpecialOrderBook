import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Verify from "./components/verify";
import Dashboard from "./components/dashboard";
import CreateOrder from "./components/createOrder";
import EditOrder from "./components/editOrder";
import Redirect from "./components/redirect";
import NavBar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<Redirect/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify/:userId/" element={<Verify/>}/>
        <Route path="/verify/:userId/:verifyCode" element={<Verify/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/special_order/create" element={<CreateOrder/>}/>
        <Route path="/special_order/edit/:id" element={<EditOrder/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
