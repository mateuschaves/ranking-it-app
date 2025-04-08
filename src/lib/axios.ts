import axios from 'axios'
import constants from "~/config/consts";
import { asyncStorage, StorageKeys } from '~/shared/storage_service';

export const api = axios.create({
  baseURL: constants.rankingItUrl,
})

api.interceptors.request.use(async (request) => {
  const headers = request.headers ?? {}
  const token = await asyncStorage.getItem(StorageKeys.ACCESS_TOKEN)

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  request.headers = headers
  return request
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error from interceptor')
    console.log(error.response?.data)
    return Promise.reject(error)
  },
)