import { BulkCreation } from "./BulkCreation"
import { QRStyle } from "./QR/QRStyle/QRStyle"
import { SidebarWithContent } from "./SidebarWithContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const HomePage = () => {
    return (
        <section className="min-h-screen bg-background">
            <div className="w-4/5 mx-auto mt-6">
                {/* <Tabs defaultValue="single" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="single" className="font-bold">Single QR Code</TabsTrigger>
                        <TabsTrigger value="bulk" className="font-bold">Bulk Creation</TabsTrigger>
                        <TabsTrigger value="style" className="font-bold">Configure QR Style</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="single">
                        <div className="space-y-4">
                            <SidebarWithContent />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="bulk">
                        <div className="space-y-4">
                            <BulkCreation />
                        </div>
                    </TabsContent>

                   <TabsContent value="style">
                        <div className="space-y-4">
                            <QRStyle />
                        </div>
                    </TabsContent>
                </Tabs> */}
                <SidebarWithContent />
            </div>
        </section>
    )
}

export default HomePage