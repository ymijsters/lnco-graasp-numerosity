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
export enum AllowedLanguages {
  English = 'en',
  German = 'de',
  French = 'fr',
}

export type LanguageSettings = {
  language: AllowedLanguages;
};
