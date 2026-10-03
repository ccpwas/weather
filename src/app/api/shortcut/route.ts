import { NextResponse } from 'next/server';
import { getLocalWeather, getWeatherWarnings, HKOLang } from '@/lib/hko-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get('lang') || 'en') as HKOLang;

  try {
    const [weather, warnings] = await Promise.all([
      getLocalWeather(lang),
      getWeatherWarnings(lang)
    ]);

    let text = '';

    // Construct the text based on locale
    const isEn = lang === 'en';
    const isTc = lang === 'tc';

    const temp = weather?.temperature?.data?.[0]?.value;
    const humidity = weather?.humidity?.data?.[0]?.value;

    let warningText = '';
    if (warnings?.details && warnings.details.length > 0) {
        const activeCount = warnings.details.length;
        warningText = isEn
            ? `There are ${activeCount} active weather warnings.`
            : isTc ? `現時有 ${activeCount} 個生效的警告。` : `现时有 ${activeCount} 个生效的警告。`;
    } else {
        warningText = isEn
            ? `There are no active weather warnings.`
            : isTc ? `現時沒有生效的警告。` : `现时没有生效的警告。`;
    }

    if (temp && humidity) {
        const weatherDesc = isEn
            ? `The current temperature in Hong Kong is ${temp} degrees with ${humidity}% humidity.`
            : isTc ? `香港現時氣溫為 ${temp} 度，濕度為 ${humidity}%。` : `香港现时气温为 ${temp} 度，湿度为 ${humidity}%。`;

        text = `${weatherDesc} ${warningText}`;
    } else {
        text = isEn
            ? `Failed to fetch current weather data.`
            : isTc ? `無法獲取當前天氣數據。` : `无法获取当前天气数据。`;
    }

    return NextResponse.json({
      success: true,
      text,
      data: {
          weather,
          warnings
      }
    });

  } catch (error) {
    console.error('Shortcut API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data for shortcut' },
      { status: 500 }
    );
  }
}
