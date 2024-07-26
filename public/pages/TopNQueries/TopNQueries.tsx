import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom';
import { EuiTab, EuiTabs, EuiTitle } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import QueryInsights from '../QueryInsights/QueryInsights';
import Configuration from '../Configuration/Configuration';
import QueryDetails from "../QueryDetails/QueryDetails";
import { CoreStart } from '../../../../../src/core/public';
import dateMath from '@elastic/datemath';

const TopNQueries = ({ core }: { core: CoreStart }) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const testItems = [
    {
      "timestamp" : 1719871061174,
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 54,
          "parentTaskId" : 53,
          "nodeId" : "F9Qw4La8RiOZXji7s6WtTw",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 15461000,
            "memory_in_bytes" : 2050624
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 53,
          "parentTaskId" : -1,
          "nodeId" : "F9Qw4La8RiOZXji7s6WtTw",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 0,
            "memory_in_bytes" : 0
          }
        }
      ],
      "source" : "{\"size\":1000}",
      "labels" : {
        "X-Opaque-Id" : "cyji-id"
      },
      "search_type" : "query_then_fetch",
      "indices" : [
        "my-index-*"
      ],
      "phase_latency_map" : {
        "expand" : 0,
        "query" : 22,
        "fetch" : 1
      },
      "node_id" : "F9Qw4La8RiOZXji7s6WtTw",
      "total_shards" : 1,
      "latency" : 31,
      "memory" : 2050624,
      "cpu" : 15461000
    },
    {
      "timestamp" : 1712875061236,
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 58,
          "parentTaskId" : 57,
          "nodeId" : "P3aliJxGyghvQKjvhXf57u78",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 6625000,
            "memory_in_bytes" : 818120
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 57,
          "parentTaskId" : -1,
          "nodeId" : "P3aliJxGyghvQKjvhXf57u78",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 0,
            "memory_in_bytes" : 0
          }
        }
      ],
      "source" : "{\"size\":20,\"query\":{\"bool\":{\"must\":[{\"match_phrase\":{\"message\":{\"query\":\"document\",\"slop\":0,\"zero_terms_query\":\"NONE\",\"boost\":1.0}}},{\"match\":{\"user.id\":{\"query\":\"cyji\",\"operator\":\"OR\",\"prefix_length\":0,\"max_expansions\":50,\"fuzzy_transpositions\":true,\"lenient\":false,\"zero_terms_query\":\"NONE\",\"auto_generate_synonyms_phrase_query\":true,\"boost\":1.0}}}],\"adjust_pure_negative\":true,\"boost\":1.0}}}",
      "labels" : { },
      "search_type" : "query_then_fetch",
      "indices" : [
        "my-index-0"
      ],
      "phase_latency_map" : {
        "expand" : 0,
        "query" : 16,
        "fetch" : 0
      },
      "node_id" : "P3aliJxGyghvQKjvhXf57u78",
      "total_shards" : 2,
      "latency" : 17,
      "memory" : 818120,
      "cpu" : 6625000
    },
    {
      "timestamp" : 1709871061197,
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 56,
          "parentTaskId" : 55,
          "nodeId" : "5xUwXtVhSWUdcEcDMZExFLsu",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 2824000,
            "memory_in_bytes" : 288328
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 55,
          "parentTaskId" : -1,
          "nodeId" : "5xUwXtVhSWUdcEcDMZExFLsu",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 0,
            "memory_in_bytes" : 0
          }
        }
      ],
      "source" : "{\"size\":20,\"query\":{\"term\":{\"user.id\":{\"value\":\"cyji\",\"boost\":1.0}}}}",
      "labels" : { },
      "search_type" : "fetch",
      "indices" : [
        "my-index-0"
      ],
      "phase_latency_map" : {
        "expand" : 0,
        "query" : 4,
        "fetch" : 0
      },
      "node_id" : "5xUwXtVhSWUdcEcDMZExFLsu",
      "total_shards" : 3,
      "latency" : 4,
      "memory" : 288328,
      "cpu" : 2824000
    },
    {
      "timestamp" : 1714871061255,
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 60,
          "parentTaskId" : 59,
          "nodeId" : "kFeVUOtzZ9bTYHm2EHennkm",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 805000,
            "memory_in_bytes" : 66680
          }
        },
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 60,
          "parentTaskId" : 59,
          "nodeId" : "kFeVUOtzZ9bTYHm2EHennkm",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 805000,
            "memory_in_bytes" : 66680
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 59,
          "parentTaskId" : -1,
          "nodeId" : "kFeVUOtzZ9bTYHm2EHennkm",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 0,
            "memory_in_bytes" : 0
          }
        }
      ],
      "source" : "{\"from\":0,\"size\":10,\"query\":{\"match_all\":{\"boost\":1.0}},\"sort\":[{\"user.age\":{\"order\":\"desc\"}}]}",
      "labels" : { },
      "search_type" : "query_then_fetch",
      "indices" : [
        "my-index-0",
        "my-index-1",
      ],
      "phase_latency_map" : { },
      "node_id" : "kFeVUOtzZ9bTYHm2EHennkm",
      "total_shards" : 5,
      "latency" : 2,
      "memory" : 133360,
      "cpu" : 1610000
    },
    {
      "timestamp" : 1711059060452,
      "node_id" : "qaZrSOygTjmu2C9P8yw9AQ",
      "total_shards" : 1,
      "phase_latency_map" : {
        "expand" : 1,
        "query" : 2,
        "fetch" : 10
      },
      "search_type" : "query_then_fetch",
      "indices" : [
        "my-index-0"
      ],
      "source" : "{\"query\":{\"range\":{\"user.age\":{\"from\":50,\"to\":null,\"include_lower\":false,\"include_upper\":true,\"boost\":1.0}}}}",
      "latency" : 14,
      "cpu": 240,
      "memory": 30,
    }
  ];
  const [queries, setQueries] = useState<any[]>(testItems);

  core.chrome.setBreadcrumbs([{ text: 'Query insights', href: '/queryInsights', onClick: (e) => {e.preventDefault(); history.push('/queryInsights')}}]);

  const tabs: Array<{ id: string; name: string; route: string }> = [
    {
      id: 'topNQueries',
      name: 'Top N queries',
      route: 'queryInsights',
    },
    {
      id: 'configuration',
      name: 'Configuration',
      route: 'configuration',
    },
  ];

  const onSelectedTabChanged = (route: string) => {
    const { pathname: currPathname } = location;
    if (!currPathname.includes(route)) {
      history.push(route);
    }
  };

  const renderTab = (tab: { route: string; id: string; name: string }) => (
    <EuiTab
      onClick={() => onSelectedTabChanged(tab.route)}
      isSelected={location.pathname.includes(tab.route)}
      key={tab.id}
    >
      {tab.name}
    </EuiTab>
  );

  const parseDateString = (dateString: string) => {
    const date = dateMath.parse(dateString);
    return date ? date.toDate().getTime() : new Date().getTime();
  };

  const retrieveQueries = async (start: string, end: string) => {
    setLoading(true);
    const startTimestamp = parseDateString(start);
    const endTimestamp = parseDateString(end);
    const newQueries = queries.filter(
      (item) => item.timestamp >= startTimestamp && item.timestamp <= endTimestamp
    );
    setQueries(newQueries);
    setLoading(false);
  }

  const handleQueriesChange = useCallback(({ start, end }: { start: string; end: string}) => {
    retrieveQueries(start, end);
  }, []);

  useEffect(() => {
    retrieveQueries('now-1y', 'now');
  }, []);

  return (
    <div style={{padding: '35px 35px'}}>
      <Switch>
        <Route exact path="/query-details/:nodeId">
          <QueryDetails queries={queries} core={core}/>
        </Route>
        <Route exact path="/queryInsights">
          <EuiTitle size="l">
            <h1>
              <FormattedMessage
                id={'queryInsightsDashboards.topnqueries'}
                defaultMessage="{name}"
                values={{name: 'Query insights - Top N queries'}}
              />
            </h1>
          </EuiTitle>
          <div style={{padding: '25px 0px'}}>
            <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
          </div>
          <QueryInsights queries={queries} loading={loading} onQueriesChange={handleQueriesChange} />
        </Route>
        <Route exact path="/configuration">
          <EuiTitle size="l">
            <h1>
              <FormattedMessage
                id={'queryInsightsDashboards.configuration'}
                defaultMessage="{name}"
                values={{name: 'Query insights - Configuration'}}
              />
            </h1>
          </EuiTitle>
          <div style={{padding: '25px 0px'}}>
            <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
          </div>
          <Configuration/>
        </Route>
        <Redirect to={"/queryInsights"} />
      </Switch>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default TopNQueries;
