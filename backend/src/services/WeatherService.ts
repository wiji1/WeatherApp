export interface WeatherData {
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    city: string;
    country: string;
}

export interface CitySearchResult {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export class WeatherService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    private readonly geocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key is required');
        }
        this.apiKey = apiKey;
    }

    async getWeatherByCity(city: string): Promise<WeatherData> {
        if (!city || city.trim().length === 0) {
            throw new Error('City name is required');
        }

        const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=imperial`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                }
                if (response.status === 404) {
                    throw new Error('City not found');
                }
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind?.speed || 0,
                city: data.name,
                country: data.sys.country
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch weather data');
        }
    }

    async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
        const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                }
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind?.speed || 0,
                city: data.name,
                country: data.sys.country
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch weather data');
        }
    }

    async searchCities(query: string, limit: number = 5): Promise<CitySearchResult[]> {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const trimmedQuery = query.trim();
        const url = `${this.geocodingUrl}?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}&appid=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid API key');
                }
                throw new Error(`Geocoding API error: ${response.status}`);
            }

            const data = await response.json();
            
            return data.map((city: any) => ({
                name: city.name,
                country: city.country,
                state: city.state,
                lat: city.lat,
                lon: city.lon
            }));
            
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to search cities');
        }
    }
}