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
const express_1 = __importDefault(require("express"));
const listService_1 = __importDefault(require("../services/listService"));
const guestService_1 = __importDefault(require("../services/guestService"));
require('express-async-errors');
const router = express_1.default.Router();
// Get all lists by user
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const lists = await listService.getAll().populate('user');
    const lists = yield listService_1.default.getListsByUser(req);
    const guestLists = yield listService_1.default.getGuestListsByUser(req);
    if (lists && guestLists) {
        res.send(lists.concat(guestLists));
    }
}));
// Get list with id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield listService_1.default.findById(req);
        if (list) {
            res.json(list.toJSON());
        }
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}));
// Add list with name
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newList = yield listService_1.default.addList(req);
    res.send(newList);
}));
// Delete list by id
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield listService_1.default.deleteList(req);
    res.status(204).end();
}));
// Add item to list
router.post('/:id/add-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addedItem = yield listService_1.default.addItem(req);
    res.send(addedItem);
}));
// Delete item from list
router.delete('/:id/delete-item/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield listService_1.default.deleteItem(req);
    res.status(204).end();
}));
// Edit item on a list
router.patch('/:id/edit-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield listService_1.default.editItem(req);
    res.send(updatedList);
}));
// Toggle strikethrough of an item on a list
router.patch('/:id/mark-item', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield listService_1.default.markItem(req);
    res.send(updatedList);
}));
// Update list
router.put('/:id/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield listService_1.default.updateList(req);
    res.send(updatedList);
}));
// Invite guest
router.post('/:id/invite-guest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.addInvitation(req);
    res.send(updatedList);
}));
// Remove guest invitation
router.post('/:id/uninvite-guest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.removeInvitation(req);
    res.send(updatedList);
}));
// Accept guest invitation
router.post('/:id/accept-invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.acceptInvitation(req);
    res.send(updatedList);
}));
// Decline guest invitation
router.post('/:id/decline-invite', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.declineInvitation(req);
    res.send(updatedList);
}));
// Remove guest
router.post('/:id/remove-guest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.removeGuest(req);
    res.send(updatedList);
}));
// Leave list
router.post('/:id/leave-list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedList = yield guestService_1.default.leaveList(req);
    res.send(updatedList);
}));
exports.default = router;
