import Clock from "../components/Clock.jsx";
import UserWelcome from "../components/UserWelcome.jsx";
import WeatherWidget from "../components/WeatherWidget.jsx";

export default function Home() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
            <Clock />
            <UserWelcome firstname={"Adam"}/>
        </div>
    );
}