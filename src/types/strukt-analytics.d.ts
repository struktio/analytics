import { TrackerContextValue } from "../client";
import { TrackerOptions, TrackerAttributes, TrackerInstance } from "../tracker";
declare module "@strukt/analytics" {
  interface TrackerAPI {
    create: (server: string, options?: TrackerOptions) => TrackerInstance;
    attributes: (detailed?: boolean) => TrackerAttributes;
    detect: () => void;
  }

  export const tracker: TrackerAPI;

  export function useTracker(): TrackerContextValue;
  export function TrackerProvider(
    pathname: string | URL,
    projectId: string,
    sessionId: string,
    children: React.FC,
    options?: TrackerOptions,
  ): React.FC<{
    pathname: string | URL;
    projectId: string;
    sessionId: string;
    options: TrackerOptions;
    children: React.FC;
  }>;
}
