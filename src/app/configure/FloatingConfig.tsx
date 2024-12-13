import React from "react";
import { Settings } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QRStyle } from "../_components/QR/QRStyle/QRStyle";

const FloatingConfig = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        size="icon"
                        className="w-12 h-12 rounded-full"
                        aria-label="Configuration"
                    >
                        <Settings className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="drawer-size" side="right">
                    <SheetHeader>
                        <SheetTitle>Configuration</SheetTitle>
                        <SheetDescription>
                            Adjust your application settings here.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                        <QRStyle />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Okay</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default FloatingConfig;
