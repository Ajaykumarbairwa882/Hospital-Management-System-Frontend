import { useEffect, useState } from "react";

function useTheme() {
  const savedTheme = localStorage.getItem("hmsTheme");
  const [theme, setTheme] = useState(savedTheme || "light");

  const isDark = theme === "dark";
  const modeText = isDark ? "Light Mode" : "Dark Mode";

  useEffect(() => {
    localStorage.setItem("hmsTheme", theme);
    document.body.classList.toggle("dark", isDark);
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme((oldTheme) => (oldTheme === "dark" ? "light" : "dark"));
  };

  return {
    modeText,
    toggleTheme,
  };
}

export default useTheme;
