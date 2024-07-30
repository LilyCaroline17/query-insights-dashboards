import { IRouter } from '../../../../src/core/server';
import { schema } from '@osd/config-schema';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/query_insights_dashboards/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );
  router.get(
    {
      path: '/_insights/top_queries',
      validate: {
        query: schema.object({}),
      },
    },
    async (context, request, response) => {
      return response.custom({
        statusCode: 200,
        body: {
          ok: true,
          response: request.query,
        },
      });
    }
  );
}
