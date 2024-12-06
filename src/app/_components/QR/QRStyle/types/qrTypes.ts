export type DotType =
    | "square"
    | "dots"
    | "rounded"
    | "extra-rounded"
    | "classy"
    | "classy-rounded";
export type CornerSquareType = "square" | "extra-rounded" | "dot";
export type CornerDotType = "square" | "dot";
export type GradientType = "linear" | "radial";

export interface QRConfig {
    width: number;
    height: number;
    margin: number;
    data: string;
    image?: string;
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    dotsOptions: {
        type: DotType;
        color: string;
        gradient?: {
            type: GradientType;
            rotation: number;
            colorStops: Array<{ offset: number; color: string }>;
        };
    };
    cornersSquareOptions: {
        type: CornerSquareType;
        color: string;

        gradient?: {
            type: GradientType;
            rotation: number;
            colorStops: Array<{ offset: number; color: string }>;
        };
    };
    cornersDotOptions: {
        type: CornerDotType;
        color: string;

        gradient?: {
            type: GradientType;
            rotation: number;
            colorStops: Array<{ offset: number; color: string }>;
        };
    };
    backgroundOptions: {
        color: string;
        gradient?: {
            type: GradientType;
            rotation: number;
            colorStops: Array<{ offset: number; color: string }>;
        };
    };
}
