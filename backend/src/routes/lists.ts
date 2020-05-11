import express from 'express';
import listService from '../services/listService';
require('express-async-errors');

const router = express.Router();

// Get all lists
router.get('/', async (_req, res) => {
    res.send(await listService.getAll());
});

// Get list with id
router.get('/:id', async (req, res) => {

    const list = await listService.findById(req.params.id);
    if (list) {
        res.json(list.toJSON());
    } else {
        res.status(404).end();
    }
});

// Add list with name
router.post('/', async (req, res) => {
    const newList = await listService.addList(req.body.name);
    res.send(newList);
});

// Delete list by id
router.delete('/:id', async (req, res) => {
    await listService.deleteList(req.params.id);
    res.status(204).end();
});

// Add item to list
router.post('/:id/add-item', async (req, res) => {
    const addedItem = await listService.addItem(req.params.id, req.body.name);
    res.send(addedItem);
});

// Delete item from list
router.delete('/:id/delete-item', async (req, res) => {
    const deletedItem = await listService.deleteItem(req.params.id, req.body.name);
    res.send(deletedItem);
});

// Update list
router.put('/:id/update', async (req, res) => {
    const updatedList = await listService.updateList(req.params.id, req.body.items);
    res.send(updatedList);
});

export default router;