import React, { useMemo, useEffect, createContext, useContext } from "react";
import { create, attributes, TrackerOptions, TrackerAttributes } from "./tracker";

const isBrowser = typeof window !== "undefined";

interface TrackerContextValue {
	instance: ReturnType<typeof create> | undefined;
}

const TrackerContext = createContext<TrackerContextValue | undefined>(
	undefined,
);

export const useTracker = () => {
	const context = useContext(TrackerContext);
	if (!context) {
		throw new Error("useTracker must be used within a TrackerProvider");
	}
	return context.instance;
};

export const TrackerProvider: React.FC<{
	pathname: string | URL;
	projectId: string;
	sessionId: string;
	options: TrackerOptions;
	children: React.ReactNode;
}> = ({ pathname, options, children, projectId, sessionId }) => {
	const instance = useMemo(() => {
		if (isBrowser === false) return;

		return create(projectId, sessionId, options);
	}, [options.detailed, options.ignoreLocalhost, options.ignoreOwnVisits]);

	useEffect(() => {
		if (instance == null) {
			console.warn(
				"Skipped record creation because useTracker has been called in a non-browser environment",
			);
			return;
		}

		const hasPathname = pathname != null && pathname !== "";

		if (hasPathname === false) {
			console.warn(
				"Skipped record creation because useTracker has been called without pathname",
			);
			return;
		}

		const att = attributes(options.detailed) as TrackerAttributes;
		const url = new URL(pathname, location.href);

		return instance.record({
			...att,
			siteLocation: url.href,
		}).stop;
	}, [instance, pathname]);

	// New effect for handling page unload
	useEffect(() => {
		if (!instance || !isBrowser) return;

		const handleBeforeUnload = () => {
			// You can add your cleanup function here
			instance.cleanup(projectId, sessionId); // Assuming your tracker instance has a cleanup method
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [instance]);

	return (
		<TrackerContext.Provider value={{ instance }}>
			<div data-strukt-tracker-id={projectId}>{children}</div>
		</TrackerContext.Provider>
	);
};

export type { TrackerOptions, TrackerContextValue, TrackerContext };
