import { FC, useState } from 'react';

import { Box, Button, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import { hooks, mutations } from '@/config/queryClient';

const SettingsView: FC = () => {
  const { data: appSettings } = hooks.useAppSettings();
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();

  const trialsPerHalfStart =
    Number(
      appSettings?.find((data) => {
        if ('trials' in data.data) {
          return data.data.trials;
        }
        return false;
      })?.data.trials,
    ) || 1;

  const [trialsPerHalfSetting, updateTrialSetting] = useState<
    number | undefined
  >(trialsPerHalfStart);

  const saveAllSettings = (): void => {
    if (appSettings) {
      const previousSetting = appSettings.find((s) => s.name === 'trials');
      if (!previousSetting) {
        console.log(appSettings); // eslint-disable-line no-console
        postAppSetting({
          data: { trials: trialsPerHalfSetting },
          name: 'trialsPerHalf',
        });
      } else if (previousSetting.data.trials !== trialsPerHalfSetting) {
        patchAppSetting({
          id: previousSetting.id,
          data: { trials: trialsPerHalfSetting },
        });
      }
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Settings</Typography>
      <Stack spacing={1}>
        <Typography variant="h4">Trials per Half</Typography>
        <TextField
          value={trialsPerHalfSetting}
          onChange={(e) => updateTrialSetting(Number(e.target.value))}
        />
      </Stack>
      <Box>
        <Button variant="contained" onClick={saveAllSettings}>
          Save
        </Button>
      </Box>
    </Stack>
  );
};

export default SettingsView;
