import LightSwitch from "../components/LightSwitch.jsx";
import {useEffect, useState} from "react";
import LogTable from "../components/LogTable.jsx";
import ColorWidget from "../components/ColorWidget.jsx";
import Loading from "../components/Loading.jsx";

export default function Light() {
    const [logs, setLogs] = useState([]);
    const [RGB, setRGB] = useState(["0", "0", "0"]);
    const tableCols = [
        {header: "Czas", accessor: "time"},
        {header: "Stan", accessor: "state"},
    ]
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       const fetchData = async () => {
           try{
               setIsLoading(true);
               const res = await fetch("/api/light", {
                   method: "GET",
               });

               const data = await res.json();
               setLogs(data);
           }catch(err){
               console.log(err);
           }
           setIsLoading(false);
       }

       fetchData();
    }, []);


    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Light</h1>
            <p className="mt-4 text-gray-600">Light panel</p>
            <LightSwitch RGB={RGB} />
            <ColorWidget setRGB={setRGB} />
            <LogTable data={logs} columns={tableCols} />

        </div>
    )
}