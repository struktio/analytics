import { useMemo, useEffect, useState } from 'react';
import { create, attributes, TrackerOptions } from './tracker';

const isBrowser = typeof window !== 'undefined';

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
export const Analytics: React.FC<{ pathname: string | URL, options: TrackerOptions }> = ({ pathname, options }) => {
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

		/*

		*/
		return instance.record(options.projectId, {
			...att,
			siteLocation: url.href,
		}).stop;
	}, [instance, pathname]);

	return (
		<div data-strukt-tracker-id={options.projectId} />
	)
};

export type { TrackerEnvironment, TrackerOptions }; 
