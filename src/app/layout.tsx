import type { Metadata } from 'next';

import './globals.css';

import { Azeret_Mono } from 'next/font/google';
import * as meta from './config/meta-globals';

const globalFont = Azeret_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: meta.createPageTitle('Hello World'),
	description: meta.DESC,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={globalFont.className}>{children}</body>
		</html>
	);
}
