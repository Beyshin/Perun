import { useEffect, useState } from "react";

export default function Clock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const time = now.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
    });

    return (
        <p className="text-[10vw] font-bold tracking-wider text-white tabular-nums drop-shadow-md">
            {time}
        </p>
    );
}