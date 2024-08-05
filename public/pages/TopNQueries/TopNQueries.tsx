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
      default:
        console.error(`Unknown metric type: ${metricType}`);
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
      const nullResponse = { response: { top_queries: [] } };
      console.log(latencySettings);
      console.log(cpuSettings);
      console.log(memorySettings);
      const respLatency = latencySettings.isEnabled ? await core.http.get('/api/top_queries/latency'): nullResponse;
      const respCpu = cpuSettings.isEnabled ? await core.http.get('/api/top_queries/cpu') : nullResponse;
      const respMemory = memorySettings.isEnabled ? await core.http.get('/api/top_queries/memory'): nullResponse;
      const newQueries = [
        ...respLatency.response.top_queries,
        ...respCpu.response.top_queries,
        ...respMemory.response.top_queries
      ];
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
  }, [latencySettings, cpuSettings, memorySettings, core]);

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
        const settings = resp.response.persistent.search.insights.top_queries
        const latency = settings.latency;
        const cpu = settings.cpu;
        const memory = settings.memory;
        console.log(latency);
        if (latency !== undefined && latency.enabled === "true") {
          const [time, timeUnits] = latency.window_size.match(/\D+|\d+/g);
          setMetricSettings('latency', {
            isEnabled: true,
            currTopN: latency.top_n_size,
            currWindowSize: time,
            currTimeUnit: timeUnits === 'm' ? 'MINUTES': 'HOURS',
          });
        }
        if (cpu !== undefined && cpu.enabled === "true") {
          const [time, timeUnits] = cpu.window_size.match(/\D+|\d+/g);
          setMetricSettings('cpu', {
            isEnabled: true,
            currTopN: cpu.top_n_size,
            currWindowSize: time,
            currTimeUnit: timeUnits === 'm' ? 'MINUTES': 'HOURS',
          });
        }
        if (memory !== undefined && memory.enabled === "true") {
          const [time, timeUnits] = memory.window_size.match(/\D+|\d+/g);
          setMetricSettings('memory', {
            isEnabled: true,
            currTopN: memory.top_n_size,
            currWindowSize: time,
            currTimeUnit: timeUnits === 'm' ? 'MINUTES': 'HOURS',
          });
        }
      } catch (error) {
      console.error('Failed to retrieve settings:', error);
      }
    } else {
      try {
        setMetricSettings(metric, {
          isEnabled: enabled,
          currTopN: newTopN,
          currWindowSize: newWindowSize,
          currTimeUnit: newTimeUnit,
        });
        const requestQuery = {metric: metric, enabled: enabled, top_n_size: newTopN, window_size: `${newWindowSize}${newTimeUnit == 'MINUTES' ? 'm': 'h'}`};
        const resp = await core.http.put('/api/update_settings', {query: requestQuery});
        console.log("Setting settings");
        console.log(resp);
      } catch (error) {
        console.error('Failed to set settings:', error);
      }
    }
    // setTopN(newTopN);
    // setWindowSize(newWindowSize);
    // setTimeUnit(newTimeUnit);
  };

  const onQueriesChange = (start : string, end : string) => {
    retrieveQueries(start, end);
    retrieveConfigInfo(true);
  }

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
            onQueriesChange={onQueriesChange}
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
