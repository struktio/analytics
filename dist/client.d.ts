/// <reference types="react" />
import { TrackerOptions } from './tracker';
interface TrackerEnvironment {
    server: string;
}
/**
 * The instance .record creates a record on the server and
 * creates an interval function to update the record every 2 seconds. This
 * interval function is stopped when the component unmounts, when the user
 * navigates away from the page, or when the pathname changes.
 *
 * The routes that are used are defined in the TrackerOptions must return an Id
 * @param {string | URL} pathname - The pathname to track.
 * @param {TrackerOptions} options - The options to pass to the tracker.
 */
export declare const Analytics: React.FC<{
    pathname: string | URL;
    options: TrackerOptions;
}>;
export type { TrackerEnvironment, TrackerOptions };
