export default {
  routes: [
    {
      method: 'POST',
      path: '/user-progress/sync',
      handler: 'user-progress.sync',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};