import { TrackerOptions } from './tracker';
interface TrackerEnvironment {
    server: string;
}
/**
 * Use analytics in React.
 * Creates an instance once and a new record every time the pathname changes.
 * Safely no-ops during server-side rendering.
 */
declare const useTracker: (pathname: string | URL, options: TrackerOptions) => void;
export { useTracker };
export type { TrackerEnvironment, TrackerOptions };
