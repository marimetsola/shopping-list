import express from 'express';
import listService from '../services/listService';
require('express-async-errors');

const router = express.Router();


// Get all lists by user
router.get('/', async (req, res) => {
    // const lists = await listService.getAll().populate('user');
    const lists = await listService.getListsByUser(req);
    res.send(lists);
});

// Get list with id
router.get('/:id', async (req, res) => {
    try {
        const list = await listService.findById(req);
        if (list) {
            res.json(list.toJSON());
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Add list with name
router.post('/', async (req, res) => {
    const newList = await listService.addList(req);
    res.send(newList);
});

// Delete list by id
router.delete('/:id', async (req, res) => {
    await listService.deleteList(req);
    res.status(204).end();
});

// Add item to list
router.post('/:id/add-item', async (req, res) => {
    const addedItem = await listService.addItem(req);
    res.send(addedItem);
});

// Delete item from list
router.delete('/:id/delete-item/:itemId', async (req, res) => {
    await listService.deleteItem(req);
    res.status(204).end();
});

// Edit item on a list
router.patch('/:id/edit-item', async (req, res) => {
    const updatedList = await listService.editItem(req);
    res.send(updatedList);
});

// Update list
router.put('/:id/update', async (req, res) => {
    const updatedList = await listService.updateList(req);
    res.send(updatedList);
});

export default router;