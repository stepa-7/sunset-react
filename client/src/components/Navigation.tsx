import { Link, useLocation } from 'wouter';

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav>
      <Link href="/">
        <a className={isActive('/') ? 'active' : ''}>Главная</a>
      </Link>
      <Link href="/music">
        <a className={isActive('/music') ? 'active' : ''}>Музыка</a>
      </Link>
      <Link href="/currency">
        <a className={isActive('/currency') ? 'active' : ''}>Конвертер валюты</a>
      </Link>
      <Link href="/books">
        <a className={isActive('/books') ? 'active' : ''}>Книги</a>
      </Link>
    </nav>
  );
}
