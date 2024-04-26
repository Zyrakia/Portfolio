import { Metadata } from 'next';
import * as meta from '../config/meta-globals';

export const metadata: Metadata = {
	title: meta.createPageTitle('Technologies'),
};

export default function Projects() {
	return <div></div>;
}
