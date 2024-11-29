export type QRDataTypes =
    | "url"
    | "vcard"
    | "calendar"
    | "wifi"
    | "location"
    | "phone"
    | "email"
    | "text";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRCodeGeneratorProps {
    data: any;
    type?: QRDataTypes;
    showLogo?: boolean;
    size?: number;
    logoPath?: string;
    errorCorrectionLevel?: ErrorCorrectionLevel;
}

export interface QRCustomizationOptions {
    size: number;
    errorCorrection: "L" | "M" | "Q" | "H";
    dotStyle: "square" | "dots" | "rounded";
    foregroundColor: string;
    backgroundColor: string;
    logoUrl: string;
    frameStyle: "none" | "square" | "circle";
    frameLabel: string;
    labelColor: string;
}
