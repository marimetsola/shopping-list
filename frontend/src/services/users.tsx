import axios from 'axios';
import { apiBaseUrl } from '../constants';
import listService from './lists';

const login = async (name: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/login`, { name, password });
    return response.data;
};

const register = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/users`, { name, email, password });
    return response.data;
};

const getUser = async (id: string) => {
    const response = await axios.get(`${apiBaseUrl}/users/${id}`, listService.config());
    return response.data;
};

const getUserByEmail = async (email: string) => {
    const response = await axios.get(`${apiBaseUrl}/users/find-email/${email}`, listService.config());
    return response.data;
};

const setActiveList = async (userId: string, listId: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/set-active-list`, { listId }, listService.config());
    return response.data;
};

const clearActiveList = async (userId: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/clear-active-list`, {}, listService.config());
    return response.data;
};

const changeName = async (userId: string, name: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/change-name`, { name }, listService.config());
    return response.data;
};

const changeEmail = async (userId: string, email: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/change-email`, { email }, listService.config());
    return response.data;
};

const resetPassword = async (email: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/reset-password`, { email }, listService.config());
    return response.data;
};

export default { login, register, getUser, getUserByEmail, setActiveList, clearActiveList, changeName, changeEmail, resetPassword };