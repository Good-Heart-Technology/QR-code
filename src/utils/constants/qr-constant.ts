import {
    GradientType,
    QRConfig,
} from "@/app/_components/QR/QRStyle/types/qrTypes";

export const STORAGE_KEYS = {
    CONFIG: "qr-style-config",
    COLOR_TYPE: "qr-color-type",
    GRADIENT_TYPE: "qr-gradient-type",
    DOWNLOAD_FORMAT: "qr-download-format",
    ACCORDION_STATE: "qr-accordion-state",
    ERROR_CORRECTION_LEVEL: "qr-error-correction-level",
} as const;

export const DEFAULT_GRADIENT = {
    type: "linear" as GradientType,
    rotation: 0,
    colorStops: [
        { offset: 0, color: "#FF8C00" },
        { offset: 1, color: "#90EE90" },
    ],
};

export const DEFAULT_CONFIG: QRConfig = {
    width: 300,
    height: 300,
    margin: 0,
    data: "https://brainstation-23.easy.jobs",
    dotsOptions: {
        type: "extra-rounded",
        color: "#6b2e6e",
        gradient: DEFAULT_GRADIENT,
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#000000",
    },
    cornersDotOptions: {
        type: "dot",
        color: "#000000",
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    errorCorrectionLevel: "H",
};
