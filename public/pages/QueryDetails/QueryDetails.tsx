import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import { EuiTitle, EuiFlexItem, EuiPanel, EuiText, EuiSpacer, EuiHorizontalRule, EuiFlexGrid, EuiCodeBlock, EuiButton, EuiFlexGroup } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { useParams } from 'react-router-dom';

const QueryDetails = ({ queries }: { queries: any }) => {
  let { nodeId } = useParams<{ nodeId: string }>();
  const query = queries.find((q : any) => q.node_id == nodeId);
  useEffect(() => {
    let x : number[] = Object.values(query.phase_latency_map);
    console.log(x);
    if (x.length < 3) {
      x = [0, 0, 0]
    }
    const data = [{
      x: x.reverse(),
      y: ["Fetch    ", "Query    ", "Expand    "],
      type: "bar",
      orientation: "h",
      width: 0.5,
      marker: {color: ['#F990C0', '#1BA9F5', '#7DE2D1']},
      base: [x[2]+x[1], x[2], 0],
      text: x.map((value) => `${value}ms`),
      textposition: "outside",
      cliponaxis: false,
    }];
    const layout = {
      autosize: true,
      margin: {l: 80, r: 80, t: 20, b: 20, pad: 0},
      autorange: true,
      height: 120,
      xaxis: {side: "top", zeroline: false, ticksuffix: "ms", autorangeoptions: {clipmin: 0}, tickfont:{color: '#535966'}, linecolor: '#D4DAE5', gridcolor: "#D4DAE5"},
      yaxis: {linecolor: '#D4DAE5'}
    };
    const config = {responsive: true};
    Plotly.newPlot("latency", data, layout, config);
  }, [query]);

  const convertTime = (unixTime: number) => {
    const date = new Date(unixTime);
    const loc = date.toDateString().split(' ');
    return loc[1] + ' ' + loc[2] + ', ' + loc[3] + ' @ ' + date.toLocaleTimeString('en-US');
  };

  const queryString = JSON.stringify(JSON.parse(query.source).query, null, 2);

  const queryDisplay = `{\n  "query": ${queryString ? queryString.replace(/\n/g, '\n  '): ""}\n}`;

  return (
    <div>
      <EuiTitle size="l">
        <h1>
          <FormattedMessage
            id={'queryInsightsDashboards.querydetails'}
            defaultMessage="{name}"
            values={{name: 'Query details'}}
          />
        </h1>
      </EuiTitle>
      <EuiSpacer size="l" />
      <EuiFlexItem>
        <EuiPanel>
          <EuiText size="xs">
            <h2>Summary</h2>
          </EuiText>
          <EuiHorizontalRule margin="m" />
          <EuiFlexGrid columns={4}>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Timestamp</h4>
              </EuiText>
              <EuiText size="xs">
                {convertTime(query.timestamp)}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Latency</h4>
              </EuiText>
              <EuiText size="xs">
                {`${query.latency} ms`}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>CPU Usage</h4>
              </EuiText>
              <EuiText size="xs">
                {`${query.cpu} ns`}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Memory</h4>
              </EuiText>
              <EuiText size="xs">
                {`${query.memory} B`}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Indexes</h4>
              </EuiText>
              <EuiText size="xs">
                {query.indices.toString()}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Search type</h4>
              </EuiText>
              <EuiText size="xs">
                {query.search_type.replaceAll('_', ' ')}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Coordinator node ID</h4>
              </EuiText>
              <EuiText size="xs">
                {query.node_id}
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                <h4>Total shards</h4>
              </EuiText>
              <EuiText size="xs">
                {query.total_shards}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiPanel>
        <EuiSpacer size="m"/>
        <EuiFlexGrid columns={2}>
          <EuiFlexItem grow={1}>
            <EuiPanel>
              <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
                <EuiFlexItem>
                  <EuiText size="xs">
                    <h2>Query</h2>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButton iconSide="right" iconType="popout" target="_blank" href="https://playground.opensearch.org/app/searchRelevance#/">
                    Open in search comparision
                  </EuiButton>
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiHorizontalRule margin="xs" />
              <EuiSpacer size="xs"/>
              <EuiCodeBlock language="jsx" paddingSize="m" fontSize="s" overflowHeight={600} isCopyable>
                {queryDisplay}
              </EuiCodeBlock>
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem grow={1} style={{alignSelf: 'start'}}>
            <EuiPanel>
              <EuiText size="xs">
                <h2>Latency</h2>
              </EuiText>
              <EuiHorizontalRule margin="m" />
              <div id="latency"></div>
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGrid>
      </EuiFlexItem>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default QueryDetails;
