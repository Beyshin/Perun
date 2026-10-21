import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx"
import Light from "./pages/Light.jsx";
import Weather from "./pages/Weather.jsx"

function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path="/weather" element={<Weather/>} />
                <Route path="/light" element={<Light/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
