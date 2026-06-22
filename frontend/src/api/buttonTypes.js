import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * 获取按钮类型列表
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function fetchButtonTypes() {
  return api.get('/button-types');
}

/**
 * 获取单条按钮类型详情
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function fetchButtonType(id) {
  return api.get(`/button-types/${id}`);
}

/**
 * 新增按钮类型
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function createButtonType(data) {
  return api.post('/button-types', data);
}

/**
 * 更新按钮类型
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateButtonType(id, data) {
  return api.put(`/button-types/${id}`, data);
}

/**
 * 删除按钮类型
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function deleteButtonType(id) {
  return api.delete(`/button-types/${id}`);
}

export default api;
