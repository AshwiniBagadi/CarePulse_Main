"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.useTheme = void 0;
const react_1 = require("react");
const ThemeContext = (0, react_1.createContext)({
    theme: 'light',
    toggleTheme: () => { },
    t: (light, _dark) => light,
});
function useTheme() {
    return (0, react_1.useContext)(ThemeContext);
}
exports.useTheme = useTheme;
function ThemeProvider({ children }) {
    const [theme, setTheme] = (0, react_1.useState)('light');
    (0, react_1.useEffect)(() => {
        document.body.style.background = theme === 'light' ? '#FDF8F3' : '#0F1117';
    }, [theme]);
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const t = (light, dark) => theme === 'light' ? light : dark;
    return (<ThemeContext.Provider value={{ theme, toggleTheme, t }}>
      {children}
    </ThemeContext.Provider>);
}
exports.ThemeProvider = ThemeProvider;
//# sourceMappingURL=ThemeContext.js.map