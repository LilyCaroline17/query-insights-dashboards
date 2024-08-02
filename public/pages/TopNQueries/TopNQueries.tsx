import React, { useCallback, useEffect, useState } from 'react';
import { MemoryRouter, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { EuiTab, EuiTabs, EuiTitle } from '@elastic/eui';
import dateMath from '@elastic/datemath';
import QueryInsights from '../QueryInsights/QueryInsights';
import Configuration from '../Configuration/Configuration';
import QueryDetails from '../QueryDetails/QueryDetails';
import { CoreStart } from '../../../../../src/core/public';

export const QUERY_INSIGHTS = '/queryInsights';
export const CONFIGURATION = '/configuration';

export interface MetricSettings {
  isEnabled: boolean,
  currTopN: string,
  currWindowSize: string,
  currTimeUnit: string,
};

const TopNQueries = ({ core }: { core: CoreStart }) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const defaultStart = 'now-1y';
  const [latencySettings, setLatencySettings] = useState<MetricSettings>({
    isEnabled: false,
    currTopN: '',
    currWindowSize: '',
    currTimeUnit: 'HOURS'
  });

  const [cpuSettings, setCpuSettings] = useState<MetricSettings>({
    isEnabled: false,
    currTopN: '',
    currWindowSize: '',
    currTimeUnit: 'HOURS'
  });

  const [memorySettings, setMemorySettings] = useState<MetricSettings>({
    isEnabled: false,
    currTopN: '',
    currWindowSize: '',
    currTimeUnit: 'HOURS'
  });

  // const metricSettingsMap: { [key: string]: MetricSettings } = {
  //   latency: latencySettings,
  //   cpu: cpuSettings,
  //   memory: memorySettings,
  // };

  const setMetricSettings = (metricType: string, updates: Partial<MetricSettings>) => {
    switch(metricType){
      case 'latency':
        setLatencySettings(prevSettings => ({ ...prevSettings, ...updates }));
        break;
      case 'cpu':
        setCpuSettings(prevSettings => ({ ...prevSettings, ...updates }));
        break;
      case 'memory':
        setMemorySettings(prevSettings => ({ ...prevSettings, ...updates }));
        break;
    }
  };

  const [queries, setQueries] = useState<any[]>([]);

  const tabs: Array<{ id: string; name: string; route: string }> = [
    {
      id: 'topNQueries',
      name: 'Top N queries',
      route: QUERY_INSIGHTS,
    },
    {
      id: 'configuration',
      name: 'Configuration',
      route: CONFIGURATION,
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

  const retrieveQueries = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const resp = await core.http.get('/api/top_queries');
      const newQueries = resp.response.top_queries;
      const startTimestamp = parseDateString(start);
      const endTimestamp = parseDateString(end);
      const noDuplicates = newQueries.filter((array, index, self) =>
        index === self.findIndex((t) => (t.save === array.save && t.State === array.State)))
      console.log(noDuplicates);
      setQueries(noDuplicates.filter((item: any) => item.timestamp >= startTimestamp && item.timestamp <= endTimestamp));
    } catch (error) {
      console.error('Failed to retrieve queries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const retrieveConfigInfo = async (
    get : boolean,
    enabled: boolean = false,
    metric: string = "",
    newTopN: string = "",
    newWindowSize: string = "",
    newTimeUnit: string = "",
  ) => {
    if (get) {
      try {
        const resp = await core.http.get('/api/settings');
        console.log(resp);
        // const settings = resp.persistent.search.insights.top_queries
        // newTopN = settings.
        // newWindowSize = 
        // newTimeUnit =
      } catch (error) {
      console.error('Failed to retrieve settings:', error);
      }
    } else {
      try {
        if (enabled){
          setMetricSettings(metric, {
            isEnabled: enabled,
          });
        } else {
          setMetricSettings(metric, {
            isEnabled: enabled,
            currTopN: newTopN,
            currWindowSize: newWindowSize,
            currTimeUnit: newTimeUnit,
          });
        }
        // const requestBody = {newTopN};
        // core.http.put('/api/top_n_size', {body: JSON.stringify(requestBody)});
      } catch (error) {
        console.error('Failed to set units:', error);
      }
    }
    // setTopN(newTopN);
    // setWindowSize(newWindowSize);
    // setTimeUnit(newTimeUnit);
  };

  useEffect(() => {
    retrieveQueries(defaultStart, 'now');
  }, [retrieveQueries, defaultStart]);

  useEffect(() => {
    retrieveConfigInfo(true);
  }, [])

  return (
    <div style={{ padding: '35px 35px' }}>
      <Switch>
        <Route exact path="/query-details/:hashedQuery">
          <QueryDetails queries={queries} core={core} />
        </Route>
        <Route exact path={QUERY_INSIGHTS}>
          <EuiTitle size="l">
            <h1>Query insights - Top N queries</h1>
          </EuiTitle>
          <div style={{ padding: '25px 0px' }}>
            <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
          </div>
          <QueryInsights
            queries={queries}
            loading={loading}
            onQueriesChange={retrieveQueries}
            defaultStart={defaultStart}
            core={core}
          />
        </Route>
        <Route exact path={CONFIGURATION}>
          <EuiTitle size="l">
            <h1>Query insights - Configuration</h1>
          </EuiTitle>
          <div style={{ padding: '25px 0px' }}>
            <EuiTabs>{tabs.map(renderTab)}</EuiTabs>
          </div>
          <Configuration
            latencySettings={latencySettings}
            cpuSettings={cpuSettings}
            memorySettings={memorySettings}
            configInfo={retrieveConfigInfo}
            core={core}
          />
        </Route>
        <Redirect to={QUERY_INSIGHTS} />
      </Switch>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default TopNQueries;
