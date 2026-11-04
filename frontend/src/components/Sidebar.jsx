import {Home, Cloud, Lightbulb, Icon,LogOut} from "lucide-react";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function Sidebar() {
    const [pageIndex, setPageIndex] = useState(0);

    const pagesList = [
        {id: 0, name: "Home", icon: Home, path:"/"},
        {id: 1, name: "Weather", icon: Cloud, path:"/weather"},
        {id: 2, name: "Light", icon: Lightbulb, path:"/light"},
    ]


    return (
        <nav className="w-20 h-[95vh] bg-[#8A4FFF] rounded-[40px] flex flex-col py-10 justify-between shadow-xl">
            <ul className="w-full flex flex-col justify-center relative mt-4">
                {pagesList.map((page, index) => {
                    const Icon = page.icon;
                    return (
                        <li className="flex justify-center items-center py-4 cursor-pointer" key={index} onClick={() => setPageIndex(index)}>
                            <div>
                                <Link to={page.path}>
                                    <Icon className="hover:scale-120 transition-all duration-200" size={30} color="white"/>
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <div className="flex justify-center items-center py-4 cursor-pointer">
                <LogOut className="hover:scale-120 duration-120 transition-all" size={24} color="white"/>
            </div>
        </nav>
    )
}