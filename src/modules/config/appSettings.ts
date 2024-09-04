export type SequencingSettings = {
  content: 'random' | 'objects' | 'people';
};

export type DurationSettings = {
  content: number;
};

export type ConfigurationSettings = {
  skipCalibration: boolean;
  forceDevice: boolean;
};
