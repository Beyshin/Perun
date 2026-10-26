import LightSwitch from "../components/LightSwitch.jsx";
import {useEffect, useState} from "react";
import LogTable from "../components/LogTable.jsx";

export default function Light() {
    const [logs, setLogs] = useState([]);
    const tableCols = [
        {header: "Czas", accessor: "time"},
        {header: "Stan", accessor: "state"},
    ]

    useEffect(() => {
       const fetchData = async () => {
           try{
               const res = await fetch("/api/light", {
                   method: "GET",
               });

               const data = await res.json();
               setLogs(data);
           }catch(err){
               console.log(err);
           }
       }

       fetchData();
    }, []);


    return (
        <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Light</h1>
            <p className="mt-4 text-gray-600">Light panel</p>
            <LightSwitch />
            <LogTable data={logs} columns={tableCols} />

        </div>
    )
}