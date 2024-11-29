// utils/qr-formatter.ts
export const formatQRData = (data: any, type: string): string => {
    switch (type) {
        case "url":
            return data;
        case "vcard":
            return (
                `MECARD:N:${data.lastName},${data.firstName};` +
                `${data.tel ? `TEL:${data.tel};` : ""}` +
                `${data.email ? `EMAIL:${data.email};` : ""}` +
                `${data.address ? `ADR:${data.address};` : ""}` +
                `${data.note ? `NOTE:${data.note};` : ""};`
            );
        case "calendar":
            return (
                `BEGIN:VEVENT\n` +
                `SUMMARY:${data.summary}\n` +
                `DTSTART:${data.startDate}\n` +
                `DTEND:${data.endDate}\n` +
                `${data.location ? `LOCATION:${data.location}\n` : ""}` +
                `${
                    data.description ? `DESCRIPTION:${data.description}\n` : ""
                }` +
                `END:VEVENT`
            );
        case "wifi":
            return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
        case "location":
            return `geo:${data.latitude},${data.longitude}`;
        case "phone":
            return `tel:${data.number}`;
        case "email":
            return (
                `mailto:${data.address}` +
                `${
                    data.subject
                        ? `?subject=${encodeURIComponent(data.subject)}`
                        : ""
                }` +
                `${data.body ? `&body=${encodeURIComponent(data.body)}` : ""}`
            );
        case "text":
        default:
            return data.toString();
    }
};
