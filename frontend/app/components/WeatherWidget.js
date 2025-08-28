'use client';

import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

function weatherCodeToIconAndText(code) {
	// Simplified mapping for common conditions
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
	const [status, setStatus] = useState('idle'); // idle | locating | loading | ready | error | denied
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

	return (
		<div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white shadow-lg">
			{status !== 'ready' && (
				<div className="text-white/90">
					{status === 'locating' && <p>Determining your location…</p>}
					{status === 'loading' && <p>Updating…</p>}
					{status === 'denied' && <p className="text-sm">{error}</p>}
					{status === 'error' && <p className="text-sm">{error}</p>}
				</div>
			)}

			{status === 'ready' && weather && (
				<div className="space-y-3">
					{/* Header row: location and current conditions */}
					<div className="flex items-start justify-between">
						<div>
							<p className="text-xs sm:text-sm text-white/80">
								{[weather.location?.name, weather.location?.admin1]
									.filter(Boolean)
									.join(', ') || 'Your location'}
							</p>
							<div className="flex items-end gap-1 sm:gap-2 leading-none">
								<p className="text-3xl sm:text-4xl md:text-5xl font-bold">{Math.round(weather.current?.temperature ?? 0)}</p>
								<p className="text-lg sm:text-xl md:text-2xl opacity-80">{weather.units?.temperature_2m || '°C'}</p>
							</div>
						</div>
						<div className="text-right">
							{(() => {
								const { icon: Icon, text } = weatherCodeToIconAndText(weather.current?.weatherCode);
								return (
									<div className="flex flex-col items-end">
										<Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
										<p className="text-xs sm:text-sm">{text}</p>
										<p className="text-xs text-white/80">
											{Math.round(weather.daily?.high ?? 0)} / {Math.round(weather.daily?.low ?? 0)} {weather.units?.high}
										</p>
									</div>
								);
							})()}
						</div>
					</div>

					{/* Secondary metrics */}
					<div className="flex gap-4 sm:gap-6 text-white/90">
						<div className="flex items-center gap-1 sm:gap-2">
							<Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="text-sm sm:text-base">{weather.current?.humidity}{weather.units?.relative_humidity_2m || '%'}</span>
						</div>
						<div className="flex items-center gap-1 sm:gap-2">
							<Wind className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="text-sm sm:text-base">{weather.current?.windSpeed}{weather.units?.wind_speed_10m || 'm/s'}</span>
						</div>
					</div>

					{/* Hourly strip */}
					<div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 pt-2">
						{weather.hourly?.slice(0, 6).map((h, idx) => {
							const { icon: Icon } = weatherCodeToIconAndText(h.weatherCode);
							return (
								<div key={idx} className="bg-white/15 rounded-xl p-2 sm:p-3 text-center">
									<p className="text-xs text-white/90 mb-1 sm:mb-2">{formatHour(h.time)}</p>
									<Icon className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
									<p className="text-xs sm:text-sm font-semibold">{Math.round(h.temperature ?? 0)}{weather.units?.temperature_2m || '°C'}</p>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}


