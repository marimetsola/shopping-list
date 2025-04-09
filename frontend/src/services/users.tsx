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

const changeName = async (userId: string, name: string, password: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/change-name`, { name, password }, listService.config());
    return response.data;
};

const changeEmail = async (userId: string, email: string, password: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/change-email`, { email, password }, listService.config());
    return response.data;
};

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const response = await axios.patch(`${apiBaseUrl}/users/${userId}/change-password`, { oldPassword, newPassword }, listService.config());
    return response.data;
};

const validateToken = async (token: string) => {
    const response = await axios.post(`${apiBaseUrl}/users/validate-token`, { token }, listService.config());
    return response;
};

const requestReset = async (email: string) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/users/send-reset-email`, { email }, listService.config());
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

const resetPassword = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/users/reset-password`, { email, password }, listService.config());
        return response;
    } catch (error) {
        return (error as any).response;
    }
};

export default { login, register, getUser, getUserByEmail, setActiveList, clearActiveList, changeName, changeEmail, changePassword, requestReset, validateToken, resetPassword };