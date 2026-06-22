import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * 获取建筑样式列表
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function fetchBuildings() {
  return api.get('/buildings');
}

/**
 * 获取单条建筑详情
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function fetchBuilding(id) {
  return api.get(`/buildings/${id}`);
}

/**
 * 新增建筑记录
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function createBuilding(data) {
  return api.post('/buildings', data);
}

/**
 * 更新建筑记录
 * @param {number|string} id
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function updateBuilding(id, data) {
  return api.put(`/buildings/${id}`, data);
}

/**
 * 删除建筑记录
 * @param {number|string} id
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export function deleteBuilding(id) {
  return api.delete(`/buildings/${id}`);
}

export default api;
