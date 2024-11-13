"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tracker_1 = require("./tracker");
const isBrowser = typeof window !== 'undefined';
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
const Analytics = ({ pathname, options }) => {
    const instance = (0, react_1.useMemo)(() => {
        if (isBrowser === false)
            return;
        return (0, tracker_1.create)(options);
    }, [options.detailed, options.ignoreLocalhost, options.ignoreOwnVisits]);
    (0, react_1.useEffect)(() => {
        if (instance == null) {
            console.warn('Skipped record creation because useTracker has been called in a non-browser environment');
            return;
        }
        const hasPathname = (pathname != null &&
            pathname !== '');
        if (hasPathname === false) {
            console.warn('Skipped record creation because useTracker has been called without pathname');
            return;
        }
        const att = (0, tracker_1.attributes)(options.detailed);
        const url = new URL(pathname, location.href);
        /*

        */
        return instance.record(options.projectId, Object.assign(Object.assign({}, att), { siteLocation: url.href })).stop;
    }, [instance, pathname]);
    return ((0, jsx_runtime_1.jsx)("div", { "data-strukt-tracker-id": options.projectId }));
};
exports.Analytics = Analytics;
