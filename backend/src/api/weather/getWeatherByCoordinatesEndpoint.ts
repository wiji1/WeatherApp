import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {WeatherService} from "../../services/WeatherService";

const getWeatherByCoordinatesSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180)
}).strict();

export interface GetWeatherByCoordinatesRequest {
    lat: number;
    lon: number;
}

export interface GetWeatherByCoordinatesResponse {
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    city: string;
    country: string;
}

export const getWeatherByCoordinatesEndpoint = createEndpointStrict<GetWeatherByCoordinatesRequest, GetWeatherByCoordinatesResponse>((validate, data) => ({
    path: '/weather/coordinates',
    method: 'get',
    auth: AuthType.None,
    validator: getWeatherByCoordinatesSchema,
    handler: async (req, _res) => {
        const requestData = data(req.query);
        
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key not configured');
        }

        const weatherService = new WeatherService(apiKey);
        const weatherData = await weatherService.getWeatherByCoordinates(requestData.lat, requestData.lon);

        return validate(weatherData);
    }
}));