import React from "react";
import { create, TrackerOptions } from "./tracker";
interface TrackerContextValue {
    instance: ReturnType<typeof create> | undefined;
}
declare const TrackerContext: React.Context<TrackerContextValue | undefined>;
export declare const useTracker: () => import("./tracker").TrackerInstance | undefined;
export declare const TrackerProvider: React.FC<{
    pathname: string | URL;
    session: string;
    options: TrackerOptions;
    children: React.ReactNode;
}>;
export type { TrackerOptions, TrackerContextValue, TrackerContext };
