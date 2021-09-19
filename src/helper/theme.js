export function isDarkThemeActive() {
  let userPrefersDarkTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return userPrefersDarkTheme;
}

export function toggleColorTheme(isDarkTheme) {
  document.body.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
}
