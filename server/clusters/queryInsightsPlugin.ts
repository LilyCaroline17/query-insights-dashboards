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
      },
      method: 'GET',
    });

    queryInsights.setSettings = ca({
      url: {
        fmt: `_cluster/settings`,
      },
      method: 'PUT',
      needBody: true,
    });

    queryInsights.getSettings = ca({
      url: {
        fmt: `_cluster/settings?include_defaults=true`,
      },
      method: 'GET',
    });
  };