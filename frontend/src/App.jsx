import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx"
import Light from "./pages/Light.jsx";
import Weather from "./pages/Weather.jsx"
import WeatherDetails from "./pages/WeatherDetails.jsx";

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path="/weather" element={<Weather/>} />
                <Route path="/light" element={<Light/>} />
                <Route path="weather/:metric" element={<WeatherDetails />} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
