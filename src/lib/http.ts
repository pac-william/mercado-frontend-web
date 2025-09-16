type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions<TBody = unknown> {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: TBody;
    authToken?: string | null;
    signal?: AbortSignal;
}

export interface HttpResponseError extends Error {
    status: number;
    payload?: unknown;
}

const DEFAULT_HEADERS: Record<string, string> = {
    'Content-Type': 'application/json'
};

const isJson = (value: unknown): value is object =>
    typeof value === 'object' && value !== null;

export async function http<TResponse = unknown, TBody = unknown>(
    url: string,
    options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
    const { method = 'GET', headers, body, authToken, signal } = options;

    const mergedHeaders: Record<string, string> = {
        ...DEFAULT_HEADERS,
        ...(headers ?? {})
    };

    if (authToken) {
        mergedHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const fetchOptions: RequestInit = {
        method,
        headers: mergedHeaders,
        signal
    };

    if (body !== undefined && body !== null) {
        fetchOptions.body = isJson(body) ? JSON.stringify(body) : (body as unknown as BodyInit);
    }

    const res = await fetch(url, fetchOptions);

    const contentType = res.headers.get('content-type') || '';
    const isJsonResponse = contentType.includes('application/json');
    const payload = isJsonResponse ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

    if (!res.ok) {
        const error: HttpResponseError = Object.assign(new Error('HTTP error'), {
            name: 'HttpResponseError',
            status: res.status,
            payload
        });
        throw error;
    }

    return payload as TResponse;
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function buildApiUrl(path: string): string {
    if (!apiBaseUrl) return path; // permite usar rotas internas (/api/*)
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${apiBaseUrl}${normalized}`;
}

