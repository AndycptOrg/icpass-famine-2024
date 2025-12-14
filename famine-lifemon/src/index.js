import * as React from 'react';
import ReactDOM from 'react-dom';

import '@fontsource/roboto/400.css';

import './index.css';
import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';

// If a fatal error happens before React renders, we mount a minimal React
// tree that displays the ErrorBoundary fallback. This prevents a white screen.
function mountErrorUI(initialError) {
	try {
		ReactDOM.render(
			<ErrorBoundary initialError={initialError}>
				<div />
			</ErrorBoundary>,
			document.getElementById('root')
		);
	} catch (e) {
		// If even this fails, fall back to a minimal DOM update so user sees something
		const root = document.getElementById('root');
		if (root) {
			root.innerHTML = '<div style="padding:20px;font-family:sans-serif"><h1>Something went wrong</h1><p>An unexpected error occurred.</p></div>';
		}
	}
}

// Global error handlers to catch fatal errors that would otherwise show a white screen
if (typeof window !== 'undefined') {
	window.addEventListener('error', (event) => {
		try {
			console.error('Global error caught', event.error || event.message, event);
			mountErrorUI(event.error || event.message);
		} catch (e) {
			// ignore
		}
	});

	window.addEventListener('unhandledrejection', (event) => {
		try {
			console.error('Unhandled promise rejection', event.reason, event);
			mountErrorUI(event.reason || 'Unhandled promise rejection');
		} catch (e) {
			// ignore
		}
	});
}

ReactDOM.render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>,
	document.getElementById('root')
);