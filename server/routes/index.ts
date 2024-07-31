import { IRouter } from '../../../../src/core/server';
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
      path: '/api/top_queries',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.core.opensearch.legacy.client.callAsCurrentUser;
        console.log("Client:", client); // Check the client object
        console.log("Available methods:", Object.keys(client)); // List available methods
        const res = await client('queryInsights.getTopNQueries', request);
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to get top queries: ", error);
        return response.ok({
          body: {
            ok: false,
            response: error.message,
          }
        });
      }
    }
  );
}
