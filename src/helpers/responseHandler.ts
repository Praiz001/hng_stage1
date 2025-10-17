export interface HttpResponse {
    status: 'success' | 'error';
    message?: string;
    data?: any;
}

export function successResponse(data?: any, message?: string): HttpResponse {
    return ({
        status: 'success',
        message,
        ...data,
    });
}

export function errorResponse(message: string, data?: any): HttpResponse {
    return ({
        status: 'error',
        message,
        data,
    });
}