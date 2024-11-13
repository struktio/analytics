"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTracker = void 0;
const react_1 = require("react");
const tracker_1 = require("./tracker");
const isBrowser = typeof window !== 'undefined';
/**
 * Use analytics in React.
 * Creates an instance once and a new record every time the pathname changes.
 * Safely no-ops during server-side rendering.
 */
const useTracker = function (pathname, options) {
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
        return instance.record(options.projectId, Object.assign(Object.assign({}, att), { siteLocation: url.href })).stop;
    }, [instance, pathname]);
};
exports.useTracker = useTracker;
