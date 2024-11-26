import Navbar from "./Navbar"
import { SidebarWithContent } from "./SidebarWithContent"

export const HomePage = () => {
    return (
        <section>
            <Navbar />
            <div className="w-[80%] mx-auto">
                <SidebarWithContent />
            </div>
        </section>
    )
}