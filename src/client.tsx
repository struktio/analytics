import React, { useMemo, useEffect, useState, createContext, useContext } from 'react';
import { create, attributes, TrackerOptions } from './tracker';

const isBrowser = typeof window !== 'undefined';

interface TrackerEnvironment {
	server: string;
}

interface TrackerContextValue {
	instance: ReturnType<typeof create> | undefined;
}

const TrackerContext = createContext<TrackerContextValue | undefined>(undefined);

export const useTracker = () => {
	const context = useContext(TrackerContext);
	if (!context) {
		throw new Error('useTracker must be used within a TrackerProvider');
	}
	return context.instance;
};

export const TrackerProvider: React.FC<{ pathname: string | URL, options: TrackerOptions, children: React.ReactNode }> = ({ pathname, options, children }) => {
	const instance = useMemo(() => {
		if (isBrowser === false) return;

		return create(options);
	}, [options.detailed, options.ignoreLocalhost, options.ignoreOwnVisits]);

	useEffect(() => {
		if (instance == null) {
			console.warn('Skipped record creation because useTracker has been called in a non-browser environment');
			return;
		}

		const hasPathname = (
			pathname != null &&
			pathname !== ''
		);

		if (hasPathname === false) {
			console.warn('Skipped record creation because useTracker has been called without pathname');
			return;
		}

		const att = attributes(options.detailed);
		const url = new URL(pathname, location.href);

		return instance.record(options.projectId, {
			...att,
			siteLocation: url.href,
		}).stop;
	}, [instance, pathname]);

	return (
		<TrackerContext.Provider value={{ instance }}>
			<div data-strukt-tracker-id={options.projectId}>
				{children}
			</div>
		</TrackerContext.Provider>
	);
};

export type { TrackerEnvironment, TrackerOptions }; 
