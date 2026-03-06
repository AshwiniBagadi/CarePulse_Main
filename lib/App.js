"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const landing_1 = __importDefault(require("./pages/landing"));
const Auth_1 = __importDefault(require("./pages/Auth"));
const dashboard_1 = __importDefault(require("./pages/dashboard"));
const BookAppointment_1 = __importDefault(require("./pages/BookAppointment"));
const QueueTraker_1 = __importDefault(require("./pages/QueueTraker"));
const DoctorDashboard_1 = __importDefault(require("./pages/DoctorDashboard"));
const AdminDashboard_1 = __importDefault(require("./pages/AdminDashboard"));
const GovernmentScheme_1 = __importDefault(require("./pages/GovernmentScheme"));
const BedBooking_1 = __importDefault(require("./pages/BedBooking"));
function App() {
    return (<react_router_dom_1.Routes>
      <react_router_dom_1.Route path="/" element={<landing_1.default />}/>
      <react_router_dom_1.Route path="/login" element={<Auth_1.default />}/>
      <react_router_dom_1.Route path="/register" element={<Auth_1.default />}/>
      <react_router_dom_1.Route path="/dashboard" element={<dashboard_1.default />}/>
      <react_router_dom_1.Route path="/book" element={<BookAppointment_1.default />}/>
      <react_router_dom_1.Route path="/queue" element={<QueueTraker_1.default />}/>
      <react_router_dom_1.Route path="/doctor" element={<DoctorDashboard_1.default />}/>
      <react_router_dom_1.Route path="/admin" element={<AdminDashboard_1.default />}/>
      <react_router_dom_1.Route path="/schemes" element={<GovernmentScheme_1.default />}/>
      <react_router_dom_1.Route path="/beds" element={<BedBooking_1.default />}/>
    </react_router_dom_1.Routes>);
}
exports.default = App;
//# sourceMappingURL=App.js.map