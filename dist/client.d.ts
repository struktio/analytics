import React from "react";
import { create, TrackerOptions } from "./tracker";
interface TrackerContextValue {
    instance: ReturnType<typeof create> | undefined;
}
declare const TrackerContext: React.Context<TrackerContextValue | undefined>;
export declare const useTracker: () => {
    record: (id: string, attrs?: import("./tracker").DefaultData | (import("./tracker").DefaultData & import("./tracker").DetailedData), next?: ((recordId: string) => void) | undefined) => {
        stop: () => void;
    };
    updateRecord: (recordId: string) => {
        stop: () => void;
    };
    action: (actionId: string, attrs: Record<string, any>, next?: ((actionId: string) => void) | undefined) => void;
    updateAction: (actionId: string, attrs: Record<string, any>) => void;
} | undefined;
export declare const TrackerProvider: React.FC<{
    pathname: string | URL;
    options: TrackerOptions;
    children: React.ReactNode;
}>;
export type { TrackerOptions, TrackerContextValue, TrackerContext };
