import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window properties that might not exist in test environment
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

if (typeof window.fetch === 'undefined') {
	global.fetch = vi.fn();
}

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	clear: vi.fn(),
	removeItem: vi.fn(),
	length: 0,
	key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
}); 