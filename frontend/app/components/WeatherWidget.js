'use client';

import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind, MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function weatherCodeToIconAndText(code) {
	if (code === 0) return { icon: Sun, text: 'Clear' };
	if ([1, 2].includes(code)) return { icon: CloudSun, text: 'Partly Cloudy' };
	if (code === 3) return { icon: Cloud, text: 'Cloudy' };
	if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { icon: CloudRain, text: 'Rain' };
	return { icon: Cloud, text: 'Weather' };
}

function formatHour(iso) {
	try {
		const d = new Date(iso);
		return d.toLocaleTimeString([], { hour: 'numeric' });
	} catch {
		return '';
	}
}

export default function WeatherWidget() {
	const [status, setStatus] = useState('idle');
	const [coords, setCoords] = useState(null);
	const [weather, setWeather] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		setStatus('locating');
		if (!('geolocation' in navigator)) {
			setStatus('error');
			setError('Geolocation is not supported by your browser.');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setCoords({ latitude, longitude });
			},
			err => {
				if (err.code === err.PERMISSION_DENIED) {
					setStatus('denied');
					setError('Location permission denied. Enable location to see local weather.');
				} else {
					setStatus('error');
					setError('Unable to determine your location.');
				}
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
		);
	}, []);

	useEffect(() => {
		async function fetchWeather() {
			if (!coords) return;
			setStatus('loading');
			try {
				const params = new URLSearchParams({
					lat: String(coords.latitude),
					lon: String(coords.longitude)
				});
				const res = await fetch(`/api/weather?${params.toString()}`, { cache: 'no-store' });
				if (!res.ok) throw new Error('Failed to fetch weather');
				const data = await res.json();
				setWeather(data);
				setStatus('ready');
			} catch (e) {
				setStatus('error');
				setError((e && e.message) || 'Failed to load weather.');
			}
		}
		fetchWeather();
	}, [coords]);

	// Loading skeleton
	if (status === 'loading' || status === 'locating') {
		return (
			<div className="glass-card rounded-2xl border border-white/[0.06] p-5 sm:p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
						<Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
					</div>
					<div>
						<p className="text-sm font-medium text-white">Weather</p>
						<p className="text-xs text-surface-400">Loading forecast...</p>
					</div>
				</div>
				<div className="animate-pulse space-y-3">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="h-3 w-24 bg-white/5 rounded" />
							<div className="h-8 w-20 bg-white/5 rounded" />
						</div>
						<div className="h-10 w-10 bg-white/5 rounded-full" />
					</div>
					<div className="flex gap-4">
						<div className="h-4 w-16 bg-white/5 rounded" />
						<div className="h-4 w-16 bg-white/5 rounded" />
					</div>
					<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
						{[1,2,3,4,5,6].map(i => (
							<div key={i} className="h-16 bg-white/5 rounded-xl" />
						))}
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (status === 'error' || status === 'denied') {
		return (
			<div className="glass-card rounded-2xl border border-white/[0.06] p-5 sm:p-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
						<CloudSun className="w-4 h-4 text-amber-400" />
					</div>
					<div>
						<p className="text-sm font-medium text-white">Weather</p>
					</div>
				</div>
				<p className="text-sm text-surface-400">{error}</p>
			</div>
		);
	}

	return (
		<AnimatePresence mode="wait">
			{status === 'ready' && weather && (
				<motion.div
					key="weather-ready"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					className="glass-card rounded-2xl border border-white/[0.06] p-5 sm:p-6"
				>
					{/* Header */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
								<Sun className="w-4 h-4 text-emerald-400" />
							</div>
							<h3 className="text-sm font-semibold text-white">Weather</h3>
						</div>
						<div className="flex items-center gap-1 text-xs text-surface-400">
							<MapPin className="w-3 h-3" />
							<span>
								{[weather.location?.name, weather.location?.admin1]
									.filter(Boolean)
									.join(', ') || 'Your location'}
							</span>
						</div>
					</div>

					{/* Main Current Conditions */}
					<motion.div
						initial="hidden"
						animate="visible"
						className="space-y-4"
					>
						{/* Temperature + Condition Row */}
						<motion.div className="flex items-center justify-between">
							<div>
								<div className="flex items-end gap-1 leading-none">
									<p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
										{Math.round(weather.current?.temperature ?? 0)}
									</p>
									<p className="text-xl text-surface-400 font-medium mb-1">
										{weather.units?.temperature_2m || '°C'}
									</p>
								</div>
								<div className="flex items-center gap-2 mt-1">
									<p className="text-sm text-surface-400">
										H: {Math.round(weather.daily?.high ?? 0)}° / L: {Math.round(weather.daily?.low ?? 0)}°
									</p>
								</div>
							</div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="flex flex-col items-end"
							>
								{(() => {
									const { icon: Icon, text } = weatherCodeToIconAndText(weather.current?.weatherCode);
									return (
										<>
											<Icon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
											<p className="text-sm font-medium text-surface-200 mt-1">{text}</p>
										</>
									);
								})()}
							</motion.div>
						</motion.div>

						{/* Secondary Metrics */}
						<motion.div className="flex gap-5 sm:gap-6">
							<div className="flex items-center gap-2 text-sm text-surface-300">
								<div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
									<Droplets className="w-3.5 h-3.5 text-blue-400" />
								</div>
								<span>{weather.current?.humidity}{weather.units?.relative_humidity_2m || '%'}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-surface-300">
								<div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
									<Wind className="w-3.5 h-3.5 text-cyan-400" />
								</div>
								<span>{weather.current?.windSpeed}{weather.units?.wind_speed_10m || 'm/s'}</span>
							</div>
						</motion.div>

						{/* Hourly Forecast */}
						<motion.div>
							<p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Hourly Forecast</p>
							<div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
								{weather.hourly?.slice(0, 6).map((h, idx) => {
									const { icon: Icon } = weatherCodeToIconAndText(h.weatherCode);
									return (
										<motion.div
											key={idx}
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.25, delay: idx * 0.06 }}
											whileHover={{ y: -2 }}
											className="bg-white/[0.04] rounded-xl p-2.5 sm:p-3 text-center border border-white/[0.06] transition-all duration-200 cursor-default"
										>
											<p className="text-xs text-surface-400 mb-1.5 font-medium">{formatHour(h.time)}</p>
											<Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1.5 text-emerald-400" />
											<p className="text-xs sm:text-sm font-semibold text-white">
												{Math.round(h.temperature ?? 0)}°
											</p>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}