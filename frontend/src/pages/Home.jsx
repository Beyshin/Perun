import Clock from "../components/Clock.jsx";
import UserWelcome from "../components/UserWelcome.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";
import ScrollDown from "../components/ScrollDown.jsx";
import {useRef} from "react";
import LightSwitch from "../components/LightSwitch.jsx";
import WeatherBlock from "../components/WeatherBlock.jsx";
import {Droplets, Thermometer} from "lucide-react";
import CurrentTemperature from "../components/CurrentTemperature.jsx";

export default function Home() {

    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }

    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center h-full">
                <Clock />
                <UserWelcome firstname={"Adam"}/>
                <ScrollDown size={90} color={"white"} onClick={scrollToBottom} />

            </div>
            <div ref={bottomRef} id="test" className="w-screen h-screen flex flex-col items-center justify-center">
                <div className="flex flex-row items-center justify-center w-full h-4/5 mt-auto gap-6">
                    <WeatherWidget temp={24} hum={24}/>
                    <WeatherBlock type="Temperatura" value={24 + "°C"} Icon={Thermometer} color="text-red-500" />
                    <WeatherBlock type="Wilogtność" value={24 + "%"} Icon={Droplets} color="text-blue-500"/>
                    <LightSwitch />
                    <CurrentTemperature/>
                </div>
            </div>
        </>
    );
}