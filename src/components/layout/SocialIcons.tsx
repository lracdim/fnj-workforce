import { Mail } from 'lucide-react';

// lucide-react version in this project may not include brand icons.
// Provide lightweight placeholders to avoid build failures.
export function FacebookIcon(props: { size?: number; className?: string }) {
  return <Mail size={props.size ?? 15} className={props.className} />;
}

export function InstagramIcon(props: { size?: number; className?: string }) {
  return <Mail size={props.size ?? 15} className={props.className} />;
}

export function LinkedinIcon(props: { size?: number; className?: string }) {
  return <Mail size={props.size ?? 15} className={props.className} />;
}

