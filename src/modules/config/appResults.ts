import { AllSettingsType } from '../context/SettingsContext';

export enum StatusEnum {
  Block1 = 'Block 1',
  Block2 = 'Block 2',
  Done = 'Done',
}
export type ExperimentResult = {
  settings?: AllSettingsType;
  rawData?: { trials: object[] };
  status?: StatusEnum;
};
