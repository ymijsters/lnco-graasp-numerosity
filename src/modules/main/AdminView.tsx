import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';

import ResultsView from '../answers/ResultsView';
import SettingsView from '../settings/SettingsView';

enum Tabs {
  TABLE_VIEW = 'TABLE_VIEW',
  SETTINGS_VIEW = 'SETTINGS_VIEW',
}

const AdminView: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(Tabs.TABLE_VIEW);

  return (
    <Box>
      <TabContext value={activeTab}>
        <TabList
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, newTab: Tabs) => setActiveTab(newTab)}
          centered
        >
          <Tab value={Tabs.TABLE_VIEW} label="Results" iconPosition="start" />
          <Tab
            value={Tabs.SETTINGS_VIEW}
            label={t('SETTINGS.TITLE')}
            iconPosition="start"
          />
        </TabList>
        <TabPanel value={Tabs.TABLE_VIEW}>
          <ResultsView />
        </TabPanel>
        <TabPanel value={Tabs.SETTINGS_VIEW}>
          <SettingsView />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AdminView;
