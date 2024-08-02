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
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getTopNQueries');
        console.log(res);
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

  router.get(
    {
      path: '/api/settings',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getSettings');
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

  router.put(
    {
      path: '/api/top_n_size',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getTopNQueries', {
          "body": {
            "persistent": {
              "search.insights.top_queries.latency.top_n_size": "request.top_n_size"
            }
          }
        });
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to set top n size: ", error);
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
