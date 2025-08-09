import mongoose from 'mongoose';
import Crop from '../models/crop.model.js';
import Farm from '../models/farm.model.js';

function convertToKilograms(value, unit) {
  if (value == null) return null;
  switch (unit) {
    case 'kg':
      return value;
    case 'tons':
      return value * 1000;
    case 'lb':
      return value * 0.453592;
    // Bushels conversion depends on crop type; skip to avoid misleading data
    default:
      return null;
  }
}

function linearRegressionPredictNext(yValues) {
  // x = [0..n-1], y = yValues
  const n = yValues.length;
  if (n === 0) return null;
  if (n === 1) return yValues[0];
  const xValues = Array.from({ length: n }, (_, i) => i);
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);
  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const nextX = n;
  return intercept + slope * nextX;
}

function toMonthKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

export const getYieldAnalyticsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ success: false, message: 'Invalid farmer ID' });
    }

    const crops = await Crop.find({ farmer: farmerId }).select(
      'name variety actualYield estimatedYield yieldUnit harvestDate plantingDate'
    );

    // Time series (monthly) in kg
    const monthlyMap = new Map();
    for (const c of crops) {
      const valueRaw = c.actualYield ?? c.estimatedYield;
      const valueKg = convertToKilograms(valueRaw, c.yieldUnit);
      if (valueKg == null || !c.harvestDate) continue;
      const key = toMonthKey(c.harvestDate);
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + valueKg);
    }
    const timeSeries = Array.from(monthlyMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([month, totalYieldKg]) => ({ month, totalYieldKg }));

    // Per-crop series and predictions
    const cropGroups = new Map();
    for (const c of crops) {
      const label = `${c.name}${c.variety ? ` (${c.variety})` : ''}`;
      const valueRaw = c.actualYield ?? c.estimatedYield;
      const valueKg = convertToKilograms(valueRaw, c.yieldUnit);
      if (valueKg == null || !c.harvestDate) continue;
      const month = toMonthKey(c.harvestDate);
      if (!cropGroups.has(label)) cropGroups.set(label, []);
      cropGroups.get(label).push({ month, yieldKg: valueKg, date: new Date(c.harvestDate) });
    }

    const perCrop = Array.from(cropGroups.entries()).map(([cropLabel, points]) => {
      const sorted = points.sort((a, b) => a.date - b.date);
      const ySeries = sorted.map((p) => p.yieldKg);
      const predictedNextYieldKg = linearRegressionPredictNext(ySeries);
      return {
        crop: cropLabel,
        dataPoints: sorted.map(({ month, yieldKg }) => ({ month, yieldKg })),
        predictedNextYieldKg: predictedNextYieldKg != null ? Number(predictedNextYieldKg.toFixed(2)) : null,
        averageYieldKg: Number(
          (ySeries.reduce((a, b) => a + b, 0) / (ySeries.length || 1)).toFixed(2)
        ),
      };
    });

    // Environmental data (Open-Meteo, last ~90 days aggregated monthly)
    let env = null;
    try {
      const farm = await Farm.findOne({ farmer: farmerId }).select('location');
      if (farm?.location) {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(farm.location)}&count=1`
        );
        const geoJson = await geoRes.json();
        const place = geoJson?.results?.[0];
        if (place) {
          const { latitude, longitude, name } = place;
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation&past_days=90&forecast_days=0&timezone=auto`
          );
          const weather = await weatherRes.json();
          const times = weather?.hourly?.time || [];
          const temps = weather?.hourly?.temperature_2m || [];
          const precs = weather?.hourly?.precipitation || [];
          const monthAgg = new Map();
          for (let i = 0; i < times.length; i++) {
            const month = times[i].slice(0, 7);
            const t = temps[i];
            const p = precs[i];
            if (!monthAgg.has(month)) monthAgg.set(month, { tempSum: 0, tempCount: 0, precipSum: 0 });
            const rec = monthAgg.get(month);
            if (typeof t === 'number') {
              rec.tempSum += t;
              rec.tempCount += 1;
            }
            if (typeof p === 'number') {
              rec.precipSum += p;
            }
          }
          const monthly = Array.from(monthAgg.entries())
            .sort((a, b) => (a[0] < b[0] ? -1 : 1))
            .map(([month, rec]) => ({
              month,
              avgTempC: rec.tempCount ? Number((rec.tempSum / rec.tempCount).toFixed(2)) : null,
              totalPrecipMm: Number(rec.precipSum.toFixed(2)),
            }));
          env = {
            location: name,
            latitude,
            longitude,
            monthly,
          };
        }
      }
    } catch (e) {
      // Best-effort; leave env as null on failure
      env = null;
    }

    return res.status(200).json({
      success: true,
      data: {
        timeSeries,
        perCrop,
        env,
        notes:
          'Yields converted to kg for kg/lb/tons where applicable. Bushels omitted due to crop-specific conversion.',
      },
    });
  } catch (err) {
    console.error('Error building yield analytics', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


