/**
 * user-progress controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-progress.user-progress', ({ strapi }) => ({
  async sync(ctx) {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized("You must be logged in to sync progress.");
      }

      const { data } = ctx.request.body;
      
      if (!data || !data.trackType) {
        return ctx.badRequest("trackType is required in the request body data.");
      }

      const existingProgress = await strapi.db.query('api::user-progress.user-progress').findOne({
        where: {
          user: user.id,
          trackType: data.trackType,
        },
      });

      if (existingProgress) {
        const updated = await strapi.entityService.update('api::user-progress.user-progress', existingProgress.id, {
          data: {
            completedIds: data.completedIds,
            lastUpdated: new Date(),
          },
        });
        return ctx.send({ data: updated });
      } else {
        const created = await strapi.entityService.create('api::user-progress.user-progress', {
          data: {
            trackType: data.trackType,
            completedIds: data.completedIds,
            user: user.id,
            lastUpdated: new Date(),
          },
        });
        return ctx.send({ data: created });
      }
      
    } catch (err) {
      console.error("Sync Error:", err);
      return ctx.internalServerError("Something went wrong during the sync process.");
    }
  }
}));