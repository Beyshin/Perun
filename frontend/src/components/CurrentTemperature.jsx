import { useEffect, useState } from "react";
import { Thermometer, ThermometerSnowflake, ThermometerSun } from "lucide-react";

export default function CurrentTemperature() {
    const [currentTemperature, setCurrentTemperature] = useState(null);
    const [theme, setTheme] = useState({
        bg: "from-gray-400 to-gray-600",
        icon: Thermometer
    });

    useEffect(() => {
        if (currentTemperature === null || currentTemperature === "") {
            setTheme({ bg: "from-slate-400 to-slate-600", icon: Thermometer });
        } else if (currentTemperature >= 30) {
            setTheme({ bg: "from-rose-500 to-red-600", icon: ThermometerSun });
        } else if (currentTemperature < 30 && currentTemperature >= 20) {
            setTheme({ bg: "from-orange-400 to-amber-500", icon: ThermometerSun });
        } else if (currentTemperature >= 10 && currentTemperature < 20) {
            setTheme({ bg: "from-emerald-400 to-teal-500", icon: Thermometer });
        } else {
            setTheme({ bg: "from-cyan-500 to-blue-600", icon: ThermometerSnowflake });
        }
    }, [currentTemperature]);

    const Icon = theme.icon;

    return (
        <div className={`relative flex flex-col justify-between w-80 h-80 p-8 rounded-[40px] shadow-2xl transition-all duration-700 bg-gradient-to-br ${theme.bg} text-white overflow-hidden`}>

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-center relative z-10">
                <span className="font-semibold tracking-wider uppercase text-sm text-white/80">
                    Aktualna Temp.
                </span>
                <Icon size={28} className="text-white/90" />
            </div>

            <div className="flex justify-center items-center flex-1 relative z-10">
                {currentTemperature === null || currentTemperature === "" ? (
                    <div className="text-3xl font-medium text-white/90">
                        Brak odczytu
                    </div>
                ) : (
                    <div className="flex items-start">
                        <span className="text-7xl font-bold tracking-tighter">
                            {currentTemperature}
                        </span>
                        <span className="text-3xl font-medium mt-2 ml-1 opacity-80">
                            °C
                        </span>
                    </div>
                )}

                <button onClick={async () => {
                    const res = await fetch("/api/temperatures/trigger", {
                        method: "POST",

                    })
                }}> Test</button>
            </div>

        </div>
    );
}