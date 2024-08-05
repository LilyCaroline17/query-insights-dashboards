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
      path: '/api/top_queries/latency',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getTopNQueriesLatency');
        console.log(res);
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to get top queries (latency): ", error);
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
      path: '/api/top_queries/cpu',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getTopNQueriesCpu');
        console.log(res);
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to get top queries (cpu): ", error);
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
      path: '/api/top_queries/memory',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const res = await client('queryInsights.getTopNQueriesMemory');
        console.log(res);
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to get top queries (memory): ", error);
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
      path: '/api/update_settings',
      validate: false,
    },
    async (context, request, response) => {
      try {
        // console.log("context is: ", context);
        // console.log("response is: ", response);
        const query = request.query;
        console.log("----------------request is: ", query);
        const client = context.queryInsights_plugin.queryInsightsClient.asScoped(request).callAsCurrentUser;
        const params = {
          "body": {
            "persistent": {
              [`search.insights.top_queries.${query.metric}.enabled`]: query.enabled,
              [`search.insights.top_queries.${query.metric}.top_n_size`]: query.top_n_size,
              [`search.insights.top_queries.${query.metric}.window_size`] : query.window_size,
            }
          }
        };
        console.log(params);
        const res = await client('queryInsights.setSettings', params);
        return response.custom({
          statusCode: 200,
          body: {
            ok: true,
            response: res,
          },
        });
      } catch (error) {
        console.error("Unable to set settings: ", error);
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
