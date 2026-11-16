import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const backgrounds = {
    sunny: "/images/sunny.mp4",
    rainy: "/images/rainy.mp4",
    cold: "/images/cold.mp4",
};

export default function Layout() {
    const [weather, setWeather] = useState({ temperature: 24, humidity: 45 });

    useEffect(() => {
        const fetchCurrentWeather = async () => {
            try {
                const res = await fetch("/api/temperatures");
                if (!res.ok) return;
                const data = await res.json();
                if (data && data.length > 0) {
                    setWeather(data[0]);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchCurrentWeather();
        const interval = setInterval(fetchCurrentWeather, 10000);
        return () => clearInterval(interval);
    }, []);

    const activeType = weather.humidity >= 75 
        ? "rainy" 
        : weather.temperature <= 10 
        ? "cold" 
        : "sunny";

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden font-sans">
            {Object.entries(backgrounds).map(([key, src]) => {
                const isActive = key === activeType;
                return (
                    <video
                        key={key}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ease-in-out ${
                            isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                );
            })}

            <div
                className={`fixed inset-0 z-10 pointer-events-none transition-colors duration-1000 ease-in-out ${
                    activeType === "rainy" ? "bg-slate-950/45" : "bg-black/20"
                }`}
            />

            <Sidebar weather={weather} />

            <main className="relative z-20 pt-28 px-8 pb-10 w-full">
                <Outlet />
            </main>

            <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-white/30 backdrop-blur-md p-2 rounded-xl border border-white/40 text-xs">
                <button onClick={() => setWeather({ temperature: 26, humidity: 40 })} className="px-2 py-1 bg-yellow-400/80 rounded cursor-pointer">☀️ Ciepło</button>
                <button onClick={() => setWeather({ temperature: 16, humidity: 85 })} className="px-2 py-1 bg-blue-400/80 text-white rounded cursor-pointer">🌧️ Deszcz</button>
                <button onClick={() => setWeather({ temperature: 4, humidity: 55 })} className="px-2 py-1 bg-cyan-200/80 rounded cursor-pointer">❄️ Zimno</button>
            </div>
        </div>
    );
}