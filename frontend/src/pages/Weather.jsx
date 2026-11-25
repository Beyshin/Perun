import {useEffect, useState} from "react";
import { Link } from "react-router-dom"
import { Thermometer, Droplets, ArrowRight } from "lucide-react";
import { mockReadings } from "../components/MockReadings.jsx";
import WeatherBlock from "../components/WeatherBlock.jsx";

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
                <WeatherBlock type="Temperatura" value={latest.temperature + "°C"} Icon={Thermometer} color="text-red-500" />
                <WeatherBlock type="Wilogtność" value={latest.humidity + "%"} Icon={Droplets} color="text-blue-500"/>
            </div>
        </div>
    );
}