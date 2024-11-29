"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureID = void 0;
const crypto_1 = __importDefault(require("crypto"));
function generateSecureID(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const randomIndex = bytes[i] % characters.length;
        result += characters.charAt(randomIndex);
    }
    return result;
}
exports.generateSecureID = generateSecureID;
