"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerProvider = exports.useTracker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tracker_1 = require("./tracker");
const isBrowser = typeof window !== 'undefined';
const TrackerContext = (0, react_1.createContext)(undefined);
const useTracker = () => {
    const context = (0, react_1.useContext)(TrackerContext);
    if (!context) {
        throw new Error('useTracker must be used within a TrackerProvider');
    }
    return context.instance;
};
exports.useTracker = useTracker;
const TrackerProvider = ({ pathname, options, children }) => {
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
    return ((0, jsx_runtime_1.jsx)(TrackerContext.Provider, Object.assign({ value: { instance } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ "data-strukt-tracker-id": options.projectId }, { children: children })) })));
};
exports.TrackerProvider = TrackerProvider;
