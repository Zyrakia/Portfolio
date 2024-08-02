import { DiscordLogo, GithubLogo, XLogo } from '@phosphor-icons/react/dist/ssr';
import styles from './page.module.css';

export default function Home() {
	return (
		<main className={styles.main}>
			<h1>✨ Construction Underway ✨</h1>
			<p>For now, you can catch me here:</p>
			<ul className={styles.list}>
				<li>
					<a href='https://github.com/Zyrakia' title='@Zyrakia'>
						<GithubLogo size={32} />
					</a>
				</li>
				<li>
					<a href='https://x.com/Zyrakia' title='@Zyrakia'>
						<XLogo size={32} />
					</a>
				</li>
				<li>
					<a href='https://discord.com/users/243522319664807937' title='Zyrakia#3215'>
						<DiscordLogo size={32} />
					</a>
				</li>
			</ul>
		</main>
	);
}
