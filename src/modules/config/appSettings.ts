export type SequencingSettings = {
  customize: boolean;
  firstBlock?: 'persons' | 'objects' | 'random';
  instructionsFirst?: boolean;
  secondBlock?: boolean;
  instructionsSecond?: boolean;
};

export type DurationSettings = {
  content: number;
};

export type PhotoDiodeSettings = {
  usePhotoDiode: 'top-left' | 'top-right' | 'customize' | 'off';
  photoDiodeLeft?: string;
  photoDiodeTop?: string;
  photoDiodeHeight?: string;
  photoDiodeWidth?: string;
  testPhotoDiode?: boolean;
};

export type ConfigurationSettings = {
  skipCalibration: boolean;
  skipDevice: boolean;
  forceDevice: boolean;
  hardImageSize: string;
  usePhotoDiode: 'top-left' | 'top-right' | 'off';
  addConfidenceQuestion: boolean;
  continueButtonDelay: number;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
};
export enum AllowedLanguages {
  English = 'en',
  German = 'de',
  French = 'fr',
}

export type LanguageSettings = {
  language: AllowedLanguages;
};

export type NextStepSettings = {
  linkToNextPage: boolean;
  title: string;
  description: string;
  link: string;
  linkText: string;
};
