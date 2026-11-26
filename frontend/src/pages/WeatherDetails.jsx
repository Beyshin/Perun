import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Graph from "../components/Graph.jsx";
import LogTable from "../components/LogTable.jsx";
import { mockReadings } from "../components/MockReadings.jsx";
import Loading from "../components/Loading.jsx";

function formatReadings(list) {
    return list.map((r) => ({
        ...r,
        timeFormatted: new Date(r.time).toLocaleTimeString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }),
    }));
}


export default function WeatherDetails() {
    const { metric } = useParams();
    const isTemp = metric === "temperature";
    const [readings, setReadings] = useState(() => formatReadings(mockReadings));
    const [period, setPeriod] = useState("week");
    const [isLoading, setIsLoading] = useState(true);

    const formatDateOnly = (isoTime) =>
        new Date(isoTime).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            ...(period === "year" ? { year: "2-digit" } : {}),
        });

    const periodLabel = period === "week" ? "Ostatni tydzień" : period === "month" ? "Ostatni miesiąc" : "Ostatni rok";

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {

                const res = await fetch("/api/temperatures");
                if (!res.ok) throw new Error("Brak API");
                const data = await res.json();
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setReadings(formatReadings([...data].reverse()));
                }
            } catch {
                if (!cancelled) {
                    setReadings(formatReadings(mockReadings));
                }
            }finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        const interval = setInterval(load, 5000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const days = period === "week" ? 7 : period === "month" ? 30 : 365;

    const latestTime = readings.reduce((max, r) => {
        const t = new Date(r.time).getTime();
        return t > max ? t : max;
    }, 0);

    //cutoff w milisekundach
    const cutoff = latestTime - days * 24 * 60 * 60 * 1000;

    const filteredReadings = readings
        .filter((r) => new Date(r.time).getTime() >= cutoff)
        .sort((a, b) => new Date(a.time) - new Date(b.time));


    const today = new Date().toDateString();

    const dayReadings = readings.filter(
        (r) => new Date(r.time).toDateString() === today
    );
    const dayChartData = {
        labels: dayReadings.map((r) =>
            new Date(r.time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
        ),
        datasets: [
            {
                label: isTemp ? "Temperatura – dzień (°C)" : "Wilgotność – dzień (%)",
                data: dayReadings.map((r) => (isTemp ? r.temperature : r.humidity)),
                borderColor: isTemp ? "rgba(255, 99, 132, 1)" : "rgba(53, 162, 235, 1)",
                backgroundColor: isTemp ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const chartData = {
        labels: filteredReadings.map((r) => formatDateOnly(r.time)),
        datasets: [
            {
                label: isTemp ? "Temperatura (°C)" : "Wilgotność (%)",
                data: readings.map((r) => (isTemp ? r.temperature : r.humidity)),
                borderColor: isTemp ? "rgba(255, 99, 132, 1)" : "rgba(53, 162, 235, 1)",
                backgroundColor: isTemp ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const tableCols = [
        isTemp
            ? { header: "Temperatura (°C)", accessor: "temperature" }
            : { header: "Wilgotność (%)", accessor: "humidity" },
        { header: "Czas", accessor: "timeFormatted" },
    ];


    if(isLoading) {
        return <Loading />;
    }

return (
        <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/weather"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/40 w-fit hover:bg-white/45 transition-all"
                    >
                        <ArrowLeft size={16} /> Powrót do pogody
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900">
                        {isTemp ? "Szczegóły temperatury" : "Szczegóły wilgotności"}
                    </h1>
                </div>

                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="bg-white/30 backdrop-blur-md text-sm font-semibold text-gray-900 px-3 py-2 rounded-xl border border-white/40 outline-none cursor-pointer"
                >
                    <option value="week" className="bg-slate-100 text-gray-900">Ostatni tydzień</option>
                    <option value="month" className="bg-slate-100 text-gray-900">Ostatni miesiąc</option>
                    <option value="year" className="bg-slate-100 text-gray-900">Ostatni rok</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="min-w-0">
                    <Graph type="line" title="Ostatnie 24 godziny" data={dayChartData} />
                </div>
                <div className="min-w-0">
                    <Graph type="line" title={periodLabel} data={chartData} />
                </div>
            </div>
            <LogTable data={filteredReadings} columns={tableCols} />
        </div>
    );
}