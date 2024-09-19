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
		return request('projects');
	}

	export function getProject(id: number, includeTechnologies: boolean) {
		return request(`projects/${id}?${includeTechnologies ? 'technologies=true' : ''}`, { method: 'GET' });
	}

	export async function getProjectsUsing(techId: number) {
		return request(`projects?using=${techId}`);
	}

	export async function getTechnologies() {
		return request('tech');
	}

	export async function getTechnology(id: number) {
		return request(`tech/${id}`);
	}

	export async function getTechnologiesUsedBy(projectId: number) {
		return request(`tech?used_by=${projectId}`);
	}

	async function request<T>(url: string, options: Options = { method: 'get' }) {
		const res = await client(url, options).json<Response<T>>();
		if (res && res.success) return res.value;
		else throw new Error(res?.error);
	}
}
