import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre';
  return <button type="button" onClick={toggleTheme} aria-label={label} title={label} className="rounded-full border border-slate-500/40 bg-background p-2 text-foreground shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>;
}
