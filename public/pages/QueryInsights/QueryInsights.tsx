import React, { useEffect } from 'react';
import { EuiBasicTableColumn, EuiSuperDatePicker, EuiInMemoryTable, EuiLink } from '@elastic/eui';
import { useHistory, useLocation } from 'react-router-dom';
import { CoreStart } from '../../../../../src/core/public';
import { QUERY_INSIGHTS } from '../TopNQueries/TopNQueries';

const TIMESTAMP_FIELD = 'timestamp';
const LATENCY_FIELD = 'latency';
const CPU_FIELD = 'cpu';
const MEMORY_FIELD = 'memory';
const INDICES_FIELD = 'indices';
const SEARCH_TYPE_FIELD = 'search_type';
const NODE_ID_FIELD = 'node_id';
const TOTAL_SHARDS_FIELD = 'total_shards';
const METRIC_DEFAULT_MSG = 'Not enabled';

const QueryInsights = ({
  queries,
  loading,
  onTimeChange,
  recentlyUsedRanges,
  currStart,
  currEnd,
  core,
}: {
  queries: any[];
  loading: boolean;
  onTimeChange: any;
  recentlyUsedRanges: any[];
  currStart: string;
  currEnd: string;
  core: CoreStart;
}) => {
  const history = useHistory();
  const location = useLocation();
  const hash = require('object-hash');

  useEffect(() => {
    core.chrome.setBreadcrumbs([
      {
        text: 'Query insights',
        href: QUERY_INSIGHTS,
        onClick: (e) => {
          e.preventDefault();
          history.push(QUERY_INSIGHTS);
        },
      },
    ]);
  }, [core.chrome, history, location]);

  const convertTime = (unixTime: number) => {
    const date = new Date(unixTime);
    const loc = date.toDateString().split(' ');
    return `${loc[1]} ${loc[2]}, ${loc[3]} @ ${date.toLocaleTimeString('en-US')}`;
  };

  const cols: Array<EuiBasicTableColumn<any>> = [
    {
      name: 'Time stamp',
      render: (query: any) => {
        return (
          <span>
            <EuiLink onClick={() => history.push(`/query-details/${hash(query)}`)}>
              {convertTime(query.timestamp)}
            </EuiLink>
          </span>
        );
      },
      sortable: (query) => query.timestamp,
      truncateText: true,
    },
    {
      field: LATENCY_FIELD,
      name: 'Latency',
      render: (latency: number) =>
        typeof latency !== 'undefined' ? `${latency} ms` : `${METRIC_DEFAULT_MSG}`,
      sortable: true,
      truncateText: true,
    },
    {
      field: CPU_FIELD,
      name: 'CPU usage',
      render: (cpu: number) => (typeof cpu !== 'undefined' ? `${cpu} ns` : `${METRIC_DEFAULT_MSG}`),
      sortable: true,
      truncateText: true,
    },
    {
      field: MEMORY_FIELD,
      name: 'Memory',
      render: (memory: number) =>
        typeof memory !== 'undefined' ? `${memory} B` : `${METRIC_DEFAULT_MSG}`,
      sortable: true,
      truncateText: true,
    },
    {
      field: INDICES_FIELD,
      name: 'Indices',
      render: (indices: string[]) => indices.toString(),
      sortable: true,
      truncateText: true,
    },
    {
      field: SEARCH_TYPE_FIELD,
      name: 'Search type',
      render: (searchType: string) => searchType.replaceAll('_', ' '),
      sortable: true,
      truncateText: true,
    },
    {
      field: NODE_ID_FIELD,
      name: 'Coordinator node ID',
      sortable: true,
      truncateText: true,
    },
    {
      field: TOTAL_SHARDS_FIELD,
      name: 'Total shards',
      sortable: true,
      truncateText: true,
    },
  ];

  const onRefresh = async ({ start, end }: { start: string; end: string }) => {
    onTimeChange({ start, end });
  };

  return (
    <EuiInMemoryTable
      items={queries}
      columns={cols}
      sorting={{
        sort: {
          field: TIMESTAMP_FIELD,
          direction: 'desc',
        },
      }}
      loading={loading}
      search={{
        box: {
          placeholder: 'Search queries',
          schema: false,
        },
        toolsRight: [
          <EuiSuperDatePicker
            start={currStart}
            end={currEnd}
            onTimeChange={onTimeChange}
            recentlyUsedRanges={recentlyUsedRanges}
            onRefresh={onRefresh}
            updateButtonProps={{ fill: false }}
          />,
        ],
      }}
      executeQueryOptions={{
        defaultFields: [
          TIMESTAMP_FIELD,
          LATENCY_FIELD,
          CPU_FIELD,
          MEMORY_FIELD,
          INDICES_FIELD,
          SEARCH_TYPE_FIELD,
          NODE_ID_FIELD,
          TOTAL_SHARDS_FIELD,
        ],
      }}
      allowNeutralSort={false}
    />
  );
};

// eslint-disable-next-line import/no-default-export
export default QueryInsights;
