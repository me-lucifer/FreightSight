import type { SVGProps } from "react";

export function FreightSightLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16v12H4z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M4 16l-2 4h24l-2-4H4z" fill="hsl(var(--primary) / 0.5)" stroke="none" />
      <path d="M12 8v4" stroke="hsl(var(--primary-foreground))" />
      <path d="M10 10l2-2 2 2" stroke="hsl(var(--primary-foreground))" />
    </svg>
  );
}

export const Icons = {
  logo: FreightSightLogo,
};
