import {Droplets, Thermometer} from "lucide-react";

export default function WeatherWidget({temp, hum}) {
    return (
        <div className="flex items-center gap-4  px-7 py-3 rounded-lg  text-4xl text-gray-900 font-semibold m-auto">
            <span className="flex items-center gap-1">
                <Thermometer size={40} className="text-red-500" />
                {temp}°C
            </span>
            <span className="text-gray-400">|</span>
            <span className="flex items-center gap-1">
                <Droplets size={40} className="text-blue-500" />
                {hum}%
            </span>
        </div>
    )
}