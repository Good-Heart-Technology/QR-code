import { configureStore } from "@reduxjs/toolkit";
import { qrConfigSlice } from "./qr-slice";

export const store = configureStore({
    reducer: {
        qrConfig: qrConfigSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;