import {useEffect, useState} from "react";
import Graph from "../components/Graph.jsx";

export default function Weather() {
    const [readings, setReadings] = useState([])
    const [temperatureData, setTemperatureData] = useState({
        labels: [],
        datasets: [{}]
    });
    const [humidityData, setHumidityData] = useState({
        labels: [],
        datasets: [{}]
    });

    useEffect(() => {
        const fetchData = async () => {
            try{
                console.log("Fetching data...")
                const res = await fetch("/api/temperatures");
                const data = await res.json()
                setReadings(data.reverse())
            }catch(e){
                console.log(e)
            }
        };

        fetchData();

        //TODO: zmienic interwał na websockety
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        let data = readings;
        const dateLabels = data.map(r => {
            const date = new Date(r.time)
            return date.toLocaleDateString("pl-PL", {});
        })
        console.log(dateLabels);

        const temperatures = data.map(r => r.temperature);
        console.log(temperatures)

        setTemperatureData({
            labels: dateLabels,
            datasets: [{
                label: 'Temperatura (°C)',
                data: temperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }]
        })

        const humidities = data.map(r => r.humidity)
        console.log("Wilgotnosci:" + humidities)

        setHumidityData({
            labels: dateLabels,
            datasets: [{
                label: "Wilgotność (%)",
                data: humidities,
        }]
        })

    }, [readings])


    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            y: {
                beginAtZero: false,
            },
        }
    };


    return (
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Stacja pogodowa</h1>
            <p className="mt-4 text-gray-600">Panel pogodowy</p>

            <ul>
                {readings.map((reading, index) => (
                    <li key={index}>Temperatura: {reading.temperature} | Wilgotność: {reading.humidity} | Godzina: {reading.time} </li>
                ))}
            </ul>
            <div className="flex flex-wrap flex-row w-full">
                {temperatureData.datasets && temperatureData.datasets.length > 0 && (
                    <Graph type="line" data={temperatureData} options={options} />
                )}

                {humidityData.datasets && humidityData.datasets.length > 0 && (
                    <Graph type="line" data={humidityData} options={options} />
                )}
            </div>
        </div>
    )
}