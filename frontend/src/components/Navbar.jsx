import { Home, Cloud, Lightbulb, LogOut, Thermometer, Droplets } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import WeatherWidget from "./WeatherWidget.jsx";

export default function Navbar({ weather }) {

    const temp = weather?.temperature ?? 24;
    const hum = weather?.humidity ?? 45;

    //const icon_color = "#101828";
    const icon_color = "#ffffff";

    const pagesList = [
        { id: 0, name: "Home", icon: Home, path: "/" },
        { id: 1, name: "Weather", icon: Cloud, path: "/weather" },
        { id: 2, name: "Light", icon: Lightbulb, path: "/light" },
    ];

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] h-25 bg-white/20 border border-gray-300/50 rounded-xl flex flex-row px-10 items-center justify-between shadow-sm">
            <ul className="h-full flex flex-row items-center gap-8 relative">
                {pagesList.map((page, index) => {
                    const Icon = page.icon;
                    return (
                        <li
                            className="flex justify-center items-center px-2 cursor-pointer"
                            key={index}
                        >
                            <Link to={page.path}>
                                <Icon
                                    className="hover:scale-120 transition-all duration-200"
                                    size={45}
                                    color={icon_color}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>


            {/* Możliwość ustawienia na srodku navbara widgeta od pogody */}

            {/*<div className="absolute left-1/2 -translate-x-1/2">*/}
            {/*    <WeatherWidget temp={temp} hum={hum} />*/}
            {/*</div>*/}

             {/*Wstępnie tylko do podglądu*/}
            <div className="flex items-center gap-6">
                <WeatherWidget temp={temp} hum={hum} />
                <div className="flex justify-center items-center cursor-pointer">
                    <LogOut
                        className="hover:scale-120 duration-200 transition-all"
                        size={40}
                        color={icon_color}
                    />
                </div>
            </div>
        </nav>
    );
}