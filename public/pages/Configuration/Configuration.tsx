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
} from '@elastic/eui';
import { useHistory, useLocation } from 'react-router-dom';
import { CoreStart } from '../../../../../src/core/public';
import { QUERY_INSIGHTS } from '../TopNQueries/TopNQueries';

const Configuration = ({
  currTopN,
  currWindowSize,
  currTimeUnit,
  configInfo,
  core,
}: {
  currTopN: string;
  currWindowSize: string;
  currTimeUnit: string;
  configInfo: any;
  core: CoreStart;
}) => {
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

  const [topNSize, setTopNSize] = useState(currTopN);
  const [windowSize, setWindowSize] = useState(currWindowSize);
  const [time, setTime] = useState(currTimeUnit);

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
  if (topNSize !== currTopN) {
    changed = 'topN';
  } else if (windowSize !== currWindowSize) {
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

  const reset = () => {
    setTopNSize(currTopN);
    setWindowSize(currWindowSize);
    setTime(currTimeUnit);
  };

  return (
    <div>
      <EuiFlexItem grow={false} style={{ width: '60%' }}>
        <EuiPanel style={{ padding: '20px 20px' }}>
          <EuiForm>
            <EuiFlexItem>
              <EuiTitle size="s">
                <EuiText size="s">
                  <h2>Latency settings</h2>
                </EuiText>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGrid columns={2} gutterSize="s" style={{ padding: '15px 0px' }}>
                <EuiFlexItem style={{ padding: '0px 30px 0px 0px' }}>
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
                    label="latency.top_n_size"
                    helpText="Max allowed limit 100."
                    style={{ padding: '0px 0px 20px' }}
                  >
                    <EuiFlexItem>
                      <EuiFieldNumber
                        min={1}
                        max={100}
                        required={true}
                        value={topNSize}
                        onChange={(e) => onTopNSizeChange(e)}
                      />
                    </EuiFlexItem>
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem style={{ padding: '0px 30px 0px 0px' }}>
                  <EuiText size="xs">
                    <h3>Window size</h3>
                  </EuiText>
                  <EuiText size="xs" style={{ lineHeight: '22px', padding: '5px 0px' }}>
                    The duration during which the Top N queries are collected.
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    label="latency.window_size"
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
                          required={true}
                          options={timeUnits}
                          value={time}
                          onChange={(e) => onTimeChange(e)}
                        />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGrid>
            </EuiFlexItem>
          </EuiForm>
        </EuiPanel>
      </EuiFlexItem>
      {changed && valid ? (
        <EuiBottomBar>
          <EuiFlexGroup gutterSize="s" justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty color="ghost" size="s" iconType="cross" onClick={reset}>
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
                  configInfo(topNSize, windowSize, time);
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
