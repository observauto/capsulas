export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Cápsulas", href: "/#capsulas" },
  { label: "Metodología", href: "/#metodologia" },
  { label: "Resultados", href: "/#resultados" },
  { label: "Pauta", href: "/pauta" },
  { label: "Premios", href: "/gamificacion" },
];
