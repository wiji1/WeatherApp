import {Request, Response} from 'express';
import {Types} from "mongoose";

export interface ApiRequest<TReq> extends Request {
    body: TReq;
    auth?: {
        authId: Types.ObjectId;
        userId?: Types.ObjectId;
    };
    user?: any;
}

export interface ApiResponse<TRes> extends Response {
    json: (body: ApiResponseBody<TRes>) => this;
}

export interface ApiResponseBody<TRes> {
    success?: boolean;
    data?: TRes;
    error?: string;
}

export interface ApiEndpoint<TReq = unknown, TRes = unknown> {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    auth: AuthType;
    handler: (req: ApiRequest<TReq>, res: ApiResponse<TRes>) => Promise<TRes>;
}

type ValidateExact<T, U> =
  T extends U 
    ? U extends T 
      ? U
      : { error: "Return type has missing properties"; expected: T; actual: U }
    : { error: "Return type has excess properties"; expected: T; actual: U };

export function createEndpoint<TReq = unknown, TRes = unknown>(
    config: {
        path: string;
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        auth: AuthType;
        handler: (req: ApiRequest<TReq>, res: ApiResponse<TRes>) => Promise<ValidateExact<TRes, TRes>>;
    }
): ApiEndpoint<TReq, TRes> {
    return config as ApiEndpoint<TReq, TRes>;
}

export function createEndpointStrict<TReq = unknown, TRes = unknown>(
    factory: (validator: <T>(value: T) => ValidateExact<TRes, T>, data: (requestData: any) => TReq) => {
        path: string;
        method: 'get' | 'post' | 'put' | 'delete' | 'patch';
        auth: AuthType;
        handler: (req: ApiRequest<TReq>, res: ApiResponse<TRes>) => Promise<TRes>;
        validator?: any;
    }
): ApiEndpoint<TReq, TRes> {
    const validate = <T>(value: T): ValidateExact<TRes, T> => value as any;
    const data = (requestData: any): TReq => {
        const config = factory(validate, data);
        if (config.validator) {
            return config.validator.parse(requestData);
        }
        return requestData;
    };
    return factory(validate, data) as ApiEndpoint<TReq, TRes>;
}

export interface ApiHandler<TReq = unknown, TRes = unknown> {
    (req: ApiRequest<TReq>, res: ApiResponse<TRes>): Promise<TRes | void>;
}

export enum AuthType {
    None = 'none',
    Basic = 'basic',
    Admin = 'admin',
}