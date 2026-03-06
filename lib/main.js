"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const ThemeContext_1 = require("./ThemeContext");
require("./index.css");
const App_1 = __importDefault(require("./App"));
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.StrictMode>
    <react_router_dom_1.BrowserRouter>
      <ThemeContext_1.ThemeProvider>
        <App_1.default />
      </ThemeContext_1.ThemeProvider>
    </react_router_dom_1.BrowserRouter>
  </react_1.StrictMode>);
//# sourceMappingURL=main.js.map