import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { DataCollection } from 'jspsych';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash';

import {
  AllowedLanguages,
  ConfigurationSettings,
  DurationSettings,
  LanguageSettings,
  NextStepSettings,
  PhotoDiodeSettings,
  SequencingSettings,
} from '../config/appSettings';
import { useSettings } from '../context/SettingsContext';
import NextStepSettingsView from './NextStepSettings';
import PhotoDiodeSettingsView from './PhotoDiodeSettingsView';
import SequencingSettingsView from './SequencingSettingsView';
import { run } from './SettingsCalibrationView';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    configuration: configurationSavedState,
    sequencing: sequencingSavedState,
    duration: durationSavedState,
    language: languageSavedState,
    photoDiodeSettings: photoDiodeSettingsSavedState,
    nextStepSettings: nextStepSettingsSavedState,
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
  const [nextStepSettings, setNextStepSettings] = useState<NextStepSettings>(
    nextStepSettingsSavedState,
  );
  const [photoDiodeSettings, setPhotoDiodeSettings] =
    useState<PhotoDiodeSettings>(photoDiodeSettingsSavedState);

  // Track a modal for running a calibration
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);

  const saveAllSettings = (): void => {
    saveSettings('configuration', configuration);
    saveSettings('sequencing', sequencing);
    saveSettings('duration', duration);
    saveSettings('language', language);
    saveSettings('photoDiodeSettings', photoDiodeSettings);
    saveSettings('nextStepSettings', nextStepSettings);
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    setDuration(durationSavedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationSavedState]);

  const disableSave = useMemo(() => {
    if (
      isEqual(configurationSavedState, configuration) &&
      isEqual(sequencingSavedState, sequencing) &&
      isEqual(durationSavedState, duration) &&
      isEqual(languageSavedState, language) &&
      isEqual(photoDiodeSettingsSavedState, photoDiodeSettings) &&
      isEqual(nextStepSettingsSavedState, nextStepSettings)
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
    photoDiodeSettings,
    photoDiodeSettingsSavedState,
    nextStepSettings,
    nextStepSettingsSavedState,
  ]);

  const errorHardImageSize =
    !(!configuration.hardImageSize || configuration.hardImageSize === '') &&
    !(
      configuration.hardImageSize.endsWith('px') ||
      configuration.hardImageSize.endsWith('%')
    );

  const handleCalibrate = (): void => {
    setCalibrationModalOpen(true); // Open modal
  };

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
          label={t('SETTINGS.SKIP.DEVICE')}
          onChange={(e, checked) => {
            setConfiguration({ ...configuration, skipDevice: checked });
          }}
          checked={configuration.skipDevice}
        />
        <FormControlLabel
          control={<Switch />}
          label={t('SETTINGS.FORCE.DEVICE')}
          onChange={(e, checked) => {
            setConfiguration({ ...configuration, forceDevice: checked });
          }}
          checked={configuration.forceDevice}
        />
        <Stack spacing={1}>
          <Typography variant="h6">
            {t('SETTINGS.CONTINUE.BUTTON.DELAY.TITLE')}
          </Typography>
          <TextField
            value={configuration.continueButtonDelay}
            label={t('SETTINGS.CONTINUE_BUTTON_DELAY')}
            type="number"
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                continueButtonDelay: Number(e.target.value),
              })
            }
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="h6">
            {t('SETTINGS.CONFIDENCE.QUESTION.TITLE')}
          </Typography>
          <FormControlLabel
            control={<Switch />}
            label={t('SETTINGS.CONFIDENCE.QUESTION')}
            onChange={(e, checked) => {
              setConfiguration({
                ...configuration,
                addConfidenceQuestion: checked,
              });
            }}
            checked={configuration.addConfidenceQuestion}
          />
        </Stack>
        <Stack spacing={0}>
          <Typography variant="h6">
            Set the font size of the experiment
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="random"
            name="radio-buttons-group"
            row
            value={configuration.fontSize}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                fontSize: e.target.value as
                  | 'small'
                  | 'normal'
                  | 'large'
                  | 'extra-large',
              })
            }
          >
            <FormControlLabel value="small" control={<Radio />} label="Small" />
            <FormControlLabel
              value="normal"
              control={<Radio />}
              label="Normal"
            />
            <FormControlLabel value="large" control={<Radio />} label="Large" />
            <FormControlLabel
              value="extra-large"
              control={<Radio />}
              label="Extra Large"
            />
          </RadioGroup>
        </Stack>
        <Stack spacing={1}>
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
          <Box>
            <Button variant="contained" onClick={handleCalibrate}>
              Calibrate
            </Button>
          </Box>
        </Stack>
      </Stack>
      <PhotoDiodeSettingsView
        photoDiodeSettings={photoDiodeSettings}
        onChange={setPhotoDiodeSettings}
      />
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
      <SequencingSettingsView
        sequencingSettings={sequencing}
        onChange={setSequencing}
      />
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
      <NextStepSettingsView
        nextStepSettings={nextStepSettings}
        onChange={(newSetting: NextStepSettings) =>
          setNextStepSettings(newSetting)
        }
      />

      <Dialog
        open={calibrationModalOpen}
        onClose={() => setCalibrationModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Calibration Results</DialogTitle>
        <DialogContent>
          <Button
            onClick={() => {
              run({
                input: {
                  configuration,
                  duration,
                  language,
                  nextStepSettings,
                  photoDiodeSettings,
                  sequencing,
                },
                onFinish: (data: DataCollection) => {
                  setConfiguration({
                    ...configuration,
                    hardImageSize: `${(10 / data.values()[0].response.input) * 1116}px`,
                  });
                  setCalibrationModalOpen(false);
                },
              });
            }}
          >
            Run Calibration
          </Button>
          <div id="calibration-div" />
        </DialogContent>
      </Dialog>

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
