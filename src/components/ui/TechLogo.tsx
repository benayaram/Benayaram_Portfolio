export const BRAND: Record<string, string> = Object.fromEntries(
  [
    'flutter',
    'dart',
    'android',
    'kotlin',
    'react',
    'html5',
    'css3',
    'javascript',
    'materialui',
    'bootstrap',
    'nodejs',
    'firebase',
    'flask',
    'postgresql',
    'mysql',
    'sqlite',
    'python',
    'git',
    'github',
    'jira',
    'androidstudio',
    'vscode',
    'postman',
  ].map((name) => [name, `/logos/${name}.svg`]),
);
export const CONCEPT: Record<string, string> = {
  trophy: 'M8 3h8v6a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v6m-4 2h8',
  code: 'm8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18',
};
export const isBrand = (name: string) => name in BRAND;
export default function TechLogo({ name, size = 24 }: { name: string; size?: number }) {
  return isBrand(name) ? (
    <img src={BRAND[name]} alt="" width={size} height={size} loading="lazy" />
  ) : (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth=".9"
      aria-hidden="true"
    >
      <path d={CONCEPT[name] ?? CONCEPT.code} />
    </svg>
  );
}
