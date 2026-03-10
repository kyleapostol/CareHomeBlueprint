export default {
  routes: [
    {
      method: 'GET',
      path: '/user-progress',
      handler: 'user-progress.find', // This maps to your custom controller method
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-progress/sync',
      handler: 'user-progress.sync', // This maps to your custom sync method
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};