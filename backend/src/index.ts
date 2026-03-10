import { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const graphqlPlugin = strapi.plugin('graphql');
    
    if (!graphqlPlugin) {
      strapi.log.warn('GraphQL plugin not found');
      return;
    }

    const extensionService = graphqlPlugin.service('extension');

    extensionService.use(({ nexus }) => ({
      types: [
        nexus.objectType({
          name: 'SmsAuthResponse',
          definition(t) {
            t.string('jwt');
            t.field('user', { type: 'UsersPermissionsUser' });
          },
        }),

        nexus.mutationField('sendOtp', {
          type: 'Boolean',
          args: { phoneNumber: nexus.nonNull(nexus.stringArg()) },
          async resolve(_parent, args) {
            const client = require('twilio')(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            );
            await client.verify.v2
              .services(process.env.TWILIO_VERIFY_SERVICE_SID)
              .verifications.create({ to: args.phoneNumber, channel: 'sms' });
            return true;
          },
        }),

        nexus.mutationField('loginWithOtp', {
          type: 'SmsAuthResponse',
          args: {
            phoneNumber: nexus.nonNull(nexus.stringArg()),
            code: nexus.nonNull(nexus.stringArg()),
          },
          async resolve(_parent, args) {
            const client = require('twilio')(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            );

            const check = await client.verify.v2
              .services(process.env.TWILIO_VERIFY_SERVICE_SID)
              .verificationChecks.create({ to: args.phoneNumber, code: args.code });

            if (check.status !== 'approved') throw new Error('Invalid code');

            let user = await strapi.db.query('plugin::users-permissions.user').findOne({
              where: { phoneNumber: args.phoneNumber },
            });

            if (!user) {
              user = await strapi.service('plugin::users-permissions.user').add({
                username: args.phoneNumber,
                email: `${args.phoneNumber.replace('+', '')}@noemail.com`,
                phoneNumber: args.phoneNumber,
                confirmed: true,
                role: 1,
              });
            }

            const jwt = strapi.service('plugin::users-permissions.jwt').issue({ id: user.id });
            return { jwt, user };
          },
        }),
      ],
      // ⚡️ THIS IS THE MAGIC FIX FOR STRAPI 5 ⚡️
      // It explicitly tells Strapi to make these routes public
      resolversConfig: {
        'Mutation.sendOtp': {
          auth: false,
        },
        'Mutation.loginWithOtp': {
          auth: false,
        },
      },
    }));

    strapi.log.info('🚀 SMS Auth Mutations Registered & Publicly Accessible');
  },

  bootstrap() {},
};