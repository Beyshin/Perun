import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function Layout() {
    return (
        <div className="min-h-screen bg-[#F4F4F9] flex items-center p-6 font-sans">
            <Sidebar/>
            <main className="flex-1 flex flex-col overflow-y-auto p-8">
                <Outlet/>
            </main>
        </div>
    )
}