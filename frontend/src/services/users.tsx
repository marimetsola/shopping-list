import axios from 'axios';
import { apiBaseUrl } from '../constants';
import listService from './lists';

const login = async (name: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/login`, { name, password });
    return response.data;
};

const register = async (name: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/users`, { name, password });
    return response.data;
};

const getUser = async (id: string) => {
    const response = await axios.get(`${apiBaseUrl}/users/${id}`, listService.config());
    return response.data;
};

const setActiveList = async (userId: string, listId: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/set-active-list`, { listId }, listService.config());
    return response.data;
};

export default { login, register, getUser, setActiveList };