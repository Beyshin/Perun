import {useEffect, useState} from "react";
import { Link } from "react-router-dom"
import { Thermometer, Droplets, ArrowRight } from "lucide-react";
import { mockReadings } from "../components/MockReadings.jsx";

export default function Weather() {
    const [latest, setLatest] = useState(mockReadings[mockReadings.length - 1]);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await fetch("/api/temperatures");
                if (!res.ok) throw new Error("Brak API");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setLatest(data[0]);
                }
            } catch {
                setLatest(mockReadings[mockReadings.length - 1]);
            }
        };
        fetchLatest();
    }, []);

    return (
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Stacja pogodowa</h1>
            <p className="mt-2 text-gray-700">Aktualne pomiary — kliknij wybrany parametr, aby zobaczyć wykres i historię</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Temperatura</h2>
                            <p className="text-5xl font-bold text-gray-900 mt-4">{latest.temperature}°C</p>
                        </div>
                        <Thermometer size={64} className="text-red-500 opacity-80" />
                    </div>
                    <Link
                        to="/weather/temperature"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white/40 hover:bg-white/60 px-4 py-2.5 rounded-xl border border-white/50 w-fit transition-all"
                    >
                        Zobacz wykres i detale <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="bg-white/25 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Wilgotność</h2>
                            <p className="text-5xl font-bold text-gray-900 mt-4">{latest.humidity}%</p>
                        </div>
                        <Droplets size={64} className="text-blue-500 opacity-80" />
                    </div>
                    <Link
                        to="/weather/humidity"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white/40 hover:bg-white/60 px-4 py-2.5 rounded-xl border border-white/50 w-fit transition-all"
                    >
                        Zobacz wykres i detale <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}