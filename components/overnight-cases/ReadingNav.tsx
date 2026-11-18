import "./cases.css";
export default function ReadingNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  return (
    <nav className="oc-reading-nav" aria-label="Case study sections">
      <span>In this case</span>
      {items.map((item) => (
        <a href={item.href} key={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
