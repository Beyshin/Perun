import {useEffect, useState} from "react";


export default function ColorWidget({setRGB}) {
    const [red,setRed] = useState("0");
    const [blue,setBlue] = useState("0");
    const [green,setGreen] = useState("0");

    useEffect(() => {
        setRGB([red, green, blue]);
    }, [red, green, blue])

    return (
        <div className="mt-4 w-80 rounded-2xl border border-gray-200 bg-white/30 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="h-9 w-9 rounded-lg border border-black/10 shadow-inner transition-colors"
                        style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
                    />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">RGB Color</h3>
                        <p className="font-mono text-xs text-gray-500">
                            rgb({red}, {green}, {blue})
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                    <label htmlFor="red" className="w-4 text-xs font-bold text-red-500"> R </label>
                    <input type="range" id="red" name="red" min="0" max="255" step="1" value={red}
                           onChange={(e) => setRed(e.target.value)}
                           className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-red-100 accent-red-500"
                    />
                    <span className="w-9 rounded bg-gray-100 py-0.5 text-center font-mono text-xs font-medium text-gray-700 tabular-nums">
                        {red}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="green" className="w-4 text-xs font-bold text-green-600">G </label>
                    <input type="range" id="green" name="green" min="0" max="255" step="1" value={green}
                        onChange={(e) => setGreen(e.target.value)}
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-green-100 accent-green-600"
                    />
                    <span className="w-9 rounded bg-gray-100 py-0.5 text-center font-mono text-xs font-medium text-gray-700 tabular-nums">
                        {green}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="blue" className="w-4 text-xs font-bold text-blue-500"> B </label>
                    <input type="range" id="blue" name="blue" min="0" max="255" step="1" value={blue}
                        onChange={(e) => setBlue(e.target.value)}
                        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-blue-100 accent-blue-500"
                    />
                    <span className="w-9 rounded bg-gray-100 py-0.5 text-center font-mono text-xs font-medium text-gray-700 tabular-nums">
                        {blue}
                    </span>
                </div>
            </div>
        </div>
)

}