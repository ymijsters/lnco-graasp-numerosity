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
  AllowedLanguages,
  ConfigurationSettings,
  DurationSettings,
  LanguageSettings,
  SequencingSettings,
} from '../config/appSettings';
import { useSettings } from '../context/SettingsContext';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    configuration: configurationSavedState,
    sequencing: sequencingSavedState,
    duration: durationSavedState,
    language: languageSavedState,
    saveSettings,
  } = useSettings();

  const [configuration, setConfiguration] = useState<ConfigurationSettings>(
    configurationSavedState,
  );
  const [sequencing, setSequencing] =
    useState<SequencingSettings>(sequencingSavedState);
  const [duration, setDuration] =
    useState<DurationSettings>(durationSavedState);
  const [language, setLangauge] =
    useState<LanguageSettings>(languageSavedState);

  const saveAllSettings = (): void => {
    saveSettings('configuration', configuration);
    saveSettings('sequencing', sequencing);
    saveSettings('duration', duration);
    saveSettings('language', language);
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
      isEqual(durationSavedState, duration) &&
      isEqual(languageSavedState, language)
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
    language,
    languageSavedState,
  ]);

  const errorHardImageSize =
    !(!configuration.hardImageSize || configuration.hardImageSize === '') &&
    !(
      configuration.hardImageSize.endsWith('px') ||
      configuration.hardImageSize.endsWith('%')
    );

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t('SETTINGS.TITLE')}</Typography>
      <Stack spacing={1}>
        <Typography variant="h6">{t('SETTINGS.EXPERIMENT.CONFIG')}</Typography>
        <FormControlLabel
          control={<Switch />}
          label={t('SETTINGS.SKIP.SCREEN.CALIBRATION')}
          onChange={(e, checked) => {
            if (!errorHardImageSize) {
              setConfiguration({ ...configuration, skipCalibration: checked });
            }
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
        <Typography variant="h6">
          {t('SETTINGS.HARD.IMAGE.SIZE.DESCRIPTION')}
        </Typography>
        <TextField
          value={configuration.hardImageSize}
          label={t('SETTINGS.HARD.IMAGE.SIZE.FIELD')}
          onChange={(e) =>
            setConfiguration({
              ...configuration,
              hardImageSize: e.target.value,
            })
          }
          error={errorHardImageSize}
        />
        <Stack spacing={1}>
          <Typography variant="h6">{t('SETTINGS.PHOTODIODE_LABEL')}</Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="random"
            name="radio-buttons-group"
            row
            value={configuration.usePhotoDiode}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                usePhotoDiode: e.target.value as
                  | 'top-left'
                  | 'top-right'
                  | 'off',
              })
            }
          >
            <FormControlLabel
              value="top-left"
              control={<Radio />}
              label="top-left"
            />
            <FormControlLabel
              value="top-right"
              control={<Radio />}
              label="top-right"
            />
            <FormControlLabel value="off" control={<Radio />} label="off" />
          </RadioGroup>
        </Stack>
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
      <Stack spacing={1}>
        <Typography variant="h6">Language</Typography>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="random"
          name="radio-buttons-group"
          row
          value={language.language}
          onChange={(e) =>
            setLangauge({
              language: e.target.value as AllowedLanguages,
            })
          }
        >
          <FormControlLabel value="en" control={<Radio />} label="English" />
          <FormControlLabel value="de" control={<Radio />} label="German" />
          <FormControlLabel value="fr" control={<Radio />} label="French" />
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
