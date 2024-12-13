import React, { useEffect, useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { QRCodeGeneratorProps } from "./types/types";
import { QRConfig } from "./QRStyle/types/qrTypes";
import { formatQRData } from "@/utils/qr-formatter";
import { useAppSelector, useAppDispatch } from "@/utils/hooks/useAppSelector";

import {
    selectQRConfig,
    selectDownloadFormat,
    selectErrorCorrectionLevel,
    updateConfig,
    setDownloadFormat,
} from "@/redux/qr-slice";

import { STORAGE_KEYS } from "@/utils/constants/qr-constant";

let initialLoad = true;

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    data,
    type = "text",
    showLogo = false,
    size = 256,
    logoPath = "",
    errorCorrectionLevel = "H",
}) => {
    const dispatch = useAppDispatch();
    const qrConfig = useAppSelector(selectQRConfig);
    const downloadFormat = useAppSelector(selectDownloadFormat);
    const reduxErrorLevel = useAppSelector(selectErrorCorrectionLevel);

    const [qrValue, setQrValue] = useState<string>("");
    const qrRef = useRef<QRCodeStyling | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [downloadHeightSize, setDownloadHeightSize] = useState(size);
    const [downloadWidthSize, setDownloadWidthSize] = useState(size);

    // Initialize config from localStorage if Redux is empty
    useEffect(() => {
        if (initialLoad) {
            const storedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
            if (storedConfig) {
                try {
                    const parsedConfig = JSON.parse(storedConfig);
                    dispatch(updateConfig(parsedConfig));
                } catch (error) {
                    console.error("Error parsing stored QR config:", error);
                }
            }
            initialLoad = false;
        }
    }, [dispatch, qrConfig]);

    // Format QR data when data or type changes
    useEffect(() => {
        try {
            const formattedValue = formatQRData(data, type);
            setQrValue(formattedValue);
        } catch (error) {
            console.error("Error formatting QR data:", error);
            setQrValue("");
        }
    }, [data, type]);

    // Initialize QR code instance
    useEffect(() => {
        if (!qrValue || !qrConfig) return;

        try {
            // Combine the Redux config with current props
            const combinedConfig: QRConfig = {
                ...qrConfig,
                width: size,
                height: size,
                data: qrValue,
                errorCorrectionLevel: reduxErrorLevel || errorCorrectionLevel,
                image: showLogo ? logoPath : undefined,
            };

            // Create QR instance with combined config
            const qrInstance = new QRCodeStyling(combinedConfig);
            qrRef.current = qrInstance;

            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                qrInstance.append(containerRef.current);
            }
        } catch (error) {
            console.error("Error initializing QR code:", error);
        }
    }, [
        qrValue,
        qrConfig,
        size,
        showLogo,
        logoPath,
        reduxErrorLevel,
        errorCorrectionLevel,
    ]);

    // Cleanup QR instance on unmount
    useEffect(() => {
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };
    }, []);

    const handleDownload = async () => {
        if (!qrRef.current) return;

        try {
            const extension =
                downloadFormat === "jpeg" ? "jpg" : downloadFormat;
            const filename = `qr-code.${extension}`;

            // Update QR size for download
            await qrRef.current.update({
                width: downloadWidthSize,
                height: downloadHeightSize,
            });

            // Download the file
            await qrRef.current.download({
                name: filename,
                extension: downloadFormat as any,
            });

            // Reset QR size to original
            await qrRef.current.update({
                width: size,
                height: size,
            });
        } catch (error) {
            console.error("Error downloading QR code:", error);
        }
    };

    if (!qrValue || !qrConfig) return null;

    return (
        <div className="flex flex-col items-center">
            <div className="relative inline-block mb-16">
                <div
                    ref={containerRef}
                    className="qr-code-container"
                    data-testid="qr-code-container"
                />
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">
                        <Download className="mr-2 h-4 w-4" />
                        Download QR Code
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Download QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="height" className="text-right">
                                Height Size (px)
                            </label>
                            <Input
                                id="height"
                                type="number"
                                value={downloadHeightSize}
                                onChange={(e) =>
                                    setDownloadHeightSize(
                                        Number(e.target.value)
                                    )
                                }
                                min={128}
                                max={2048}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="width" className="text-right">
                                Width Size (px)
                            </label>
                            <Input
                                id="width"
                                type="number"
                                value={downloadWidthSize}
                                onChange={(e) =>
                                    setDownloadWidthSize(Number(e.target.value))
                                }
                                min={128}
                                max={2048}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="format" className="text-right">
                                Format
                            </label>
                            <Select
                                value={downloadFormat}
                                onValueChange={(value: string) =>
                                    dispatch(setDownloadFormat(value))
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="svg">SVG</SelectItem>
                                    <SelectItem value="png">PNG</SelectItem>
                                    <SelectItem value="jpeg">JPEG</SelectItem>
                                    <SelectItem value="webp">WEBP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleDownload}>Download</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QRCodeGenerator;
