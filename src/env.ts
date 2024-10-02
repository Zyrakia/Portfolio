import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	clientPrefix: 'VITE_',
	client: {
		VITE_API_URL: z.string().transform((v) => {
			if (v.startsWith('https://') || v.startsWith('http://')) return v;
			return `https://${v}`;
		}),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
