import express, {NextFunction, Request, RequestHandler, Response, Router} from 'express';
import {ApiEndpoint, ApiRequest, ApiResponse} from '../api/types';
import {getWeatherEndpoint} from "../api/weather/getWeatherEndpoint";
import {searchCitiesEndpoint} from "../api/weather/searchCitiesEndpoint";
import {getWeatherByCoordinatesEndpoint} from "../api/weather/getWeatherByCoordinatesEndpoint";
import {registerEndpoint} from "../api/auth/registerEndpoint";
import {loginEndpoint} from "../api/auth/loginEndpoint";
import {meEndpoint} from "../api/auth/meEndpoint";
import {authenticateToken} from "../middleware/auth";
import {addFavoriteEndpoint} from "../api/favorites/addFavoriteEndpoint";
import {removeFavoriteEndpoint} from "../api/favorites/removeFavoriteEndpoint";
import {getFavoritesEndpoint} from "../api/favorites/getFavoritesEndpoint";
import {checkFavoriteEndpoint} from "../api/favorites/checkFavoriteEndpoint";

export default class ApiManager {
    private static instance: ApiManager;
    private readonly router: Router;
    private endpoints: ApiEndpoint<any, any>[] = [];

    private constructor() {
        this.router = express.Router();
        this.setupMiddleware();
        this.registerEndpoints();
    }

    private registerEndpoints() {
        this.addEndpoint(getWeatherEndpoint);
        this.addEndpoint(searchCitiesEndpoint);
        this.addEndpoint(getWeatherByCoordinatesEndpoint);
        
        // Auth endpoints
        this.router.post('/api/auth/register', registerEndpoint);
        this.router.post('/api/auth/login', loginEndpoint);
        this.router.get('/api/auth/me', authenticateToken, meEndpoint);
        
        // Favorites endpoints
        this.router.post('/api/favorites', authenticateToken, addFavoriteEndpoint);
        this.router.delete('/api/favorites/:favoriteId', authenticateToken, removeFavoriteEndpoint);
        this.router.get('/api/favorites', authenticateToken, getFavoritesEndpoint);
        this.router.get('/api/favorites/check', authenticateToken, checkFavoriteEndpoint);
    }

    private setupMiddleware() {
        this.router.use(express.json());

        this.router.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        this.router.use((req, res, next) => {
            if (!req.path.startsWith('/api')) {
                next();
                return;
            }

            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${req.method} ${req.path}`);
            next();
        });

        this.router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        });
    }

    private addEndpoint<TReq = unknown, TRes = unknown>(endpoint: ApiEndpoint<TReq, TRes>) {
        this.endpoints.push(endpoint);

        const handlers: RequestHandler[] = [];

        //TODO: Add authentication handlers here

        // if (endpoint.auth === AuthType.Basic) {
        //     handlers.push(handleBasicAuth);
        // } else if (endpoint.auth === AuthType.Admin) {
        //     handlers.push(handleAdminAuth);
        // }

        const wrappedHandler: RequestHandler = async (
            req: Request,
            res: Response
        ) => {
            const typedReq = req as ApiRequest<TReq>;
            const typedRes = res as ApiResponse<TRes>;

            try {
                const result = await endpoint.handler(typedReq, typedRes);
                if (!typedRes.headersSent && result !== undefined) {
                    typedRes.json({ success: true, data: result });
                }
            } catch (error) {
                if (!typedRes.headersSent) {
                    typedRes.status(500).json({
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
        };

        handlers.push(wrappedHandler);

        const apiPath = endpoint.path.startsWith('/api') ? endpoint.path : `/api${endpoint.path}`;
        this.router[endpoint.method](apiPath, ...handlers);
        console.log(`registered api endpoint: ${endpoint.method.toUpperCase()} ${apiPath}`);
    }

    getRouter(): Router {
        return this.router;
    }

    static getInstance(): ApiManager {
        if (!ApiManager.instance) {
            ApiManager.instance = new ApiManager();
        }
        return ApiManager.instance;
    }
}
