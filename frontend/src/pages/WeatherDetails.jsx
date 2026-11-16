import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Graph from "../components/Graph.jsx";
import LogTable from "../components/LogTable.jsx";

const mockReadings = [
    { temperature: 20.5, humidity: 48, time: "2026-11-13T10:00:00" },
    { temperature: 21.2, humidity: 46, time: "2026-11-13T11:00:00" },
    { temperature: 22.8, humidity: 43, time: "2026-11-13T12:00:00" },
    { temperature: 23.4, humidity: 40, time: "2026-11-13T13:00:00" },
    { temperature: 22.1, humidity: 44, time: "2026-11-13T14:00:00" },
    { temperature: 21.0, humidity: 50, time: "2026-11-13T15:00:00" },
    { temperature: 19.8, humidity: 54, time: "2026-11-13T16:00:00" },
];

export default function WeatherDetails() {
    const { metric } = useParams(); // "temperature" lub "humidity"
    const isTemp = metric === "temperature";
    const [readings, setReadings] = useState(mockReadings);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/temperatures");
                if (!res.ok) throw new Error("Brak API");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setReadings([...data].reverse());
                }
            } catch {
                setReadings(mockReadings);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const dateLabels = readings.map(r => {
        const date = new Date(r.time);
        return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    });

    const chartData = {
        labels: dateLabels,
        datasets: [{
            label: isTemp ? "Temperatura (°C)" : "Wilgotność (%)",
            data: readings.map(r => isTemp ? r.temperature : r.humidity),
            borderColor: isTemp ? "rgba(255, 99, 132, 1)" : "rgba(53, 162, 235, 1)",
            backgroundColor: isTemp ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)",
        }]
    };

    const tableCols = [
        isTemp
            ? { header: "Temperatura (°C)", accessor: "temperature" }
            : { header: "Wilgotność (%)", accessor: "humidity" },
        { header: "Czas", accessor: "time" },
    ];

    return (
        <div className="flex-1 flex flex-col gap-6">
            <Link
                to="/weather"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 w-fit hover:bg-white/50 transition-all"
            >
                <ArrowLeft size={16} /> Powrót do pogody
            </Link>

            <h1 className="text-3xl font-bold text-gray-800">
                {isTemp ? "Szczegóły temperatury" : "Szczegóły wilgotności"}
            </h1>

            <div className="w-full">
                <Graph type="line" data={chartData} />
            </div>

            <LogTable data={readings} columns={tableCols} />
        </div>
    );
}