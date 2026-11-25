import {useEffect, useState} from "react";


export default function UserWelcome({firstname}) {
    const text = `Witaj, ${firstname}!`

    return (
        <h1 className="text-7xl text-white drop-shadow-md mt-50">
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    className="inline-block opacity-0 animate-[fade-in_0.4s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 120}ms` }}
                >
          {char === " " ? "\u00A0" : char}
        </span>
            ))}
        </h1>
    )
}