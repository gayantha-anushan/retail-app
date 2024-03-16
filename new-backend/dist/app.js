"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const app = (0, express_1.default)();
app.get('/hellow', (req, res) => {
    res.send("Hello Worls!");
});
app.use((0, connect_history_api_fallback_1.default)({
    verbose: true
}));
app.use(express_1.default.static(__dirname + '/public/'));
app.listen(3000, () => {
    return console.log("Application Started!");
});
//# sourceMappingURL=app.js.map