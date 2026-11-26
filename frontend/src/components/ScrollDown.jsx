import {ChevronDown} from "lucide-react";
import {useState} from "react";

export default function ScrollDown({size, color, onClick}) {

    return (
        <button onClick={onClick} className="flex flex-col mt-auto bg-white/20 border border-gray-300/50 rounded-full animate-bounce">
            <ChevronDown size={size} color={color} />
        </button>
    )


}