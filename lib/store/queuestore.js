"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueueStore = void 0;
const zustand_1 = require("zustand");
exports.useQueueStore = (0, zustand_1.create)((set) => ({
    currentQueue: [],
    myAppointment: null,
    setQueue: (queue) => set({ currentQueue: queue }),
    setMyAppointment: (appointment) => set({ myAppointment: appointment }),
}));
//# sourceMappingURL=queuestore.js.map