import { useEffect, useState } from 'react';
import { SunMedium , Moon } from "lucide-react";
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div
      // className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-full"
    >
      {isDark ? <SunMedium size={28} onClick={() => setIsDark(prev => !prev)}/> : <Moon onClick={() => setIsDark(prev => !prev)}/>}
      
      {/* Toggle {isDark ? 'Light' : 'Dark'} Mode */}
    </div>
  );
}