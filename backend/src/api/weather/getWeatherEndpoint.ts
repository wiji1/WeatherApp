import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {WeatherService} from "../../services/WeatherService";

const getWeatherSchema = z.object({
    city: z.string().min(1),
}).strict();

export interface GetWeatherRequest {
    city: string;
}

export interface GetWeatherResponse {
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    city: string;
    country: string;
}

export const getWeatherEndpoint = createEndpointStrict<GetWeatherRequest, GetWeatherResponse>((validate, data) => ({
    path: '/weather',
    method: 'get',
    auth: AuthType.None,
    validator: getWeatherSchema,
    handler: async (req, _res) => {
        const requestData = data(req.query);
        
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key not configured');
        }

        const weatherService = new WeatherService(apiKey);
        const weatherData = await weatherService.getWeatherByCity(requestData.city);

        return validate(weatherData);
    }
}));