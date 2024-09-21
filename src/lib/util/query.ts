import { z } from 'zod';
import type { ZodTypeAny } from 'zod';

/**
 * Parses a record, such as the parsed query string, into a record.
 *
 * Each entry in the map is only passed through if it is declared in the expected schema, and the value matches the expected schema.
 *
 * @param record the dataset to parse
 * @param expect the expected schema
 * @returns the parsed map
 */
export function q<T extends Record<string, ZodTypeAny>>(record: URLSearchParams, expect: T) {
	const res: { [K in keyof T]?: T[K] extends ZodTypeAny ? z.infer<T[K]> : never } = {};

	for (const [key, schema] of Object.entries(expect)) {
		if (!record.has(key)) continue;

		const parsed = schema.safeParse(record.get(key));
		if (!parsed.success) continue;

		(res as any)[key] = parsed.data;
	}

	return res;
}
