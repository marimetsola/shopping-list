import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app';
const api = supertest(app);
import { ItemListType } from '../types';
import ItemList from '../models/itemList';
import helper from './test_helper';

describe('when there is initially some lists saved', () => {



    beforeEach(async () => {
        await ItemList.deleteMany({});
        await ItemList.insertMany(helper.initialLists);
    });

    test('lists are returned as json', async () => {
        await api
            .get('/api/lists')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all lists are returned', async () => {
        const response = await api.get('/api/lists');

        expect(response.body).toHaveLength(helper.initialLists.length);
    });

    test('specific lists are within the returned lists', async () => {
        const response = await api.get('/api/lists');

        const names: string[] = response.body.map((r: ItemListType) => r.name);
        expect(names).toContain('Prisma');
        expect(names).toContain('Lidl');
    });

    test('list can be found by id', async () => {
        const lists: ItemListType[] = await helper.listsInDb();
        const response = await api.get(`/api/lists/${lists[0].id}`);
        expect(response.body.name).toBe(lists[0].name);
    });

    describe('adding a list', () => {
        test('succeeds with a valid name', async () => {
            const newList = { name: 'Alepa' };

            await api
                .post('/api/lists')
                .send(newList)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const listsAtEnd: ItemListType[] = await helper.listsInDb();

            expect(listsAtEnd).toHaveLength(helper.initialLists.length + 1);
            const names = listsAtEnd.map((l: ItemListType) => l.name);
            expect(names).toContain('Alepa');
        });

        test('fails with an empty name', async () => {
            const newList = { name: '' };

            await api
                .post('/api/lists')
                .send(newList)
                .expect(400);

            const listsAtEnd: ItemListType[] = await helper.listsInDb();
            expect(listsAtEnd).toHaveLength(helper.initialLists.length);
        });
    });

    describe('deleting a list', () => {
        test('succeeds', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            await api
                .delete(`/api/lists/${lists[0].id}`)
                .expect(204);

            const listsAtEnd: ItemListType[] = await helper.listsInDb();
            expect(listsAtEnd).toHaveLength(helper.initialLists.length - 1);
            expect(listsAtEnd).not.toContainEqual(lists[0]);
            expect(listsAtEnd).toContainEqual(lists[1]);
        });
    });

    describe('adding an item', () => {
        test('succeeds with a valid name', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: 'milk' })
                .expect(200);

            const response = await api.get(`/api/lists/${id}`);
            expect(response.body.items).toContain('milk');
        });

        test('fails with an empty name', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: '' })
                .expect(400);

            const response = await api.get(`/api/lists/${id}`);
            expect(response.body.items.length).toBe(0);
        });
    });

    describe('deleting an item', () => {
        test('succeeds', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: 'milk' })
                .expect(200);

            await api
                .delete(`/api/lists/${id}/delete-item`)
                .send({ name: 'milk' })
                .expect(200);

            const response = await api.get(`/api/lists/${id}`);
            expect(response.body.items).not.toContain('milk');
        });
    });

    describe('updating a list', () => {
        test('succeeds with valid array', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: 'milk' })
                .expect(200);

            const newItems = ['beef', 'candy'];

            await api
                .put(`/api/lists/${id}/update`)
                .send({ items: newItems })
                .expect(200);

            const response = await api.get(`/api/lists/${id}`);
            const items: string[] = response.body.items;
            expect(items).toEqual(newItems);
            expect(items).not.toContain('milk');
        });

        test('fails with an empty array', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: 'milk' })
                .expect(200);

            await api
                .put(`/api/lists/${id}/update`)
                .send({ items: [] })
                .expect(400);

            const response = await api.get(`/api/lists/${id}`);
            const items: string[] = response.body.items;
            expect(items).toEqual(['milk']);
        });

        test('fails with an array containing an empty string', async () => {
            const lists: ItemListType[] = await helper.listsInDb();
            const id = lists[0].id;

            await api
                .post(`/api/lists/${id}/add-item`)
                .send({ name: 'milk' })
                .expect(200);

            const newItems = ['beef', ''];

            await api
                .put(`/api/lists/${id}/update`)
                .send({ items: newItems })
                .expect(400);

            const response = await api.get(`/api/lists/${id}`);
            const items: string[] = response.body.items;
            expect(items).toEqual(['milk']);
        });
    });

    afterAll(() => {
        mongoose.connection.close();
    });

});