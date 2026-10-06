// HKO API Base URL for open data
const HKO_BASE_URL = 'https://data.weather.gov.hk/weatherAPI/opendata';

// Language mappings for HKO API (en, tc, sc)
export type HKOLang = 'en' | 'tc' | 'sc';

export interface LocalWeather {
  temperature: {
    data: { place: string; value: number; unit: string }[];
  };
  humidity: {
    data: { place: string; value: number; unit: string }[];
  };
  icon: number[];
  updateTime: string;
  warningMessage?: string | string[];
  rainfall?: {
    data: { max: number; unit: string; place: string }[];
  };
}

export interface WeatherWarning {
  details?: Array<{
    warningStatementCode: string;
    subtype: string;
    updateTime: string;
  }>;
}

export interface NineDayForecast {
  weatherForecast: Array<{
    forecastDate: string;
    week: string;
    forecastWind: string;
    forecastWeather: string;
    forecastMaxtemp: { value: number; unit: string };
    forecastMintemp: { value: number; unit: string };
    forecastMaxrh: { value: number; unit: string };
    forecastMinrh: { value: number; unit: string };
    ForecastIcon: number;
    PSR: string; // Probability of Significant Rain
  }>;
}

export async function getLocalWeather(lang: HKOLang): Promise<LocalWeather | null> {
  try {
    const res = await fetch(`${HKO_BASE_URL}/weather.php?dataType=rhrread&lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch local weather');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getWeatherWarnings(lang: HKOLang): Promise<WeatherWarning | null> {
  try {
    const res = await fetch(`${HKO_BASE_URL}/weather.php?dataType=warnsum&lang=${lang}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch warnings');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getNineDayForecast(lang: HKOLang): Promise<NineDayForecast | null> {
  try {
    const res = await fetch(`${HKO_BASE_URL}/weather.php?dataType=fnd&lang=${lang}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch 9-day forecast');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 2-hour rainfall API based on Lat/Lng doesn't officially exist in the public "open data" endpoint in a straightforward way
// (it provides text bulletins or image overlays). The official HKO mobile app uses private APIs for exact lat/long.
// As a fallback for "simplified minimal app", we will use the Localized Forecast or general text for rainfall.
// Or if you meant the "Local Forecast" (flw) API:
export async function getLocalForecast(lang: HKOLang): Promise<any | null> {
  try {
    const res = await fetch(`${HKO_BASE_URL}/weather.php?dataType=flw&lang=${lang}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch local forecast');
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}


// A rough mapping of major HKO station names to lat/long to map user's location to closest station
const stationCoordinates: Record<string, { lat: number, lon: number }> = {
  "King's Park": { lat: 22.311, lon: 114.172 },
  "Hong Kong Observatory": { lat: 22.301, lon: 114.174 },
  "Wong Chuk Hang": { lat: 22.247, lon: 114.173 },
  "Ta Kwu Ling": { lat: 22.528, lon: 114.156 },
  "Lau Fau Shan": { lat: 22.468, lon: 113.983 },
  "Tai Po": { lat: 22.446, lon: 114.178 },
  "Sha Tin": { lat: 22.402, lon: 114.206 },
  "Tuen Mun": { lat: 22.385, lon: 113.964 },
  "Tseung Kwan O": { lat: 22.315, lon: 114.259 },
  "Sai Kung": { lat: 22.383, lon: 114.274 },
  "Cheung Chau": { lat: 22.201, lon: 114.026 },
  "Chek Lap Kok": { lat: 22.309, lon: 113.921 },
  "Tsing Yi": { lat: 22.348, lon: 114.110 },
  "Tsuen Wan Shing Mun Valley": { lat: 22.381, lon: 114.124 },
  "Hong Kong Park": { lat: 22.277, lon: 114.161 },
  "Shau Kei Wan": { lat: 22.281, lon: 114.232 },
  "Kowloon City": { lat: 22.335, lon: 114.186 },
  "Happy Valley": { lat: 22.270, lon: 114.183 },
  "Wong Tai Sin": { lat: 22.339, lon: 114.198 },
  "Stanley": { lat: 22.218, lon: 114.215 },
  "Kwun Tong": { lat: 22.319, lon: 114.225 },
  "Sham Shui Po": { lat: 22.332, lon: 114.156 },
  "Kai Tak Runway Park": { lat: 22.305, lon: 114.215 },
  "Yuen Long Park": { lat: 22.440, lon: 114.018 },
  "Tai Mei Tuk": { lat: 22.474, lon: 114.237 },
};

// Chinese to English mappings (simplified) just to match our coords dictionary if using TC/SC
const stationTranslations: Record<string, string> = {
  "京士柏": "King's Park",
  "香港天文台": "Hong Kong Observatory",
  "黃竹坑": "Wong Chuk Hang",
  "打鼓嶺": "Ta Kwu Ling",
  "流浮山": "Lau Fau Shan",
  "大埔": "Tai Po",
  "沙田": "Sha Tin",
  "屯門": "Tuen Mun",
  "將軍澳": "Tseung Kwan O",
  "西貢": "Sai Kung",
  "長洲": "Cheung Chau",
  "赤鱲角": "Chek Lap Kok",
  "青衣": "Tsing Yi",
  "荃灣城門谷": "Tsuen Wan Shing Mun Valley",
  "香港公園": "Hong Kong Park",
  "筲箕灣": "Shau Kei Wan",
  "九龍城": "Kowloon City",
  "跑馬地": "Happy Valley",
  "黃大仙": "Wong Tai Sin",
  "赤柱": "Stanley",
  "觀塘": "Kwun Tong",
  "深水埗": "Sham Shui Po",
  "啟德跑道公園": "Kai Tak Runway Park",
  "元朗公園": "Yuen Long Park",
  "大美督": "Tai Mei Tuk",
};

// Haversine distance formula to find closest station
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

export function getClosestStation(lat: number, lon: number, availablePlaces: string[]): string {
    let closestPlace = availablePlaces[0];
    let minDistance = Infinity;

    for (const place of availablePlaces) {
        // Map Chinese names to English to match dictionary
        const englishName = stationTranslations[place] || place;
        const coords = stationCoordinates[englishName];

        if (coords) {
            const dist = getDistance(lat, lon, coords.lat, coords.lon);
            if (dist < minDistance) {
                minDistance = dist;
                closestPlace = place;
            }
        }
    }

    return closestPlace;
}
