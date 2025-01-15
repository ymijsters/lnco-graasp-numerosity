import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { SequencingSettings } from '@/modules/config/appSettings';

type SequencingSettingsViewProps = {
  sequencingSettings: SequencingSettings;
  onChange: (newSetting: SequencingSettings) => void;
};

const SequencingSettingsView: FC<SequencingSettingsViewProps> = ({
  sequencingSettings,
  onChange,
}) => {
  const { t } = useTranslation();
  const {
    customize,
    firstBlock,
    instructionsFirst,
    instructionsSecond,
    secondBlock,
  } = sequencingSettings || {
    customize: false,
    firstBlock: 'random',
    instructionsFirst: true,
    secondBlock: true,
    instructionsSecond: true,
  };
  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t('SETTINGS.SEQUENCING')}</Typography>
      <Typography variant="body1">
        {t('SETTINGS.SEQUENCING.SUBTITLE')}
      </Typography>
      <FormControlLabel
        control={<Switch />}
        label={t('SETTINGS.SEQUENCING.CUSTOMIZE')}
        onChange={(e, checked) => {
          onChange({
            ...sequencingSettings,
            customize: checked,
          });
        }}
        checked={customize}
      />
      {customize && (
        <Stack>
          <Typography variant="h6">
            {t('SETTINGS.SEQUENCING.FIRSTBLOCK')}
          </Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="random"
            name="radio-buttons-group"
            row
            value={firstBlock}
            onChange={(e) =>
              onChange({
                ...sequencingSettings,
                firstBlock: e.target.value as SequencingSettings['firstBlock'],
              })
            }
          >
            <FormControlLabel
              value="random"
              control={<Radio />}
              label="Random"
            />
            <FormControlLabel
              value="objects"
              control={<Radio />}
              label="Objects"
            />
            <FormControlLabel
              value="persons"
              control={<Radio />}
              label="People"
            />
          </RadioGroup>
          <FormControlLabel
            control={<Switch />}
            label={t('SETTINGS.SEQUENCING.FIRSTBLOCK.INSTRUCTIONS')}
            onChange={(e, checked) => {
              onChange({
                ...sequencingSettings,
                instructionsFirst: checked,
              });
            }}
            checked={instructionsFirst}
          />
          <FormControlLabel
            control={<Switch />}
            label={t('SETTINGS.SEQUENCING.SECONDBLOCK')}
            onChange={(e, checked) => {
              onChange({
                ...sequencingSettings,
                secondBlock: checked,
              });
            }}
            checked={secondBlock}
          />
          <FormControlLabel
            control={<Switch />}
            label={t('SETTINGS.SEQUENCING.SECONDBLOCK.INSTRUCTIONS')}
            onChange={(e, checked) => {
              onChange({
                ...sequencingSettings,
                instructionsSecond: checked,
              });
            }}
            checked={instructionsSecond}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default SequencingSettingsView;
