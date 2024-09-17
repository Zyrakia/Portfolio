import ky from 'ky';
import type { Options } from 'ky';
import { env } from '../env';

interface Response<T> {
	success: boolean;
	error?: string;
	value?: T;
}

export namespace API {
	const client = ky.create({
		prefixUrl: env.VITE_API_URL,
		retry: 5,
	});

	export async function getProjects() {
		return request('projects', { method: 'GET' });
	}

	export function getProject(id: number, includeTechnologies: boolean) {
		return request(`projects/${id}?${includeTechnologies ? 'technologies=true' : ''}`, { method: 'GET' });
	}

	async function request<T>(url: string, options: Options) {
		const res = await client(url, options).json<Response<T>>();
		if (res && res.success) return res.value;
		else throw new Error(res?.error);
	}
}
