"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerProvider = exports.useTracker = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tracker_1 = require("./tracker");
const isBrowser = typeof window !== "undefined";
const TrackerContext = (0, react_1.createContext)(undefined);
const useTracker = () => {
    const context = (0, react_1.useContext)(TrackerContext);
    if (!context) {
        throw new Error("useTracker must be used within a TrackerProvider");
    }
    return context.instance;
};
exports.useTracker = useTracker;
const TrackerProvider = ({ pathname, options, children, session }) => {
    const instance = (0, react_1.useMemo)(() => {
        if (isBrowser === false)
            return;
        return (0, tracker_1.create)(session, options);
    }, [options.detailed, options.ignoreLocalhost, options.ignoreOwnVisits]);
    (0, react_1.useEffect)(() => {
        if (instance == null) {
            console.warn("Skipped record creation because useTracker has been called in a non-browser environment");
            return;
        }
        const hasPathname = pathname != null && pathname !== "";
        if (hasPathname === false) {
            console.warn("Skipped record creation because useTracker has been called without pathname");
            return;
        }
        const att = (0, tracker_1.attributes)(options.detailed);
        const url = new URL(pathname, location.href);
        return instance.record(Object.assign(Object.assign({}, att), { siteLocation: url.href })).stop;
    }, [instance, pathname]);
    // New effect for handling page unload
    (0, react_1.useEffect)(() => {
        if (!instance || !isBrowser)
            return;
        const handleBeforeUnload = () => {
            // You can add your cleanup function here
            instance.cleanup(session); // Assuming your tracker instance has a cleanup method
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [instance]);
    return ((0, jsx_runtime_1.jsx)(TrackerContext.Provider, Object.assign({ value: { instance } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ "data-strukt-session-id": session }, { children: children })) })));
};
exports.TrackerProvider = TrackerProvider;
