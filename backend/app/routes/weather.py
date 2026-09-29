from datetime import datetime, timezone
from typing import Any

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(
    prefix="/api",
    tags=["Weather"]
)


class WeatherNow(BaseModel):
    temperatureC: float
    condition: str
    humidityPct: float
    windKmh: float
    rainProbabilityPct: float
    updatedAt: str


class WeatherDay(BaseModel):
    label: str
    date: str
    highC: float
    lowC: float
    rainProbabilityPct: float
    condition: str


class WeatherData(BaseModel):
    location: str
    now: WeatherNow
    forecast: list[WeatherDay]
    farmingImpact: list[str]
    dataSource: str


def weather_code_to_text(code: int) -> str:
    codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail",
    }

    return codes.get(code, "Unknown")


@router.get("/weather", response_model=WeatherData)
def get_weather(
    lat: float | None = None,
    lon: float | None = None,
):

    if lat is None or lon is None:
        raise HTTPException(
            status_code=400,
            detail="Latitude and longitude are required."
        )

    if not -90 <= lat <= 90:
        raise HTTPException(
            status_code=400,
            detail="Invalid latitude."
        )

    if not -180 <= lon <= 180:
        raise HTTPException(
            status_code=400,
            detail="Invalid longitude."
        )

    # Open-Meteo weather forecast API
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": lat,
        "longitude": lon,
        "current": (
            "temperature_2m,"
            "relative_humidity_2m,"
            "wind_speed_10m,"
            "precipitation,"
            "weather_code"
        ),
        "hourly": "precipitation_probability",
        "daily": (
            "weather_code,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_probability_max"
        ),
        "forecast_days": 3,
        "timezone": "auto",
        "wind_speed_unit": "kmh",
    }

    try:
        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        data: dict[str, Any] = response.json()

    except requests.RequestException as error:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {str(error)}"
        )

    # ---------------------------------------------------------
    # Current weather
    # ---------------------------------------------------------

    current = data["current"]

    current_code = int(
        current["weather_code"]
    )

    condition = weather_code_to_text(
        current_code
    )

    # Current hour precipitation probability
    hourly_probability = data.get(
        "hourly",
        {}
    ).get(
        "precipitation_probability",
        []
    )

    rain_probability = (
        float(hourly_probability[0])
        if hourly_probability
        else 0.0
    )

    # ---------------------------------------------------------
    # Daily forecast
    # ---------------------------------------------------------

    daily = data["daily"]

    dates = daily["time"]
    weather_codes = daily["weather_code"]
    max_temps = daily["temperature_2m_max"]
    min_temps = daily["temperature_2m_min"]
    rain_probabilities = daily[
        "precipitation_probability_max"
    ]

    forecast = []

    for i, date in enumerate(dates):

        if i == 0:
            label = "Today"
        elif i == 1:
            label = "Tomorrow"
        else:
            try:
                label = datetime.fromisoformat(
                    date
                ).strftime("%a")
            except ValueError:
                label = date

        forecast.append(
            WeatherDay(
                label=label,
                date=date,
                highC=float(max_temps[i]),
                lowC=float(min_temps[i]),
                rainProbabilityPct=float(
                    rain_probabilities[i]
                ),
                condition=weather_code_to_text(
                    int(weather_codes[i])
                ),
            )
        )

    # ---------------------------------------------------------
    # Simple farming impact
    # ---------------------------------------------------------

    farming_impact = []

    tomorrow_rain = (
        float(rain_probabilities[1])
        if len(rain_probabilities) > 1
        else 0
    )

    if tomorrow_rain >= 60:
        farming_impact.append(
            "High chance of rainfall tomorrow."
        )
        farming_impact.append(
            "Avoid unnecessary irrigation before rainfall."
        )
        farming_impact.append(
            "Check field drainage before heavy rainfall."
        )

    elif tomorrow_rain >= 30:
        farming_impact.append(
            "Moderate chance of rainfall tomorrow."
        )
        farming_impact.append(
            "Monitor rainfall before irrigation."
        )

    else:
        farming_impact.append(
            "Low rainfall probability in the near forecast."
        )
        farming_impact.append(
            "Check soil moisture before irrigation."
        )

    # ---------------------------------------------------------
    # Final response
    # ---------------------------------------------------------

    return WeatherData(

        location=(
            f"{data.get('latitude', lat):.4f}, "
            f"{data.get('longitude', lon):.4f}"
        ),

        now=WeatherNow(
            temperatureC=float(
                current["temperature_2m"]
            ),
            condition=condition,
            humidityPct=float(
                current["relative_humidity_2m"]
            ),
            windKmh=float(
                current["wind_speed_10m"]
            ),
            rainProbabilityPct=rain_probability,
            updatedAt=current.get(
                "time",
                datetime.now(
                    timezone.utc
                ).isoformat()
            ),
        ),

        forecast=forecast,

        farmingImpact=farming_impact,

        dataSource="Open-Meteo Weather Forecast API",
    )