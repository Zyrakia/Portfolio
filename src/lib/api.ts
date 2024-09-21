import ky from 'ky';
import { env } from '../env';
import { z } from 'zod';

const BaseResponseSchema = z.object({
	success: z.boolean(),
	statusCode: z.number(),
	statusMessage: z.string(),
});

const SuccessResponseSchema = BaseResponseSchema.extend({
	success: z.literal(true),
	message: z.string().optional(),
	value: z.any().optional(),
});

const ErrorResponseSchema = BaseResponseSchema.extend({
	success: z.literal(false),
	error: z.string(),
});

const ResponseSchema = SuccessResponseSchema.or(ErrorResponseSchema);

const client = ky.create({
	prefixUrl: env.VITE_API_URL,
	retry: 5,
});

export async function api<
	Route extends keyof Routes,
	Method extends keyof Routes[Route],
	Handler = Routes[Route][Method],
>(
	url: Route,
	method: Method,
	init: {
		body?: Handler extends HandlerType<unknown, infer Body> ? Body : never;
		params?: Record<string, string>;
		query?: Record<string, unknown>;
	} = {},
) {
	const { body, params = {}, query = {} } = init;

	let formattedUrl: string = url.replace(/^\//g, '');
	const requiredParams = url.matchAll(/\[(.+)\]/g);
	for (const [param] of requiredParams) {
		if (!(param in params)) throw `Param ${param} must be specified on this route!`;
		formattedUrl = url.replaceAll(`[${param}]`, params[param]);
	}

	const stringifiedQuery: Record<string, string> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		stringifiedQuery[key] = `${value}`;
	}

	const res = await client(formattedUrl, {
		json: body,
		searchParams: stringifiedQuery,
		method: method as any,
	}).json();
	const result = ResponseSchema.parse(res);

	if (result.success) return result.value as Handler extends HandlerType<infer Payload> ? Payload : never;
	else throw new Error('API Returned Error: ' + result.error);
}
