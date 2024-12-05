export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
        return JSON.parse(stored);
    } catch {
        return defaultValue;
    }
};

export const saveToStorage = (key: string, value: any): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const exportConfigAsJson = (config: any) => {
    const configStr = JSON.stringify(config, null, 2);
    const blob = new Blob([configStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-config.json";
    a.click();
    URL.revokeObjectURL(url);
};
