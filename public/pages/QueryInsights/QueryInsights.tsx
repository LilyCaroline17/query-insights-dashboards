import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EuiBasicTableColumn, EuiSuperDatePicker, EuiInMemoryTable, EuiLink } from '@elastic/eui';

const QueryInsights = ({ queries, loading, onQueriesChange, defaultStart } : { queries: any[], loading: boolean, onQueriesChange: any, defaultStart: string }) => {

  const history = useHistory();

  const convertTime = (unixTime: number) => {
    const date = new Date(unixTime);
    const loc = date.toDateString().split(' ');
    return loc[1] + ' ' + loc[2] + ', ' + loc[3] + ' @ ' + date.toLocaleTimeString('en-US');
  };

  const cols: Array<EuiBasicTableColumn<any>> = [
    {
      name: 'Time stamp',
      render: (query: any) => {
        return (
          <span>
          <EuiLink onClick={() => {history.push(`/query-details/${query.node_id}`); console.log(history.location)}}>
            {convertTime(query.timestamp)}
          </EuiLink>
        </span>
        );
      },
      sortable: (query) => query.timestamp,
      truncateText: true,
    },
    {
      field: 'latency',
      name: 'Latency',
      render: (latency: number) => `${latency} ms`,
      sortable: true,
      truncateText: true,
    },
    {
      field: 'cpu',
      name: 'CPU usage',
      render: (cpu: number) => `${cpu} ns`,
      sortable: true,
      truncateText: true,
    },
    {
      field: 'memory',
      name: 'Memory',
      render: (memory: number) => `${memory} B`,
      sortable: true,
      truncateText: true,
    },
    {
      field: 'indices',
      name: 'Indices',
      render: (indices: string[]) => indices.toString(),
      sortable: true,
      truncateText: true,
    },
    {
      field: 'search_type',
      name: 'Search type',
      render: (searchType: string) => searchType.replaceAll('_', ' '),
      sortable: true,
      truncateText: true,
    },
    {
      field: 'node_id',
      name: 'Coordinator node ID',
      sortable: true,
      truncateText: true,
    },
    {
      field: 'total_shards',
      name: 'Total shards',
      sortable: true,
      truncateText: true,
    },
  ];

  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([
    { start: defaultStart, end: 'now' },
  ]);
  const [currStart, setStart] = useState(defaultStart);
  const [currEnd, setEnd] = useState('now');

  const onTimeChange = ({ start, end }: { start: string; end: string }) => {
    const usedRange = recentlyUsedRanges.filter(
      (range) => !(range.start === start && range.end === end)
    );
    usedRange.unshift({ start, end });
    setStart(start);
    setEnd(end);
    setRecentlyUsedRanges(usedRange.length > 10 ? usedRange.slice(0, 9) : usedRange);
    onQueriesChange({ start, end });
  };

  const onRefresh = async ({ start, end }: { start: string; end: string }) => {
    onQueriesChange({ start, end });
  };

  return (
    <EuiInMemoryTable
      items={queries}
      columns={cols}
      sorting={{
        sort: {
          field: 'Time stamp',
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
            recentlyUsedRanges={recentlyUsedRanges}
            onTimeChange={onTimeChange}
            onRefresh={onRefresh}
            updateButtonProps={{ fill: false }}
          />,
        ],
      }}
      executeQueryOptions={{
        defaultFields: [
          'timestamp',
          'latency',
          'cpu',
          'memory',
          'indices',
          'search_type',
          'node_id',
          'total_shards',
        ],
      }}
      allowNeutralSort={false}
    />
  );
};

// eslint-disable-next-line import/no-default-export
export default QueryInsights;
