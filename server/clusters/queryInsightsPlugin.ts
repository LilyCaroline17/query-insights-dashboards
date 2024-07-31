/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

  export const QueryInsightsPlugin = function (Client, config, components) {
    const ca = components.clientAction.factory;
    Client.prototype.queryInsights = components.clientAction.namespaceFactory();
    const queryInsights = Client.prototype.queryInsights.prototype;
    console.log("Client in plugin:", Client); // Check the client object
    console.log("Available methods in plugin:", Object.keys(Client)); // List available methods

    queryInsights.getTopNQueries = ca({
      url: {
        fmt: `/_insights/top_queries`,
      },
      method: 'GET',
    });
  };