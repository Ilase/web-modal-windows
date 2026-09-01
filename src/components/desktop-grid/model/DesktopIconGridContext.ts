import {createContext} from "react";
import type {Icon} from "./icon.ts";


export type DesktopIconGridContextValue = {
    icons: Icon[];
    addIcon: (key: Icon) => void;
    removeIcon: (key: string) => void;
}

export const DesktopIconGridContext = createContext<DesktopIconGridContextValue | null>(null)

