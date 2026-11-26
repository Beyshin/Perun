import {Lightbulb}  from "lucide-react";
import {useState} from "react";

export default function LightSwitch({RGB}) {

    const [switched, setSwitched] = useState(true);

    const switchLight = async () =>{
        try{
            console.log(RGB)
            const res = await fetch("/api/light", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    "state": switched ? "set_off" : "set_on",
                    "type": "rainbow",
                    "R": RGB[0],
                    "G": RGB[1],
                    "B": RGB[2],
                })
            });

            if(res.status === 200){
                console.log("light switched")
                setSwitched(!switched);
            }
        }catch(err){
            console.log("Error when switching lightbulb: " + err);
        }
    }

    return (
        <div className={`p-6 w-30 flex flex-col items-center justify-center text-white rounded-lg ${switched ? 'bg-green-400' : 'bg-red-500'}`}>
            <div>
                <Lightbulb/>
            </div>
            <div>
                <button onClick={switchLight}>
                    <p>{switched ? "Zgaś" : "Zapal" }</p>
                </button>
            </div>
        </div>
    )
}