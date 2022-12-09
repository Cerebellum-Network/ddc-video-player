/* eslint-disable no-param-reassign, no-underscore-dangle */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {UPLOAD_BASE_URL} from '../../constants/env'
import {UploadAuthToken} from './types'
import {EncryptionKeyProvider} from '../encryption/EncryptionKeyProvider'
import {connectionManager} from '../wallet'

const UPLOAD_ACCESS_TOKEN_KEY = 'UPLOAD_ACCESS_TOKEN_KEY';

const getAuthToken = async (): Promise<UploadAuthToken> => {
  const signer = await connectionManager.getSigner();
  if (!signer) {
    throw new Error('No wallet connected')
  }
  const address = await signer.getAddress();
  const encryptionPublicKey = await EncryptionKeyProvider.get(address);
  const nonce = await axios
    .get(`${UPLOAD_BASE_URL}/auth/v1/${address}/nonce`)
    .then(({ data }) => data);
  const signature = await signer.signMessage(
    `${address}${encryptionPublicKey}${nonce}`
  );
  const { data } = await axios.post<UploadAuthToken>(
    `${UPLOAD_BASE_URL}/auth/v1/${address}`,
    {
      encryptionPublicKey,
      signature,
    }
  );
  return data;
};

const requestInterceptor = async (config: AxiosRequestConfig) => {
  if (config.method?.toLowerCase() === 'put') {
    return config;
  }

  const token = window.localStorage.getItem(UPLOAD_ACCESS_TOKEN_KEY);
  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = token;
    return config;
  }

  const newToken = await getAuthToken();
  const tokenString = `${newToken.tokenType} ${newToken.accessToken}`;
  config.headers.Authorization = tokenString;
  window.localStorage.setItem(UPLOAD_ACCESS_TOKEN_KEY, tokenString);
  return config;
};

const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as any;
  if (!error.response) {
    return Promise.reject(error);
  }

  // Catching all server errors
  if (error.response.status % 500 < 100) {
    return Promise.reject(error);
  }

  if (![403, 401].includes(error.response.status) && originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;
  const token = await getAuthToken();
  const tokenString = `${token.tokenType} ${token.accessToken}`;
  originalRequest.headers = originalRequest.headers ?? {};
  window.localStorage.setItem(UPLOAD_ACCESS_TOKEN_KEY, tokenString);
  originalRequest.headers.Authorization = tokenString;
  return axios(originalRequest);
};

export const createFileUploadApi = (): AxiosInstance => {
  const api = axios.create();

  api.interceptors.request.use(requestInterceptor);
  api.interceptors.response.use(
    (response) => response,
    responseErrorInterceptor
  );

  return api;
};
