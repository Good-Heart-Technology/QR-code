import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_CONFIG } from "@/utils/constants/qr-constant";
import {
    QRConfig,
    GradientType,
} from "@/app/_components/QR/QRStyle/types/qrTypes";
import { saveToStorage } from "@/utils/qr-utils";
import { STORAGE_KEYS } from "@/utils/constants/qr-constant";

interface QRConfigState {
    config: QRConfig;
    downloadFormat: string;
    colorType: "single" | "gradient";
    gradientType: GradientType;
    activeAccordion: string;
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

const initialState: QRConfigState = {
    config: DEFAULT_CONFIG,
    downloadFormat: "png",
    colorType: "gradient",
    gradientType: "radial",
    activeAccordion: "",
    errorCorrectionLevel: DEFAULT_CONFIG.errorCorrectionLevel,
};

export const qrConfigSlice = createSlice({
    name: "qrConfig",
    initialState,
    reducers: {
        updateConfig: (state, action: PayloadAction<Partial<QRConfig>>) => {
            state.config = { ...state.config, ...action.payload };
            saveToStorage(STORAGE_KEYS.CONFIG, state.config);
        },
        updateDotsOptions: (
            state,
            action: PayloadAction<Partial<typeof DEFAULT_CONFIG.dotsOptions>>
        ) => {
            state.config.dotsOptions = {
                ...state.config.dotsOptions,
                ...action.payload,
            };
            saveToStorage(STORAGE_KEYS.CONFIG, state.config);
        },
        updateGradientColor: (
            state,
            action: PayloadAction<{ index: number; color: string }>
        ) => {
            if (!state.config.dotsOptions.gradient) return;

            const newColorStops =
                state.config.dotsOptions.gradient.colorStops.map((stop, i) =>
                    i === action.payload.index
                        ? { ...stop, color: action.payload.color }
                        : stop
                );

            state.config.dotsOptions.gradient = {
                ...state.config.dotsOptions.gradient,
                colorStops: newColorStops,
            };
            saveToStorage(STORAGE_KEYS.CONFIG, state.config);
        },
        setDownloadFormat: (state, action: PayloadAction<string>) => {
            state.downloadFormat = action.payload;
            saveToStorage(STORAGE_KEYS.DOWNLOAD_FORMAT, action.payload);
        },
        setColorType: (state, action: PayloadAction<"single" | "gradient">) => {
            state.colorType = action.payload;
            saveToStorage(STORAGE_KEYS.COLOR_TYPE, action.payload);
        },
        setGradientType: (state, action: PayloadAction<GradientType>) => {
            state.gradientType = action.payload;
            saveToStorage(STORAGE_KEYS.GRADIENT_TYPE, action.payload);
            if (state.config.dotsOptions.gradient) {
                state.config.dotsOptions.gradient.type = action.payload;
            }
        },
        setActiveAccordion: (state, action: PayloadAction<string>) => {
            state.activeAccordion = action.payload;
            saveToStorage(STORAGE_KEYS.ACCORDION_STATE, action.payload);
        },
        setErrorCorrectionLevel: (
            state,
            action: PayloadAction<"L" | "M" | "Q" | "H">
        ) => {
            state.errorCorrectionLevel = action.payload;
            state.config.errorCorrectionLevel = action.payload;
            saveToStorage(STORAGE_KEYS.ERROR_CORRECTION_LEVEL, action.payload);
        },
        resetToDefaults: (state) => {
            return initialState;
        },
    },
});

export const {
    updateConfig,
    updateDotsOptions,
    updateGradientColor,
    setDownloadFormat,
    setColorType,
    setGradientType,
    setActiveAccordion,
    setErrorCorrectionLevel,
    resetToDefaults,
} = qrConfigSlice.actions;

// Selectors
export const selectQRConfig = (state: { qrConfig: QRConfigState }) =>
    state.qrConfig.config;
export const selectDownloadFormat = (state: { qrConfig: QRConfigState }) =>
    state.qrConfig.downloadFormat;
export const selectColorType = (state: { qrConfig: QRConfigState }) =>
    state.qrConfig.colorType;
export const selectGradientType = (state: { qrConfig: QRConfigState }) =>
    state.qrConfig.gradientType;
export const selectActiveAccordion = (state: { qrConfig: QRConfigState }) =>
    state.qrConfig.activeAccordion;
export const selectErrorCorrectionLevel = (state: {
    qrConfig: QRConfigState;
}) => state.qrConfig.errorCorrectionLevel;

export default qrConfigSlice.reducer;
