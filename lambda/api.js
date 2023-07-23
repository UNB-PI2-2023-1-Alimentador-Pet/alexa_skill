// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://miaufeeder.herokuapp.com',
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response) {
//       return error.response;
//     }
//     if (error.request) {
//       return error.request;
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;