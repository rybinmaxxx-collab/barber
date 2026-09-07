import { contacts, nav } from '@/lib/content';

export default function Header() {
  return (
    <header className="nav">
      <a className="brand" href="#hero">
        БАРБЕР ОТ БОГА
      </a>
      <nav className="nav-links" aria-label="Разделы страницы">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href={contacts.phoneHref}>
        Записаться
      </a>
    </header>
  );
}
