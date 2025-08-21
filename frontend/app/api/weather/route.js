import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const lat = searchParams.get('lat');
		const lon = searchParams.get('lon');
		if (!lat || !lon) {
			return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
		}

		const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
		const geoUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&language=en&format=json`;

		const [forecastRes, geoRes] = await Promise.all([
			fetch(forecastUrl, { next: { revalidate: 0 } }),
			fetch(geoUrl, { next: { revalidate: 3600 } })
		]);

		if (!forecastRes.ok) return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 502 });
		const forecast = await forecastRes.json();
		const geo = geoRes.ok ? await geoRes.json() : null;

		const current = forecast.current || {};
		const units = forecast.current_units || {};
		const daily = forecast.daily || {};
		const hourly = forecast.hourly || {};

		// Build next 6 hours forecast starting at current time index
		const nowIso = current.time || new Date().toISOString();
		const times = Array.isArray(hourly.time) ? hourly.time : [];
		let startIndex = Math.max(0, times.findIndex(t => t >= nowIso));
		if (startIndex === -1) startIndex = 0;
		const horizon = 6;
		const nextHours = [];
		for (let i = 0; i < horizon && startIndex + i < times.length; i++) {
			const idx = startIndex + i;
			nextHours.push({
				time: times[idx],
				temperature: hourly.temperature_2m?.[idx] ?? null,
				precipitationProbability: hourly.precipitation_probability?.[idx] ?? null,
				weatherCode: hourly.weather_code?.[idx] ?? null
			});
		}

		const place = Array.isArray(geo?.results) && geo.results.length > 0 ? geo.results[0] : null;
		const location = place ? {
			name: place.name || place.city || place.admin1 || '',
			admin1: place.admin1 || '',
			country: place.country || ''
		} : null;

		return NextResponse.json({
			location,
			current: {
				temperature: current.temperature_2m,
				humidity: current.relative_humidity_2m,
				windSpeed: current.wind_speed_10m,
				weatherCode: current.weather_code
			},
			daily: {
				high: Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max[0] : null,
				low: Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min[0] : null
			},
			hourly: nextHours,
			units: {
				...units,
				high: forecast.daily_units?.temperature_2m_max || units.temperature_2m || '°C',
				low: forecast.daily_units?.temperature_2m_min || units.temperature_2m || '°C'
			}
		});
	} catch (e) {
		return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
	}
}


