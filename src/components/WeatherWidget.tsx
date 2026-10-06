"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getLocalWeather, getWeatherWarnings, getNineDayForecast, getLocalForecast, getClosestStation, LocalWeather, WeatherWarning, NineDayForecast, HKOLang } from "@/lib/hko-api";
import { useTranslations } from "next-intl";
import { AlertTriangle, Cloud, CloudRain, Sun, Loader2, Calendar, Droplets } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherWidgetProps {
  locale: HKOLang;
}

export default function WeatherWidget({ locale }: WeatherWidgetProps) {
  const t = useTranslations("Weather");
  const { coords, error, loading: geoLoading } = useGeolocation();

  const [weather, setWeather] = useState<LocalWeather | null>(null);
  const [warnings, setWarnings] = useState<WeatherWarning | null>(null);
  const [forecast, setForecast] = useState<NineDayForecast | null>(null);
  const [localForecast, setLocalForecast] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Default to showing forecast modal or not
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [weatherData, warningsData, forecastData, localForecastData] = await Promise.all([
        getLocalWeather(locale),
        getWeatherWarnings(locale),
        getNineDayForecast(locale),
        getLocalForecast(locale)
      ]);
      setWeather(weatherData);
      setWarnings(warningsData);
      setForecast(forecastData);
      setLocalForecast(localForecastData);
      setLoading(false);
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [locale]);

  if (loading || geoLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  // Find closest station using actual GPS coordinates
  let bestPlaceName = "King's Park";
  if (weather?.temperature?.data) {
      if (coords) {
          const availablePlaces = weather.temperature.data.map(d => d.place);
          bestPlaceName = getClosestStation(coords.latitude, coords.longitude, availablePlaces);
      } else {
          // Fallback if no location given
          const fb = weather.temperature.data.find(d => d.place.includes("Observatory") || d.place === "香港天文台");
          if (fb) bestPlaceName = fb.place;
          else bestPlaceName = weather.temperature.data[0].place;
      }
  }

  const tempPlace = weather?.temperature?.data?.find(d => d.place === bestPlaceName) || weather?.temperature?.data?.[0];
  const humidityPlace = weather?.humidity?.data?.[0]; // Humidity usually only has a few stations, take first

  const hasWarnings = warnings && Object.keys(warnings).length > 0;
  const iconCode = weather?.icon?.[0] ?? 50;

  return (
    <div className="w-full space-y-6 animate-in fade-in zoom-in duration-500">

      {/* Warnings Banner */}
      {hasWarnings && (
        <div className="glass !bg-red-500/20 !border-red-500/30 p-4 rounded-2xl flex items-start space-x-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="shrink-0 mt-0.5" size={20} />
          <div className="text-sm font-medium">
             Active warnings (Check HKO for details)
          </div>
        </div>
      )}

      {/* Main Temp Widget */}
      <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Simple Icon Mapping */}
        <div className="mb-4">
           {iconCode >= 60 ? <CloudRain size={64} className="text-blue-500" /> :
            iconCode >= 50 ? <Cloud size={64} className="text-gray-400" /> :
            <Sun size={64} className="text-yellow-500" />}
        </div>

        <div className="text-6xl font-light tracking-tighter mb-2">
          {tempPlace?.value ?? '--'}°
        </div>
        <div className="text-lg font-medium text-black dark:text-white flex items-center gap-2">
          {tempPlace?.place ?? t('title')}
          {coords && <span className="w-2 h-2 rounded-full bg-green-500 inline-block" title="Using exact location"></span>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400 font-medium w-full max-w-xs">
          <div className="flex flex-col items-center glass-darker p-3 rounded-2xl">
             <span className="mb-1 uppercase text-[10px] tracking-wider opacity-70">{t('humidity')}</span>
             <span className="text-black dark:text-white">{humidityPlace?.value ?? '--'}%</span>
          </div>
          <div className="flex flex-col items-center glass-darker p-3 rounded-2xl">
             <span className="mb-1 uppercase text-[10px] tracking-wider opacity-70">{t('rainfall_prob')}</span>
             <span className="text-black dark:text-white">{forecast?.weatherForecast[0]?.PSR ?? '--'}</span>
          </div>
          <div className="flex flex-col items-center glass-darker p-3 rounded-2xl col-span-2">
             <span className="mb-1 uppercase text-[10px] tracking-wider opacity-70">{t('wind')}</span>
             <span className="text-black dark:text-white text-center text-xs">{forecast?.weatherForecast[0]?.forecastWind ?? '--'}</span>
          </div>
          <div className="flex flex-col items-center glass-darker p-3 rounded-2xl">
             <span className="mb-1 uppercase text-[10px] tracking-wider opacity-70">{t('rain_mm')}</span>
             <span className="text-black dark:text-white">{weather?.rainfall?.data?.find(d => d.place.includes(tempPlace?.place || ""))?.max ?? weather?.rainfall?.data?.[0]?.max ?? 0}</span>
          </div>
          <div className="flex flex-col items-center glass-darker p-3 rounded-2xl justify-center text-center">
              <span className="mb-1 uppercase text-[10px] tracking-wider opacity-70">{t('warnings')}</span>
              <span className={clsx("text-xs font-medium", weather?.warningMessage ? "text-red-500" : "text-black dark:text-white")}>
                 {Array.isArray(weather?.warningMessage) ? weather.warningMessage.join(', ') : weather?.warningMessage || "-"}
              </span>
          </div>
        </div>

        {/* 2-Hour Rainfall / Local Forecast block */}
        {localForecast?.forecastDesc && (
          <div className="mt-6 w-full p-4 rounded-2xl glass-darker text-sm text-center">
             <div className="flex items-center justify-center gap-2 font-medium mb-1 opacity-70">
                <Droplets size={16} /> <span>{t('rainfall_forecast')}</span>
             </div>
             <p className="opacity-90">{localForecast.forecastDesc}</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForecast(!showForecast)}
          className="mt-6 px-4 py-2 rounded-full glass-darker text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Calendar size={16} /> {t('forecast')}
        </motion.button>
      </div>

      {/* 9-Day Forecast Modal / Expandable Area */}
      <AnimatePresence>
        {showForecast && forecast && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass p-6 rounded-3xl space-y-4 origin-top"
          >
             <h3 className="font-semibold text-lg">{t('forecast')}</h3>
             <div className="space-y-3">
                {forecast.weatherForecast.map((day, idx) => (
                   <div key={idx} className="flex items-center justify-between text-sm border-b border-black/5 dark:border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="w-20 font-medium shrink-0">{day.week.substring(0,3)}</div>
                      <div className="flex-1 text-center text-xs opacity-70 px-2">{day.forecastWeather}</div>
                      <div className="w-24 text-right tabular-nums shrink-0">
                         <span className="opacity-60">{day.forecastMintemp.value}°</span>
                         <span className="mx-1">-</span>
                         <span className="font-medium">{day.forecastMaxtemp.value}°</span>
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
