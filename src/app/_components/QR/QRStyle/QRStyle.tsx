"use client";

import React, { useEffect, useRef, useMemo } from "react";
import QRCodeStyling from "qr-code-styling";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { DotsOptions } from "./_components/DotsOptions";
import { CornersSquareOptions } from "./_components/CornersSquareOptions";
import { CornersDotOptions } from "./_components/CornersDotOptions";
import { BackgroundOptions } from "./_components/BackgroundOptions";
import {
    updateConfig,
    updateDotsOptions,
    updateGradientColor,
    setDownloadFormat,
    setColorType,
    setGradientType,
    setActiveAccordion,
    setErrorCorrectionLevel,
    selectQRConfig,
    selectDownloadFormat,
    selectColorType,
    selectGradientType,
    selectActiveAccordion,
    selectErrorCorrectionLevel,
} from "@/redux/qr-slice";
import { DEFAULT_CONFIG } from "../../../../utils/constants/qr-constant";
import { useAppDispatch, useAppSelector } from "@/utils/hooks/useAppSelector";
import { QRConfig } from "./types/qrTypes";

export const QRStyle = () => {
    // Select state from Redux
    const config = useAppSelector(selectQRConfig);
    const downloadFormat = useAppSelector(selectDownloadFormat);
    const colorType = useAppSelector(selectColorType);
    const gradientType = useAppSelector(selectGradientType);
    const activeAccordion = useAppSelector(selectActiveAccordion);
    const errorCorrectionLevel = useAppSelector(selectErrorCorrectionLevel);

    const dispatch = useAppDispatch();

    const [qrCode, setQrCode] = React.useState<any>(null);
    const qrRef = useRef<HTMLDivElement>(null);

    // Memoize the updated config to prevent unnecessary recalculations
    const updatedConfig = useMemo(
        () => ({
            ...config,
            errorCorrectionLevel,
            dotsOptions: {
                ...config.dotsOptions,
                gradient:
                    colorType === "gradient"
                        ? {
                              type: gradientType,
                              rotation:
                                  config.dotsOptions.gradient?.rotation || 0,
                              colorStops:
                                  config.dotsOptions.gradient?.colorStops ||
                                  DEFAULT_CONFIG.dotsOptions.gradient
                                      ?.colorStops ||
                                  [],
                          }
                        : undefined,
            },
        }),
        [config, colorType, gradientType, errorCorrectionLevel]
    );

    // Initialize QR code on mount
    useEffect(() => {
        const qr = new QRCodeStyling(updatedConfig);
        setQrCode(qr);

        if (qrRef.current) {
            qrRef.current.innerHTML = "";
            qr.append(qrRef.current);
        }

        return () => {
            if (qrRef.current) {
                qrRef.current.innerHTML = "";
            }
        };
    }, []); // Only run once on mount

    // Update QR code when configuration changes
    useEffect(() => {
        if (qrCode) {
            qrCode.update(updatedConfig);
        }
    }, [updatedConfig, qrCode]); // Only depend on memoized config and qrCode instance

    const handleConfigChange = (updates: Partial<typeof config>) => {
        dispatch(updateConfig(updates));
    };

    const handleDotsOptionsChange = (
        updates: Partial<typeof config.dotsOptions>
    ) => {
        dispatch(updateDotsOptions(updates));
    };

    const handleGradientColorChange = (index: number, color: string) => {
        dispatch(updateGradientColor({ index, color }));
    };

    const handleDownload = () => {
        if (qrCode) {
            qrCode.download({
                extension: downloadFormat.toLowerCase(),
            });
        }
    };

    const handleErrorCorrectionChange = (value: "L" | "M" | "Q" | "H") => {
        dispatch(setErrorCorrectionLevel(value));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={activeAccordion}
                    onValueChange={(value) =>
                        dispatch(setActiveAccordion(value))
                    }
                >
                    <AccordionItem value="dots">
                        <AccordionTrigger className="bg-muted px-4">
                            Dots Options
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <DotsOptions
                                config={config}
                                colorType={colorType}
                                gradientType={gradientType}
                                onDotsOptionsChange={handleDotsOptionsChange}
                                onColorTypeChange={(type) =>
                                    dispatch(setColorType(type))
                                }
                                onGradientTypeChange={(type) =>
                                    dispatch(setGradientType(type))
                                }
                                onGradientColorChange={
                                    handleGradientColorChange
                                }
                                onErrorCorrectionChange={
                                    handleErrorCorrectionChange
                                }
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="corners-square">
                        <AccordionTrigger className="bg-muted px-4">
                            Corners Square Options
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <CornersSquareOptions
                                config={config}
                                onConfigChange={handleConfigChange}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="corners-dot">
                        <AccordionTrigger className="bg-muted px-4">
                            Corners Dot Options
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <CornersDotOptions
                                config={config}
                                onConfigChange={handleConfigChange}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="background">
                        <AccordionTrigger className="bg-muted px-4">
                            Background Options
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <BackgroundOptions
                                config={config}
                                onConfigChange={handleConfigChange}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="space-y-4">
                <Card className="p-6">
                    <div ref={qrRef} className="flex justify-center" />
                    <div className="mt-4 flex justify-end space-x-2"></div>
                </Card>
            </div>
        </div>
    );
};
