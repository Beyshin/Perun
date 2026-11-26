import {ArrowRight, Thermometer} from "lucide-react";
import {Link} from "react-router-dom";


export default function WeatherBlock({type, value, Icon, color}) {

    const page = type == "Temperatura" ? "temperature" : "humidity";

    return (
        <div className="bg-white/25  border border-white/40 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{type}</h2>
                    <p className="text-5xl font-bold text-gray-900 mt-4">{value}</p>
                </div>
                <Icon size={64} className={`opacity-80 ${color}`} />
            </div>
            <Link
                to={`/weather/${page}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white/40 hover:bg-white/60 px-4 py-2.5 rounded-xl border border-white/50 w-fit transition-all"
            >
                Zobacz wykres i detale <ArrowRight size={16} />
            </Link>
        </div>
    );

}