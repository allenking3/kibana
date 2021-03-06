/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { monitorStatusSelector } from '../state/selectors';
import { PageHeader } from './page_header';
import { useBreadcrumbs } from '../hooks/use_breadcrumbs';
import { useTrackPageview } from '../../../observability/public';
import { useMonitorId } from '../hooks';
import { MonitorCharts } from '../components/monitor';
import { MonitorStatusDetails, PingList } from '../components/monitor';
import { getDynamicSettings } from '../state/actions/dynamic_settings';
import { Ping } from '../../common/runtime_types/ping';
import { setSelectedMonitorId } from '../state/actions';
import { EnableMonitorAlert } from '../components/overview/monitor_list/columns/enable_alert';
import { getMonitorAlertsAction } from '../state/alerts/alerts';
import { useInitApp } from '../hooks/use_init_app';

const isAutogeneratedId = (id: string) => {
  const autoGeneratedId = /^auto-(icmp|http|tcp)-OX[A-F0-9]{16}-[a-f0-9]{16}/;
  return autoGeneratedId.test(id);
};

// For monitors with no explicit ID, we display the URL instead of the
// auto-generated ID because it is difficult to derive meaning from a
// generated id like `auto-http-0X8D6082B94BBE3B8A`.
// We may deprecate this behavior in the next major release, because
// the heartbeat config will require an explicit ID.
const getPageTitle = (monId: string, selectedMonitor: Ping | null) => {
  if (isAutogeneratedId(monId)) {
    return selectedMonitor?.url?.full || monId;
  }
  return monId;
};

export const MonitorPage: React.FC = () => {
  const dispatch = useDispatch();

  useInitApp();

  useEffect(() => {
    dispatch(getDynamicSettings());
  }, [dispatch]);

  const monitorId = useMonitorId();

  useEffect(() => {
    dispatch(setSelectedMonitorId(monitorId));
    dispatch(getMonitorAlertsAction.get());
  }, [monitorId, dispatch]);

  const selectedMonitor = useSelector(monitorStatusSelector);

  useTrackPageview({ app: 'uptime', path: 'monitor' });
  useTrackPageview({ app: 'uptime', path: 'monitor', delay: 15000 });

  const nameOrId = selectedMonitor?.monitor?.name || getPageTitle(monitorId, selectedMonitor);
  useBreadcrumbs([{ text: nameOrId }]);
  return (
    <>
      <PageHeader
        headingText={
          <EuiFlexGroup wrap={false}>
            <EuiFlexItem grow={false}>{nameOrId}</EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EnableMonitorAlert
                monitorId={monitorId}
                monitorName={selectedMonitor?.monitor?.name || selectedMonitor?.url?.full}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        }
        datePicker={true}
      />
      <EuiSpacer size="s" />
      <MonitorStatusDetails monitorId={monitorId} />
      <EuiSpacer size="s" />
      <MonitorCharts monitorId={monitorId} />
      <EuiSpacer size="s" />
      <PingList monitorId={monitorId} />
    </>
  );
};
