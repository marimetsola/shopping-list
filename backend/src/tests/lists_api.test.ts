import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
const api = supertest(app);
import { ItemListType, ItemType } from '../types';
import ItemList from '../models/itemList';
import Item from '../models/item';
import helper from './test_helper';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { UserType } from '../types';

describe('when there is initially one user at db', () => {
    let rootUser: UserType;
    let token: string;
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('passu666', 10);
        rootUser = new User({ name: 'root', passwordHash });
        rootUser = await rootUser.save();

        const response = await api.post('/api/login')
            .send({
                name: 'root',
                password: 'passu666'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        token = response.body.token;
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: 'coco',
            password: 'passu123'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u: UserType) => u.name);
        expect(usernames).toContain(newUser.name);
    });

    test('login succeeds with correct credentials', async () => {
        const response = await api.post('/api/login')
            .send({
                name: 'root',
                password: 'passu666'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body.name).toBe('root');
        token = response.body.token;
        expect(token.length).toBeGreaterThanOrEqual(1);
    });

    test('creation fails with a proper statuscode and message if name already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: 'root',
            password: 'passu9000'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toBe('Username is already taken.');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    describe('when there are initially some lists saved', () => {

        let initialLists: ItemListType[];
        beforeEach(async () => {
            await ItemList.deleteMany({});
            initialLists = [
                new ItemList({ name: "Lidl", user: rootUser }),
                new ItemList({ name: "Prisma", user: rootUser })
            ];
            const addedLists = await ItemList.insertMany(initialLists);
            const rUser = await User.findById(rootUser.id);
            if (rUser) {
                rUser.set({ lists: addedLists });
                await rUser.save();
            }
        });

        test('lists are returned as json', async () => {
            await api
                .get('/api/lists')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        });

        test('all lists by user are returned', async () => {
            const response =
                await api
                    .get('/api/lists')
                    .set('Authorization', `Bearer ${token}`);

            expect(response.body).toHaveLength(initialLists.length);
        });

        test('specific lists are within the returned lists', async () => {
            const response =
                await api
                    .get('/api/lists')
                    .set('Authorization', `Bearer ${token}`);

            const names: string[] = response.body.map((r: ItemListType) => r.name);
            expect(names).toContain('Prisma');
            expect(names).toContain('Lidl');
        });

        test('list can be found by id', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const response = await api
                .get(`/api/lists/${lists[0].id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.body.name).toBe(lists[0].name);
        });

        describe('adding a list', () => {
            test('succeeds with a valid name', async () => {
                const newList = { name: 'Alepa' };

                await api
                    .post('/api/lists')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newList)
                    .expect(200)
                    .expect('Content-Type', /application\/json/);

                const listsAtEnd: ItemListType[] = await helper.listsInDb();

                expect(listsAtEnd).toHaveLength(initialLists.length + 1);
                const names = listsAtEnd.map((l: ItemListType) => l.name);
                expect(names).toContain('Alepa');
            });

            test('fails with an empty name', async () => {
                const newList = { name: '' };

                await api
                    .post('/api/lists')
                    .set('Authorization', `Bearer ${token}`)
                    .send(newList)
                    .expect(400);

                const listsAtEnd: ItemListType[] = await helper.listsInDb();
                expect(listsAtEnd).toHaveLength(initialLists.length);
            });
        });

        describe('deleting a list', () => {
            test('succeeds', async () => {
                await api
                    .delete(`/api/lists/${initialLists[0].id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204);

                const listsAtEnd: ItemListType[] = await helper.listsInDb();
                expect(listsAtEnd).toHaveLength(initialLists.length - 1);

                const listNames = listsAtEnd.map((l: ItemListType) => l.name);
                expect(listNames).not.toContainEqual(initialLists[0].name);
                expect(listNames).toContainEqual(initialLists[1].name);
            });
        });

        describe('adding an item', () => {
            test('succeeds with a valid name', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i: ItemType) => i.name);
                expect(items).toContain('milk');
            });

            test('fails with an empty name', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: '' })
                    .expect(400);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                expect(response.body.items.length).toBe(0);
            });
        });

        describe('deleting an item', () => {
            test('succeeds', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                const itemID = (await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200))
                    .body.id;

                await api
                    .delete(`/api/lists/${id}/delete-item/${itemID}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i: ItemType) => i.name);
                expect(items).not.toContain('milk');
            });
        });

        describe('editing an item', () => {
            test('succeeds', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                const item = (await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200))
                    .body;

                const editedItem = { ...item, name: "chicken" };

                await api
                    .patch(`/api/lists/${id}/edit-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ item: editedItem });

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const items = response.body.items.map((i: ItemType) => i.name);
                expect(items).not.toContain('milk');
                expect(items).toContain('chicken');
            });
        });

        describe('updating a list', () => {
            test('succeeds with valid array', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);

                const newItems = [
                    new Item({ name: "beef", list: id }),
                    new Item({ name: "candy", list: id })
                ];
                const addedItems = await Item.insertMany(newItems);

                await api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: addedItems })
                    .expect(200);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const itemNames: string[] = response.body.items.map((i: ItemType) => i.name);
                const addedItemNames: string[] = addedItems.map((i: ItemType) => i.name);

                expect(itemNames).toEqual(addedItemNames);
                expect(itemNames).not.toContain('milk');
            });

            test('fails with an empty array', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);

                await api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: [] })
                    .expect(400);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const items: string[] = response.body.items.map((i: ItemType) => i.name);
                expect(items).toEqual(['milk']);
            });

            test('fails with an array containing an empty string', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/add-item`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ name: 'milk' })
                    .expect(200);

                const newItems = [
                    new Item({ name: "beef", list: id }),
                    new Item({ name: "", list: id })
                ];

                let err;
                let addedItems;
                try {
                    addedItems = await Item.insertMany(newItems);
                } catch (error) {
                    err = error;
                }
                expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(err.errors.name).toBeDefined();

                await api
                    .put(`/api/lists/${id}/update`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ items: addedItems });

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const items: string[] = response.body.items.map((i: ItemType) => i.name);
                expect(items).toEqual(['milk']);
            });
        });

        describe('setting an active list', () => {
            test('succeeds with proper authorization', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .patch(`/api/users/${rootUser.id}/set-active-list`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ listId: id })
                    .expect(200);

                const response = await api
                    .get(`/api/users/${rootUser.id}`)
                    .expect(200);
                expect(response.body.activeList.id).toBe(id);

            });

            test('fails without authorization', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .patch(`/api/users/${rootUser.id}/set-active-list`)
                    .send({ listId: id })
                    .expect(400);

                const response = await api
                    .get(`/api/users/${rootUser.id}`)
                    .expect(200);
                expect(response.body.activeList).toBe(undefined);
            });
        });

        describe('when another user is added', () => {
            let guestUser: UserType;
            let guestToken: string;
            beforeEach(async () => {
                const passwordHash = await bcrypt.hash('passu123', 10);
                guestUser = new User({ name: 'guest', passwordHash });
                await guestUser.save();

                const response = await api.post('/api/login')
                    .send({
                        name: 'guest',
                        password: 'passu123'
                    })
                    .expect(200)
                    .expect('Content-Type', /application\/json/);
                guestToken = response.body.token;
            });

            test('invitation to list succeeds with valid user name', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/invite-guest`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ guestName: 'guest' })
                    .expect(200);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const invitedGuests: string[] = response.body.invitedGuests.map((g: UserType) => g.id);
                expect(invitedGuests).toContain(guestUser.id);
            });

            test('invitation to list fails with invalid user name', async () => {
                const lists: ItemListType[] = await helper.listsInDb();
                const id = lists[0].id;

                await api
                    .post(`/api/lists/${id}/invite-guest`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ guestName: 'invalidUser' })
                    .expect(400);

                const response =
                    await api
                        .get(`/api/lists/${id}`)
                        .set('Authorization', `Bearer ${token}`);
                const invitedGuests: string[] = response.body.invitedGuests;
                expect(invitedGuests.length).toBe(0);
            });

            describe('when an invitation to list is sent', () => {
                let id: string;
                beforeEach(async () => {
                    const lists: ItemListType[] = await helper.listsInDb();
                    id = lists[0].id;
                    await api
                        .post(`/api/lists/${id}/invite-guest`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ guestName: 'guest' })
                        .expect(200);
                });

                test('invitation can be cancelled', async () => {
                    await api
                        .post(`/api/lists/${id}/uninvite-guest`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ guestId: guestUser.id })
                        .expect(200);

                    const response =
                        await api
                            .get(`/api/lists/${id}`)
                            .set('Authorization', `Bearer ${token}`);
                    const invitedGuests: string[] = response.body.invitedGuests.map((g: UserType) => g.id);
                    expect(invitedGuests).not.toContain(guestUser.id);
                });

                test('invitation can be accepted', async () => {
                    await api
                        .post(`/api/lists/${id}/accept-invite`)
                        .set('Authorization', `Bearer ${guestToken}`)
                        .expect(200);

                    const response =
                        await api
                            .get(`/api/lists/${id}`)
                            .set('Authorization', `Bearer ${token}`);
                    const invitedGuests: string[] = response.body.invitedGuests;
                    expect(invitedGuests).not.toContain(guestUser.id);

                    const guests: string[] = response.body.guests.map((g: UserType) => g.id);
                    expect(guests).toContain(guestUser.id);
                });

                test('invitation can be declined', async () => {
                    await api
                        .post(`/api/lists/${id}/decline-invite`)
                        .set('Authorization', `Bearer ${guestToken}`)
                        .expect(200);

                    const response =
                        await api
                            .get(`/api/lists/${id}`)
                            .set('Authorization', `Bearer ${token}`);
                    const invitedGuests: string[] = response.body.invitedGuests;
                    expect(invitedGuests).not.toContain(guestUser.id);

                    const guests: string[] = response.body.guests;
                    expect(guests).not.toContain(guestUser.id);
                });

                describe('when an invitation is accepted', () => {
                    beforeEach(async () => {
                        await api
                            .post(`/api/lists/${id}/accept-invite`)
                            .set('Authorization', `Bearer ${guestToken}`)
                            .expect(200);
                    });

                    test('guest can be removed', async () => {
                        await api
                            .post(`/api/lists/${id}/remove-guest`)
                            .set('Authorization', `Bearer ${token}`)
                            .send({ guestId: guestUser.id })
                            .expect(200);

                        const response =
                            await api
                                .get(`/api/lists/${id}`)
                                .set('Authorization', `Bearer ${token}`);

                        const guests: string[] = response.body.guests;
                        expect(guests).not.toContain(guestUser.id);
                    });
                });
            });

            describe('changing name', () => {
                test('succeeds with an available name and is lowercased', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-name`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ name: "renamedRoot", password: "passu666" })
                        .expect(200)
                        .expect('Content-Type', /application\/json/);

                    const response = await api
                        .get(`/api/users/${rootUser.id}`);

                    expect(response.body.name).toBe('renamedroot');
                });

                test('fails with invalid password', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-name`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ name: "renamedRoot", password: "wrongpw" })
                        .expect(401)
                        .expect('Content-Type', /application\/json/);

                    const response = await api
                        .get(`/api/users/${rootUser.id}`);

                    expect(response.body.name).toBe('root');
                });

                test('fails with a taken name', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-name`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ name: "guest", password: "passu666" })
                        .expect(400)
                        .expect('Content-Type', /application\/json/);

                    const response = await api
                        .get(`/api/users/${rootUser.id}`);

                    expect(response.body.name).toBe('root');
                });
            });

            describe('changing email', () => {
                test('succeeds with a proper email address', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-email`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ email: "testi@email.com", password: "passu666" })
                        .expect(200)
                        .expect('Content-Type', /application\/json/);

                    const response = await api
                        .get(`/api/users/${rootUser.id}`);

                    expect(response.body.email).toBe('testi@email.com');
                });

                test('fails with an invalid email address', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-email`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ email: "notanemail", password: "passu666" })
                        .expect(400)
                        .expect('Content-Type', /application\/json/);

                    const response = await api
                        .get(`/api/users/${rootUser.id}`);

                    expect(response.body.email).not.toBe('notanemail');
                });
            });

            describe('changing password', () => {
                test('succeeds with valid old password', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-password`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ oldPassword: "passu666", newPassword: "uuspassu" })
                        .expect(200)
                        .expect('Content-Type', /application\/json/);

                    const response = await api.post('/api/login')
                        .send({
                            name: 'root',
                            password: 'uuspassu'
                        })
                        .expect(200)
                        .expect('Content-Type', /application\/json/);
                    expect(response.body.name).toBe('root');
                });

                test('fails with invalid old password', async () => {
                    await api
                        .patch(`/api/users/${rootUser.id}/change-password`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ oldPassword: "wrongpw", newPassword: "uuspassu" })
                        .expect(401)
                        .expect('Content-Type', /application\/json/);

                    await api.post('/api/login')
                        .send({
                            name: 'root',
                            password: 'uuspassu'
                        })
                        .expect(401)
                        .expect('Content-Type', /application\/json/);
                });
            });
        });

        afterAll(() => {
            mongoose.connection.close();
        });
    });
});