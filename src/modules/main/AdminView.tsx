import { type FC } from 'react';

import { Box, Stack } from '@mui/material';

import AnswersView from '../answers/AnswersView';
import SettingsView from '../settings/SettingsView';

const AdminView: FC = () => (
  <Box>
    <Stack spacing={2}>
      <Box>
        <AnswersView />
      </Box>
      <Box>
        <SettingsView />
      </Box>
    </Stack>
  </Box>
);

export default AdminView;
