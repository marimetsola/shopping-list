"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemList_1 = __importDefault(require("../models/itemList"));
const user_1 = __importDefault(require("../models/user"));
const listsInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield itemList_1.default.find({});
    return lists.map((list) => list.toJSON());
});
const usersInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    return users.map(u => u.toJSON());
});
exports.default = { listsInDb, usersInDb };
