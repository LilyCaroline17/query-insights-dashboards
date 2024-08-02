import React, { useState, useEffect } from 'react';
import {
  EuiFlexItem,
  EuiPanel,
  EuiTitle,
  EuiFlexGrid,
  EuiText,
  EuiFieldNumber,
  EuiSelect,
  EuiFlexGroup,
  EuiFormRow,
  EuiForm,
  EuiButton,
  EuiButtonEmpty,
  EuiBottomBar,
  EuiSwitch,
} from '@elastic/eui';
import { useHistory, useLocation } from 'react-router-dom';
import { CoreStart } from '../../../../../src/core/public';
import { QUERY_INSIGHTS, MetricSettings } from '../TopNQueries/TopNQueries';

const Configuration = ({
  latencySettings, 
  cpuSettings,
  memorySettings,
  configInfo,
  core,
}: {
  latencySettings: MetricSettings, 
  cpuSettings: MetricSettings,
  memorySettings: MetricSettings,
  configInfo: any
  core: CoreStart;
}) => {

  const metricTypes = [
    { value: 'latency', text: 'Latency' },
    { value: 'cpu', text: 'CPU' },
    { value: 'memory', text: 'Memory' },
  ];

  const timeUnits = [
    { value: 'MINUTES', text: 'Minute(s)' },
    { value: 'HOURS', text: 'Hour(s)' },
  ];

  const minutesOptions = [
    { value: 'ONE', text: '1' },
    { value: 'FIVE', text: '5' },
    { value: 'TEN', text: '10' },
    { value: 'THIRTY', text: '30' },
  ];

  const history = useHistory();
  const location = useLocation();

  const [metric, setMetric] = useState<'latency' | 'cpu' | 'memory'>('latency');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [topNSize, setTopNSize] = useState(latencySettings.currTopN);
  const [windowSize, setWindowSize] = useState(latencySettings.currWindowSize);
  const [time, setTime] = useState(latencySettings.currTimeUnit);

  const metricSettingsMap: { [key: string]: MetricSettings } = {
    latency: latencySettings,
    cpu: cpuSettings,
    memory: memorySettings,
  };

  const newOrReset = () => {
    const currMetric = metricSettingsMap[metric];
    setTopNSize(currMetric.currTopN);
    setWindowSize(currMetric.currWindowSize);
    setTime(currMetric.currTimeUnit);
    setIsEnabled(currMetric.isEnabled);
  };

  useEffect(() => {
    newOrReset()
  }, [metric]);

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

  const onMetricChange = (e: any) => {
    setMetric(e.target.value);
  };

  const onEnabledChange = (e: any) => {
    setIsEnabled(e.target.checked);
  };

  const onTopNSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopNSize(e.target.value);
  };

  const onWindowSizeChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setWindowSize(e.target.value);
  };

  const onTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTime(e.target.value);
  };

  const MinutesBox = () => (
    <EuiSelect
      id="minutes"
      required={true}
      options={minutesOptions}
      value={windowSize}
      onChange={(e) => onWindowSizeChange(e)}
    />
  );

  const HoursBox = () => (
    <EuiFieldNumber
      min={1}
      max={24}
      required={true}
      value={windowSize}
      onChange={(e) => onWindowSizeChange(e)}
    />
  );

  const WindowChoice = time === timeUnits[0].value ? MinutesBox : HoursBox;

  let changed;
  if (isEnabled != metricSettingsMap[metric].isEnabled){
    changed = 'isEnabled';
  }
  else if (topNSize !== metricSettingsMap[metric].currTopN) {
    changed = 'topN';
  } else if (windowSize !== metricSettingsMap[metric].currWindowSize) {
    changed = 'windowSize';
  }

  let valid = false;

  const nVal = parseInt(topNSize, 10);
  if (1 <= nVal && nVal <= 100) {
    if (time === timeUnits[0].value) {
      valid = true;
    } else {
      const windowVal = parseInt(windowSize, 10);
      if (1 <= windowVal && windowVal <= 24) {
        valid = true;
      }
    }
  }

  return (
    <div>
      <EuiFlexItem grow={false} style={{ width: '60%' }}>
        <EuiPanel style={{ padding: '20px 20px' }}>
          <EuiForm>
            <EuiFlexItem>
              <EuiTitle size="s">
                <EuiText size="s">
                  <h2>Configuration settings</h2>
                </EuiText>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGrid columns={2} gutterSize="s" style={{ padding: '15px 0px' }}>
                <EuiFlexItem>
                  <EuiText size="xs">
                    <h3>Metric Type</h3>
                  </EuiText>
                  <EuiText size="xs" style={{ lineHeight: '22px', padding: '5px 0px' }}>
                    Specify the metric type to set settings for.
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    style={{ padding: '0px 0px 20px' }}
                  >
                    <EuiSelect
                      id="metricType"
                      required={true}
                      options={metricTypes}
                      value={metric}
                      onChange={(e) => onMetricChange(e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText size="xs">
                    <h3>Enabled</h3>
                  </EuiText>
                  <EuiText size="xs" style={{ lineHeight: '22px', padding: '5px 0px' }}>
                    {`Enable/disable ${metric} to be include in Top N Queries.`}
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    style={{ padding: '0px 0px 20px' }}
                  >
                    <EuiSwitch
                      label=""
                      checked={isEnabled}
                      onChange={(e) => onEnabledChange(e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                {isEnabled ? (
                  <>
                    <EuiFlexItem>
                      <EuiText size="xs">
                        <h3>Value of N (count)</h3>
                      </EuiText>
                      <EuiText size="xs" style={{ lineHeight: '22px', padding: '5px 0px' }}>
                        Specify the value of N. N is the number of queries to be collected within the
                        window size.
                      </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiFormRow
                        label={`${metric}.top_n_size`}
                        helpText="Max allowed limit 100."
                        style={{ padding: '0px 0px 20px' }}
                      >
                        <EuiFieldNumber
                          min={1}
                          max={100}
                          required={isEnabled}
                          value={topNSize}
                          onChange={(e) => onTopNSizeChange(e)}
                        />
                      </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiText size="xs">
                        <h3>Window size</h3>
                      </EuiText>
                      <EuiText size="xs" style={{ lineHeight: '22px', padding: '5px 0px' }}>
                        The duration during which the Top N queries are collected.
                      </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem>
                      <EuiFormRow
                        label={`${metric}.window_size`}
                        helpText="Max allowed limit 24 hours."
                        style={{ padding: '15px 0px 5px' }}
                      >
                        <EuiFlexGroup>
                          <EuiFlexItem style={{ flexDirection: 'row' }}>
                            <WindowChoice />
                          </EuiFlexItem>
                          <EuiFlexItem>
                            <EuiSelect
                              id="timeUnit"
                              required={isEnabled}
                              options={timeUnits}
                              value={time}
                              onChange={(e) => onTimeChange(e)}
                            />
                          </EuiFlexItem>
                        </EuiFlexGroup>
                      </EuiFormRow>
                    </EuiFlexItem>
                  </>
                ): null}
              </EuiFlexGrid>
            </EuiFlexItem>
          </EuiForm>
        </EuiPanel>
      </EuiFlexItem>
      {changed && valid ? (
        <EuiBottomBar>
          <EuiFlexGroup gutterSize="s" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty color="ghost" size="s" iconType="cross" onClick={newOrReset}>
                Cancel
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                color="primary"
                fill
                size="s"
                iconType="check"
                onClick={() => {
                  configInfo(false, isEnabled, metric, topNSize, windowSize, time);
                  return history.push(QUERY_INSIGHTS);
                }}
              >
                Save
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiBottomBar>
      ) : null}
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Configuration;
