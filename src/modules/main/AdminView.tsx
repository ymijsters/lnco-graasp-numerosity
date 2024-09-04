import { type FC } from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';

import AnswersView from '../answers/AnswersView';
import SettingsView from '../settings/SettingsView';

const AdminView: FC = () => (
  <Box>
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab: Tabs) => setActiveTab(newTab)}
        centered
      >
        <Tab
          data-cy={TAB_TABLE_VIEW_CY}
          value={Tabs.TABLE_VIEW}
          label={t('ANSWERS.TITLE')}
          icon={<TableViewIcon />}
          iconPosition="start"
        />
        <Tab
          data-cy={TAB_SETTINGS_VIEW_CY}
          value={Tabs.SETTINGS_VIEW}
          label={t('SETTINGS.TITLE')}
          icon={<SettingsApplicationsIcon />}
          iconPosition="start"
        />
      </TabList>
      <TabPanel value={Tabs.TABLE_VIEW} data-cy={TABLE_VIEW_PANE_CY}>
        <AnswersView />
      </TabPanel>
      <TabPanel value={Tabs.SETTINGS_VIEW} data-cy={SETTINGS_VIEW_PANE_CY}>
        <SettingsView />
      </TabPanel>
    </TabContext>
  </Box>
);

export default AdminView;
