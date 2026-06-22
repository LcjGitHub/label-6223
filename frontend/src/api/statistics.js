import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * 获取建筑统计概览数据
 * @returns {Promise<import('axios').AxiosResponse<{
 *   summary: { total: number, in_use: number, retired: number },
 *   byCity: Array<{ city: string, total: number, in_use: number, retired: number }>
 * }>>}
 */
export function fetchStatistics() {
  return api.get('/statistics');
}

export default api;
