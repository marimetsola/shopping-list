import express from 'express';
import listService from '../services/listService';
require('express-async-errors');

const router = express.Router();


// Get all lists by the user
router.get('/', async (_req, res) => {
    // const lists = await listService.getAll().populate('user');
    const lists = await listService.getAll();
    res.send(lists);
});

// Get list with id
router.get('/:id', async (req, res) => {
    try {
        const list = await listService.findById(req);
        res.json(list.toJSON());
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
    const addedItem = await listService.addItem(req.params.id, req.body.name);
    res.send(addedItem);
});

// Delete item from list
router.delete('/:id/delete-item', async (req, res) => {
    await listService.deleteItem(req.params.id, req.body.itemID);
    res.status(204).end();
});

// Edit item on a list
router.patch('/:id/edit-item', async (req, res) => {
    const updatedList = await listService.editItem(req.body.item);
    res.send(updatedList);
});

// Update list
router.put('/:id/update', async (req, res) => {
    const updatedList = await listService.updateList(req.params.id, req.body.items);
    res.send(updatedList);
});

export default router;