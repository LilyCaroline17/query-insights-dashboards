/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

  export const QueryInsightsPlugin = function (Client, config, components) {
    const ca = components.clientAction.factory;
    Client.prototype.queryInsights = components.clientAction.namespaceFactory();
    const queryInsights = Client.prototype.queryInsights.prototype;

    queryInsights.getTopNQueries = ca({
      url: {
        fmt: `/_insights/top_queries`,
        req: {
          dataconnection: {
            type: 'string',
            required: true,
          },
        },
      },
      method: 'GET',
    });
  };