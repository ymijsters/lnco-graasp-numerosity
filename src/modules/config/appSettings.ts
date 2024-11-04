export type SequencingSettings = {
  content: 'random' | 'objects' | 'people';
};

export type DurationSettings = {
  content: number;
};

export type ConfigurationSettings = {
  skipCalibration: boolean;
  forceDevice: boolean;
  hardImageSize: string;
  usePhotoDiode: 'top-left' | 'top-right' | 'off';
};
export enum AllowedLanguages {
  English = 'en',
  German = 'de',
  French = 'fr',
}

export type LanguageSettings = {
  language: AllowedLanguages;
};
