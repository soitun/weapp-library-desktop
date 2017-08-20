import fetch from './fetch.js';
import axios from 'axios';

export function login(phone, password) {
    return fetch.get("/api/libraries/login", {
        params: {phone, password}
    })
}

export function register(params) {
    return fetch.post("/api/libraries", params);
}

// 获取用户信息
export function getUserInfoById(id) {
    return fetch.get('/api/libraries/' + id);
}

export function getUserInfoByIdWithoutNotify(id) {
    return axios.get('/api/libraries/' + id).then((res) => {
        if(res.data.code == 200) {
            return res.data.data;
        }
    });
}

export function updateUserInfoById(id, params) {
    return fetch.post('/api/libraries/' + id, params);
}

export function changePassword(params) {
    return fetch.post('/api/libraries/password', params);
}

export function getCollections(id, query) {
    return fetch.get('/api/libraries/' + id + '/collections', {
        params: query
    });
}

export function updateCollection(id, params) {
    return fetch.post('/api/libraries/' + id + '/collections', params);
}

export function getOrdersByLibraryId(id, query) {
    return fetch.get('/api/orders/libraries/' + id, {
        params: query
    });
}

export function updateOrderStateById(id, state) {
    return fetch.post('/api/orders/' + id, {
        state
    });
}

export function deleteOrderById(id) {
    return fetch.delete('/api/orders/' + id);
}