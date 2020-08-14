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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const api = supertest_1.default(app_1.default);
const itemList_1 = __importDefault(require("../models/itemList"));
const item_1 = __importDefault(require("../models/item"));
const test_helper_1 = __importDefault(require("./test_helper"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
describe('when there is initially one user at db', () => {
    let rootUser;
    let token;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
        const passwordHash = yield bcrypt_1.default.hash('passu666', 10);
        rootUser = new user_1.default({ name: 'root', passwordHash });
        rootUser = yield rootUser.save();
        const response = yield api.post('/api/login')
            .send({
            name: 'root',
            password: 'passu666'
        })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        token = response.body.token;
    }));
    test('creation succeeds with a fresh username', () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            name: 'coco',
            password: 'passu123'
        };
        yield api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const usernames = usersAtEnd.map((u) => u.name);
        expect(usernames).toContain(newUser.name);
    }));
    test('login succeeds with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.post('/api/login')
            .send({
            name: 'root',
            password: 'passu666'
        })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body.name).toBe('root');
        token = response.body.token;
        expect(token.length).toBeGreaterThanOrEqual(1);
    }));
    test('creation fails with a proper statuscode and message if name already taken', () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            name: 'root',
            password: 'passu9000'
        };
        const result = yield api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(result.body.error).toContain('`name` to be unique');
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    }));
    describe('when there are initially some lists saved', () => {
        let initialLists;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield itemList_1.default.deleteMany({});
            initialLists = [
                new itemList_1.default({ name: "Lidl", user: rootUser }),
                new itemList_1.default({ name: "Prisma", user: rootUser })
            ];
            const addedLists = yield itemList_1.default.insertMany(initialLists);
            const rUser = yield user_1.default.findById(rootUser.id);
            if (rUser) {
                rUser.set({ lists: addedLists });
                yield rUser.save();
            }
        }));
        test('lists are returned as json', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .get('/api/lists')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        }));
        test('all lists by user are returned', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api
                .get('/api/lists')
                .set('Authorization', `Bearer ${token}`);
            expect(response.body).toHaveLength(initialLists.length);
        }));
        test('specific lists are within the returned lists', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api
                .get('/api/lists')
                .set('Authorization', `Bearer ${token}`);
            const names = response.body.map((r) => r.name);
            expect(names).toContain('Prisma');
            expect(names).toContain('Lidl');
        }));
        test('list can be found by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const lists = yield test_helper_1.default.listsInDb();
            const response = yield api
                .get(`/api/lists/${lists[0].id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.body.name).toBe(lists[0].name);
        }));
        describe('adding a list', () => {
            test('succeeds with a valid name', () => __awaiter(void 0, void 0, void 0, function* () {
                const newList = { name: 'Alepa' };
                yield api
                    .post('/api/lists')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newList)
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
                const listsAtEnd = yield test_helper_1.default.listsInDb();
                expect(listsAtEnd).toHaveLength(initialLists.length + 1);
                const names = listsAtEnd.map((l) => l.name);
                expect(names).toContain('Alepa');
            }));
            test('fails with an empty name', () => __awaiter(void 0, void 0, void 0, function* () {
                const newList = { name: '' };
                yield api
                    .post('/api/lists')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newList)
                    .expect(400);
                const listsAtEnd = yield test_helper_1.default.listsInDb();
                expect(listsAtEnd).toHaveLength(initialLists.length);
            }));
        });
        describe('deleting a list', () => {
            test('succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api
                    .delete(`/api/lists/${initialLists[0].id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204);
                const listsAtEnd = yield test_helper_1.default.listsInDb();
                expect(listsAtEnd).toHaveLength(initialLists.length - 1);
                const listNames = listsAtEnd.map((l) => l.name);
                expect(listNames).not.toContainEqual(initialLists[0].name);
                expect(listNames).toContainEqual(initialLists[1].name);
            }));
        });
        describe('adding an item', () => {
            test('succeeds with a valid name', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i) => i.name);
                expect(items).toContain('milk');
            }));
            test('fails with an empty name', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: '' })
                    .expect(400);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.body.items.length).toBe(0);
            }));
        });
        describe('deleting an item', () => {
            test('succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                const itemID = (yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200))
                    .body.id;
                yield api
                    .delete(`/api/lists/${id}/delete-item/${itemID}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i) => i.name);
                expect(items).not.toContain('milk');
            }));
        });
        describe('editing an item', () => {
            test('succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                const item = (yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200))
                    .body;
                const editedItem = Object.assign(Object.assign({}, item), { name: "chicken" });
                yield api
                    .patch(`/api/lists/${id}/edit-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ item: editedItem });
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i) => i.name);
                expect(items).not.toContain('milk');
                expect(items).toContain('chicken');
            }));
        });
        describe('updating a list', () => {
            test('succeeds with valid array', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);
                const newItems = [
                    new item_1.default({ name: "beef", list: id }),
                    new item_1.default({ name: "candy", list: id })
                ];
                const addedItems = yield item_1.default.insertMany(newItems);
                yield api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: addedItems })
                    .expect(200);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const itemNames = response.body.items.map((i) => i.name);
                const addedItemNames = addedItems.map((i) => i.name);
                expect(itemNames).toEqual(addedItemNames);
                expect(itemNames).not.toContain('milk');
            }));
            test('fails with an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);
                yield api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: [] })
                    .expect(400);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i) => i.name);
                expect(items).toEqual(['milk']);
            }));
            test('fails with an array containing an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);
                const newItems = [
                    new item_1.default({ name: "beef", list: id }),
                    new item_1.default({ name: "", list: id })
                ];
                let err;
                let addedItems;
                try {
                    addedItems = yield item_1.default.insertMany(newItems);
                }
                catch (error) {
                    err = error;
                }
                expect(err).toBeInstanceOf(mongoose_1.default.Error.ValidationError);
                expect(err.errors.name).toBeDefined();
                yield api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: addedItems });
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i) => i.name);
                expect(items).toEqual(['milk']);
            }));
        });
        describe('setting an active list', () => {
            test('succeeds with proper authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .patch(`/api/users/${rootUser.id}/set-active-list`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ listId: id })
                    .expect(200);
                const response = yield api
                    .get(`/api/users/${rootUser.id}`)
                    .expect(200);
                expect(response.body.activeList.id).toBe(id);
            }));
            test('fails without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .patch(`/api/users/${rootUser.id}/set-active-list`)
                    .send({ listId: id })
                    .expect(400);
                const response = yield api
                    .get(`/api/users/${rootUser.id}`)
                    .expect(200);
                expect(response.body.activeList).toBe(undefined);
            }));
        });
        describe('when another user is added', () => {
            let guestUser;
            let guestToken;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                const passwordHash = yield bcrypt_1.default.hash('passu123', 10);
                guestUser = new user_1.default({ name: 'guest', passwordHash });
                yield guestUser.save();
                const response = yield api.post('/api/login')
                    .send({
                    name: 'guest',
                    password: 'passu123'
                })
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
                guestToken = response.body.token;
            }));
            test('invitation to list succeeds with valid user name', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/invite-guest`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ guestName: 'guest' })
                    .expect(200);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const invitedGuests = response.body.invitedGuests.map((g) => g.id);
                expect(invitedGuests).toContain(guestUser.id);
            }));
            test('invitation to list fails with invalid user name', () => __awaiter(void 0, void 0, void 0, function* () {
                const lists = yield test_helper_1.default.listsInDb();
                const id = lists[0].id;
                yield api
                    .post(`/api/lists/${id}/invite-guest`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ guestName: 'invalidUser' })
                    .expect(400);
                const response = yield api
                    .get(`/api/lists/${id}`)
                    .set('Authorization', `Bearer ${token}`);
                const invitedGuests = response.body.invitedGuests;
                expect(invitedGuests.length).toBe(0);
            }));
            describe('when an invitation to list is sent', () => {
                let id;
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    const lists = yield test_helper_1.default.listsInDb();
                    id = lists[0].id;
                    yield api
                        .post(`/api/lists/${id}/invite-guest`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ guestName: 'guest' })
                        .expect(200);
                }));
                test('invitation can be cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api
                        .post(`/api/lists/${id}/uninvite-guest`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ guestId: guestUser.id })
                        .expect(200);
                    const response = yield api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                    const invitedGuests = response.body.invitedGuests.map((g) => g.id);
                    expect(invitedGuests).not.toContain(guestUser.id);
                }));
                test('invitation can be accepted', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api
                        .post(`/api/lists/${id}/accept-invite`)
                        .set('Authorization', `Bearer ${guestToken}`)
                        .expect(200);
                    const response = yield api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                    const invitedGuests = response.body.invitedGuests;
                    expect(invitedGuests).not.toContain(guestUser.id);
                    const guests = response.body.guests.map((g) => g.id);
                    expect(guests).toContain(guestUser.id);
                }));
                test('invitation can be declined', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api
                        .post(`/api/lists/${id}/decline-invite`)
                        .set('Authorization', `Bearer ${guestToken}`)
                        .expect(200);
                    const response = yield api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                    const invitedGuests = response.body.invitedGuests;
                    expect(invitedGuests).not.toContain(guestUser.id);
                    const guests = response.body.guests;
                    expect(guests).not.toContain(guestUser.id);
                }));
                describe('when an invitation is accepted', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield api
                            .post(`/api/lists/${id}/accept-invite`)
                            .set('Authorization', `Bearer ${guestToken}`)
                            .expect(200);
                    }));
                    test('guest can be removed', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield api
                            .post(`/api/lists/${id}/remove-guest`)
                            .set('Authorization', `Bearer ${token}`)
                            .send({ guestId: guestUser.id })
                            .expect(200);
                        const response = yield api
                            .get(`/api/lists/${id}`)
                            .set('Authorization', `Bearer ${token}`);
                        const guests = response.body.guests;
                        expect(guests).not.toContain(guestUser.id);
                    }));
                });
            });
        });
        afterAll(() => {
            mongoose_1.default.connection.close();
        });
    });
});
