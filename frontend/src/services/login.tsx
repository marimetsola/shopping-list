import axios from 'axios';
import { apiBaseUrl } from '../constants';

const login = async (name: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/login`, { name, password });
    return response.data;
};

export default { login };