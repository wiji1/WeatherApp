import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {WeatherService} from "../../services/WeatherService";

const searchCitiesSchema = z.object({
    query: z.string().min(2),
    limit: z.coerce.number().min(1).max(10).optional().default(5)
}).strict();

export interface SearchCitiesRequest {
    query: string;
    limit?: number;
}

export interface SearchCitiesResponse {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export const searchCitiesEndpoint = createEndpointStrict<SearchCitiesRequest, SearchCitiesResponse[]>((validate, data) => ({
    path: '/weather/search',
    method: 'get',
    auth: AuthType.None,
    validator: searchCitiesSchema,
    handler: async (req, _res) => {
        const requestData = data(req.query);
        
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            throw new Error('OpenWeatherMap API key not configured');
        }

        const weatherService = new WeatherService(apiKey);
        const cities = await weatherService.searchCities(requestData.query, requestData.limit);

        return validate(cities);
    }
}));