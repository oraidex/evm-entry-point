import { ORAIDEX_API_ENDPOINT } from '@/constants/http-endpoint';
import axios from 'axios';

export const oraidexApi = axios.create({
    baseURL: ORAIDEX_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json'
    }
});
