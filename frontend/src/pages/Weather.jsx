import {useEffect, useState} from "react";

export default function Weather() {
    const [readings, setReadings] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try{
                console.log("Fetching data...")
                const res = await fetch("/api/temperatures");
                const data = await res.json()
                console.log(data)
                setReadings(data)
            }catch(e){
                console.log(e)
            }
        };

        fetchData()
    }, [])

    return (
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Weather</h1>
            <p className="mt-4 text-gray-600">Weather panel</p>

            <ul>
                {readings.map((reading, index) => (
                    <li key={index}>Temperatura: {reading.temperature} | Wilgotność: {reading.humidity} | Godzina: {reading.time} </li>
                ))}
            </ul>
        </div>
    )
}