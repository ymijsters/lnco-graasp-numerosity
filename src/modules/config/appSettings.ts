export type SequencingSettings = {
  content: 'random' | 'object' | 'person';
};

export type DurationSettings = {
  content: number;
};

export type ConfigurationSettings = {
  skipCalibration: boolean;
  forceDevice: boolean;
};
