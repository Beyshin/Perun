import { Home, Cloud, Lightbulb, LogOut, Thermometer, Droplets } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ weather }) {
    const [setPageIndex] = useState(0);

    const temp = weather?.temperature ?? 24;
    const hum = weather?.humidity ?? 45;

    const pagesList = [
        { id: 0, name: "Home", icon: Home, path: "/" },
        { id: 1, name: "Weather", icon: Cloud, path: "/weather" },
        { id: 2, name: "Light", icon: Lightbulb, path: "/light" },
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] h-20 bg-white/20 backdrop-blur-md border border-gray-300/50 rounded-xl flex flex-row px-10 items-center justify-between shadow-sm">
            <ul className="h-full flex flex-row items-center gap-8 relative">
                {pagesList.map((page, index) => {
                    const Icon = page.icon;
                    return (
                        <li
                            className="flex justify-center items-center px-2 cursor-pointer"
                            key={index}
                            onClick={() => setPageIndex(index)}
                        >
                            <Link to={page.path}>
                                <Icon
                                    className="hover:scale-120 transition-all duration-200"
                                    size={30}
                                    color="#374151"
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>


             {/*Wstępnie tylko do podglądu*/}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white/30 px-3.5 py-1.5 rounded-lg border border-white/40 text-sm font-medium text-gray-800">
                    <span className="flex items-center gap-1">
                        <Thermometer size={16} className="text-red-500" />
                        {temp}°C
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="flex items-center gap-1">
                        <Droplets size={16} className="text-blue-500" />
                        {hum}%
                    </span>
                </div>

                <div className="flex justify-center items-center cursor-pointer">
                    <LogOut
                        className="hover:scale-120 duration-200 transition-all"
                        size={24}
                        color="#374151"
                    />
                </div>
            </div>
        </nav>
    );
}