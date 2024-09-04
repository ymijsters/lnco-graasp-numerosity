import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash';

import {
  ConfigurationSettings,
  DurationSettings,
  SequencingSettings,
} from '../config/appSettings';
import { useSettings } from '../context/SettingsContext';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    configuration: configurationSavedState,
    sequencing: sequencingSavedState,
    duration: durationSavedState,
    saveSettings,
  } = useSettings();

  const [configuration, setConfiguration] = useState<ConfigurationSettings>(
    configurationSavedState,
  );
  const [sequencing, setSequencing] =
    useState<SequencingSettings>(sequencingSavedState);
  const [duration, setDuration] =
    useState<DurationSettings>(durationSavedState);

  const saveAllSettings = (): void => {
    saveSettings('configuration', configuration);
    saveSettings('sequencing', sequencing);
    saveSettings('duration', duration);
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ configuration, sequencing, duration });
    setDuration(durationSavedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSavedState]);

  const disableSave = useMemo(() => {
    if (
      isEqual(configurationSavedState, configuration) &&
      isEqual(sequencingSavedState, sequencing) &&
      isEqual(durationSavedState, duration)
    ) {
      return true;
    }
    return false;
  }, [
    configuration,
    configurationSavedState,
    sequencing,
    sequencingSavedState,
    duration,
    durationSavedState,
  ]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t('SETTINGS.TITLE')}</Typography>
      <Stack spacing={1}>
        <Typography variant="h6">{t('SETTINGS.EXPERIMENT.CONFIG')}</Typography>
        <FormControlLabel
          control={<Switch />}
          label={t('SETTINGS.SKIP.SCREEN.CALIBRATION')}
          onChange={(e, checked) => {
            setConfiguration({ ...configuration, skipCalibration: checked });
          }}
          checked={configuration.skipCalibration}
        />
        <FormControlLabel
          control={<Switch />}
          label={t('SETTINGS.FORCE.DEVICE')}
          onChange={(e, checked) => {
            setConfiguration({ ...configuration, forceDevice: checked });
          }}
          checked={configuration.forceDevice}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">{t('SETTINGS.BLOCKS.TITLE')}</Typography>
        <Stack spacing={0}>
          <Typography variant="body1">
            {t('SETTINGS.BLOCKS.DESCRIPTION')}
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {t('SETTINGS.BLOCKS.EXAMPLE')}
          </Typography>
        </Stack>
        <TextField
          value={duration.content}
          onChange={(e) => setDuration({ content: Number(e.target.value) })}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">{t('SETTINGS.SEQUENCING')}</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="random"
          name="radio-buttons-group"
          row
          value={sequencing.content}
          onChange={(e) =>
            setSequencing({
              content: e.target.value as SequencingSettings['content'],
            })
          }
        >
          <FormControlLabel value="random" control={<Radio />} label="Random" />
          <FormControlLabel
            value="objects"
            control={<Radio />}
            label="Objects"
          />
          <FormControlLabel value="people" control={<Radio />} label="People" />
        </RadioGroup>
      </Stack>
      <Box>
        <Button
          variant="contained"
          onClick={saveAllSettings}
          disabled={disableSave}
        >
          Save
        </Button>
      </Box>
    </Stack>
  );
};

export default SettingsView;
