import { Link, useLocation } from 'wouter';

export default function Navigation() {
    const [location] = useLocation();

    const isActive = (path: string) => location === path;

    return (
        <nav>
            <Link href="/" className={isActive('/') ? 'active' : ''}>
                Главная
            </Link>
            <Link href="/music" className={isActive('/music') ? 'active' : ''}>
                Музыка
            </Link>
            <Link href="/currency" className={isActive('/currency') ? 'active' : ''}>
                Конвертер валюты
            </Link>
            <Link href="/books" className={isActive('/books') ? 'active' : ''}>
                Книги
            </Link>
        </nav>
    );
}