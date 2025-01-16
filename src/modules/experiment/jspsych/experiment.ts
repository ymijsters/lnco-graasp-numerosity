/**
 * @title Numerosity
 * @description Social numerosity task.
 * @version 0.1.0
 *
 * @assets assets/
 */
// You can import stylesheets (.scss or .css).
// Import required plugins and modules from jsPsych
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import PreloadPlugin from '@jspsych/plugin-preload';
import jsPsychSurveyHtmlForm from '@jspsych/plugin-survey-html-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import surveyLikert from '@jspsych/plugin-survey-likert';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Marked, Renderer } from '@ts-stack/markdown';
import i18next from 'i18next';
import { DataCollection, JsPsych, initJsPsych } from 'jspsych';

import { ExperimentResult, StatusEnum } from '@/modules/config/appResults';
import { AllSettingsType } from '@/modules/context/SettingsContext';

import { groupInstructions, tipScreen } from './instructions';
// Import styles
import * as langf from './languages.js';
import { showEndScreen } from './quit';
import {
  deviceConnectPages,
  fullScreenPlugin,
  generatePreloadStrings,
  resize,
  setHardCodedSizes,
  setSizes,
} from './setup';
import { createButtonPage } from './utils';

// Type aliases for better code readability
type ImageDescription = { num: number; id: number; blackscreenJitter: number };
export type Timeline = JsPsych['timeline'];
export type DeviceType = {
  device: SerialPort | USBDevice | null;
  sendTriggerFunction: (
    device: SerialPort | USBDevice | null,
    trigger: string,
  ) => Promise<void>;
};
export type ConnectType = 'Serial Port' | 'USB' | null;

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

/**
 * @function generateTimelineVars
 * @description Generate Timeline variables for the experiment.
 * For each numerosity, "nbBlock" images are randomly selected and put in a list ordered by numerosity.
 * @param { JsPsych } JsPsych - The jsPsych instance
 * @param { number } nbBlocks - Number of blocks per numerosity
 * @returns { ImageDescription[] } - Array of image descriptions
 */
function generateTimelineVars(
  jsPsychComponent: JsPsych,
  nbBlocks: number,
): ImageDescription[] {
  const timelineVariables: ImageDescription[] = [];

  for (let num = 5; num <= 8; num += 1) {
    const idList: number[] =
      jsPsychComponent.randomization.sampleWithoutReplacement(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        nbBlocks,
      );
    for (let i: number = 0; i < nbBlocks; i += 1) {
      timelineVariables.push({
        num,
        id: idList[i],
        blackscreenJitter: (Math.random() - 0.5) * 300,
      });
    }
  }
  return timelineVariables;
}

// Function to create the re-enter fullscreen button
const addFullscreenButton = (): void => {
  // Select the progress bar container
  const progressBarContainer = document.getElementById(
    'jspsych-progressbar-container',
  );

  if (progressBarContainer) {
    // Create a button element
    const fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = 'Fullscreen';
    fullscreenButton.className = 'fullscreen-btn';
    fullscreenButton.style.marginLeft = '10px'; // Style it as needed
    fullscreenButton.style.cursor = 'pointer';

    // Add an event listener to the button
    fullscreenButton.addEventListener('click', () => {
      const docEl = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        // Firefox
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        // Chrome, Safari, and Opera
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        // IE/Edge
        docEl.msRequestFullscreen();
      }
    });

    // Append the button to the progress bar container
    progressBarContainer.appendChild(fullscreenButton);
  }
};

const addFontSizeMenu = (
  fontSize: 'small' | 'normal' | 'large' | 'extra-large',
): void => {
  // Add dropdown when the trial starts
  const progressBar = document.getElementById('jspsych-progressbar-container');
  if (progressBar && !document.querySelector('.custom-dropdown')) {
    // Create dropdown element
    const dropdown = document.createElement('select');
    dropdown.className = 'custom-dropdown';
    dropdown.innerHTML = `
        <option value="small" ${fontSize === 'small' ? 'selected' : ''}>Small</option>
        <option value="normal" ${fontSize === 'normal' ? 'selected' : ''}>Normal</option>
        <option value="large" ${fontSize === 'large' ? 'selected' : ''}>Large</option>
        <option value="extra-large" ${fontSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
      `;
    const fontSizeTitle = document.createElement('span');
    fontSizeTitle.innerHTML = 'Font Size:';
    fontSizeTitle.style.marginLeft = '10px'; // Add some spacing
    progressBar.appendChild(fontSizeTitle);
    progressBar.appendChild(dropdown);

    // Handle dropdown change
    dropdown.addEventListener('change', (event) => {
      const { target } = event;
      const jspsychDisplayElement = document.getElementById(
        'jspsych-display-element',
      );
      if (jspsychDisplayElement && target instanceof HTMLSelectElement) {
        jspsychDisplayElement.setAttribute('data-font-size', target.value);
      }
    });
  }
};

/**
 * @function partofexp
 * @description Creates a Timeline for one half of the numerosity task experiment. Each half consists of a series of blocks where images representing different numerosities (5, 6, 7, 8) are displayed in a random order. This ensures that no identical images are shown within the same experiment.
 *
 * The Timeline includes:
 * - A black screen before stimuli presentation, with a customizable jitter duration.
 * - A crosshair displayed for 500ms before each image.
 * - A stimulus image shown for 250ms.
 * - A black screen following the image display.
 * - A survey asking participants to estimate the number of countable items (either people or objects) they observed.
 *
 * @param {JsPsych} jsPsych - The jsPsych instance used to manage the experiment Timeline.
 * @param {'people' | 'objects'} cntable - The type of countable items (either 'people' or 'objects') to be used in the experiment.
 * @param {number} nbBlocks - The number of blocks to be included in one half of the experiment.
 * @param {{ device: SerialPort | USBDevice | null, sendTriggerFunction: (device: SerialPort & USBDevice | null, trigger: string) => Promise<void> }} deviceInfo - An object containing the connected device (either `SerialPort` or `USBDevice`, or `null`) and a function to send triggers to the device.
 * @param {((device: SerialPort | null, trigger: string) => Promise<void>) | ((device: USBDevice | null, trigger: string) => Promise<void>)} sendTriggerFunction - A function that sends a trigger to the connected device, applicable to either `SerialPort` or `USBDevice`.
 *
 * @returns {Timeline} - The Timeline configuration object for one half of the numerosity task experiment.
 */
const partofexp: (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
  nbBlocks: number,
  usePhotoDiode: 'top-left' | 'top-right' | 'off',
  confidenceQuestion: boolean,
  secondBlock: boolean | undefined,
  deviceInfo: {
    device: SerialPort | USBDevice | null;
    sendTriggerFunction: (
      device: SerialPort | USBDevice | null,
      trigger: string,
    ) => Promise<void>;
  },
  blockCompleted: () => void,
) => Timeline = (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
  nbBlocks: number,
  usePhotoDiode: 'top-left' | 'top-right' | 'off',
  confidenceQuestion: boolean,
  secondBlock: boolean | undefined,
  deviceInfo: {
    device: SerialPort | USBDevice | null;
    sendTriggerFunction: (
      device: SerialPort | USBDevice | null,
      trigger: string,
    ) => Promise<void>;
  },
  blockCompleted: () => void,
): Timeline => ({
  timeline: [
    // Blackscreen before stimuli
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: '',
      choices: 'NO_KEYS',
      trial_duration: (): number =>
        1500 + jsPsych.evaluateTimelineVariable('blackscreenJitter'),
      on_start: (): void => {
        deviceInfo.sendTriggerFunction(deviceInfo.device, '0');
        document.body.style.cursor = 'none';
      },
    },
    // Crosshair shown before each image for 500ms.
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <div>
          <div class="task-img" style="display:flex; align-items:center; margin:0 auto;"><p style="font-size: 3cm; margin: auto;">+</p></div>
          <div class='photo-diode photo-diode-black ${usePhotoDiode === 'top-left' ? 'top-left' : 'top-right'} ${usePhotoDiode === 'off' ? 'photo-diode-hide' : ''}'/>
        </div>`,
      choices: 'NO_KEYS',
      trial_duration: 500,
      on_start: (): void => {
        deviceInfo.sendTriggerFunction(deviceInfo.device, '1');
        document.body.style.cursor = 'none';
      },
    },
    // Image is shown for 250ms
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus() {
        const html = `<div>
          <img class="task-img" style="margin: 0 auto;" src='./assets/num-task-imgs/${cntable}/num-${jsPsych.evaluateTimelineVariable('num')}-${jsPsych.evaluateTimelineVariable('id')}.png' alt='task image'/>
          <div class='photo-diode photo-diode-white ${usePhotoDiode === 'top-left' ? 'top-left' : 'top-right'} ${usePhotoDiode === 'off' ? 'photo-diode-hide' : ''}'/>
        </div>`;
        return html;
      },
      choices: 'NO_KEYS',
      trial_duration: 250,
      on_start: (): void => {
        deviceInfo.sendTriggerFunction(deviceInfo.device, '2');
        document.body.style.cursor = 'none';
      },
    },

    // Blackscreen after image
    {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<div class='photo-diode photo-diode-black ${usePhotoDiode === 'top-left' ? 'top-left' : 'top-right'} ${usePhotoDiode === 'off' ? 'photo-diode-hide' : ''}'/>`,
      choices: 'NO_KEYS',
      trial_duration: 1000,
      on_start: (): void => {
        deviceInfo.sendTriggerFunction(deviceInfo.device, '3');
        document.body.style.cursor = 'none';
      },
      on_finish: (): void => {
        document.body.style.cursor = 'auto';
      },
    },

    // Survey to ask how many countables (people/objects) were estimated.
    {
      type: jsPsychSurveyHtmlForm,
      preamble: `<p>${i18next.t('inputPreable', { cntable: langf.translateCountable(cntable) })}</p>`,
      html: `<input type="number" label="numerosity input" name="num-input" id="task-input" required min="0" step="1" placeholder="${i18next.t('inputPlaceholder')}"><br>`,
      autofocus: 'task-input',
      buttonLabel: i18next.t('estimateSubmitBtn'),
      on_load: (): void => {
        const input: HTMLInputElement = document.getElementById(
          'task-input',
        ) as HTMLInputElement;

        // Initially set the custom validity message
        input.setCustomValidity(i18next.t('inputInfo'));

        // Add input event listener
        input.addEventListener('input', (): void => {
          // If the input value is not empty, clear the custom validity message
          input.setCustomValidity(
            input.value === '' ? i18next.t('inputInfo') : '',
          );
        });
      },
      on_start: (): void => {
        deviceInfo.sendTriggerFunction(deviceInfo.device, '4');
      },
      on_finish(): void {
        const progressBarTotal = secondBlock ? 8 : 4;
        // eslint-disable-next-line no-param-reassign
        jsPsych.progressBar!.progress =
          Math.round(
            (jsPsych.progressBar!.progress +
              1 / (progressBarTotal * nbBlocks)) *
              1000000,
          ) / 1000000;
      },
    },
    {
      timeline: [
        {
          type: surveyLikert,
          questions: [
            {
              prompt: 'How confidence are you about your response?',
              required: true,
              labels: [
                '1 - Not Confidenct',
                '2',
                '3',
                '4',
                '5 - Very Confident',
              ],
            },
          ],
        },
      ],
      conditional_function() {
        return confidenceQuestion;
      },
    },
  ],

  // Generate random Timeline variables (pick random images for each numerosity).
  timeline_variables: generateTimelineVars(jsPsych, nbBlocks),
  sample: {
    type: 'custom',

    // Custom sampling function to produce semi-random pattern described in function description.
    fn(timelines: number[]): number[] {
      const blocks: number = timelines.length / 4;
      let template: number[] = [];
      let intermediate: number[] = [];
      let newTimelines: number[] = [];

      // Shuffle all indices for Timeline variables with same numerosity
      for (let nums: number = 0; nums < 4; nums += 1) {
        template = [...Array(blocks).keys()].map(
          (x): number => x + nums * blocks,
        );
        intermediate = intermediate.concat(
          jsPsych.randomization.shuffle(template),
        );
      }

      // Create and append block of four numerosities by picking one of each (shuffled) numerosity groups in template array.
      for (let i: number = 0; i < blocks; i += 1) {
        const block: number[] = [];
        block.push(
          intermediate[i],
          intermediate[i + blocks],
          intermediate[i + 2 * blocks],
          intermediate[i + 3 * blocks],
        );

        // Shuffle order of numerosity in a block and append.
        newTimelines = newTimelines.concat(
          jsPsych.randomization.shuffle(block),
        );
      }
      return newTimelines;
    },
  },
  on_timeline_finish() {
    blockCompleted();
  },
});

/**
 *
 * @returns Returns a simple welcome screen that automatically triggers fullscreen when the start button is pressed
 */
const getEndPage = (
  title: string,
  description: string,
  link: string,
  linkText: string,
): Timeline => ({
  type: jsPsychHtmlKeyboardResponse,
  choices: 'NO_KEYS',
  stimulus: `<div class='sd-html'><h3>${title}</h3><p>${Marked.parse(description)}</p><a class='link-to-experiment' target="_parent" href=${link}>${linkText}</a></div>`,
});

/**
 * @function run
 * @description Initializes and runs the jsPsych experiment. This function sets up the experiment, including asset preloading, device configuration, resizing, and running the numerosity task. It handles experiment setup based on user-defined parameters, such as asset paths and connection types.
 * @param {Object} params - The parameters for the experiment.
 * @param {Object} params.assetPaths - Paths to the assets required for the experiment (images, audio, video).
 * @param {any} params.input - Additional input parameters for the experiment.
 * @param {string} params.environment - The environment in which the experiment is run.
 * @param {string} params.title - The title of the experiment.
 * @param {string} params.version - The version of the experiment.
 * @returns {Promise<JsPsych>} - A promise that resolves to the initialized jsPsych instance.
 */
export async function run({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  assetPaths,
  input,
  onFinish,
}: {
  assetPaths: { images: string[]; audio: string[]; video: string[] };
  input: { settings: AllSettingsType; results: ExperimentResult };
  onFinish: (
    data: DataCollection,
    settings: AllSettingsType,
    status: StatusEnum,
  ) => void;
}): Promise<JsPsych> {
  // Parameters:
  const {
    configuration,
    duration,
    sequencing,
    language,
    photoDiodeSettings,
    nextStepSettings,
  } = input.settings;
  const blocksPerHalf: number = duration.content || 5;
  const connectType: 'Serial Port' | 'USB' | null = 'Serial Port';

  i18next.changeLanguage(language.language);

  // Pseudo state variable
  const deviceInfo: DeviceType = {
    device: null,
    sendTriggerFunction: async (
      _device: SerialPort | USBDevice | null,
      _trigger: string,
    ) => {},
  };

  // Initialize jspsych
  const jsPsych: JsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: i18next.t('progressBar'),
    display_element: 'jspsych-display-element',
    on_finish: (): void => {
      onFinish(jsPsych.data.get(), input.settings, StatusEnum.Done);
    },
  });

  // Set sequencing based on the sequencing config
  let expPartsCountables: ('people' | 'objects')[] = ['people', 'objects'];
  if (sequencing.customize) {
    switch (sequencing.firstBlock) {
      case 'persons':
        expPartsCountables = ['people', 'objects'];
        break;
      case 'objects':
        expPartsCountables = ['objects', 'people'];
        break;
      case 'random':
      default:
        expPartsCountables = jsPsych.randomization.shuffle(expPartsCountables);
    }
  } else {
    expPartsCountables = jsPsych.randomization.shuffle(expPartsCountables);
  }

  if (configuration.fontSize) {
    const jspsychDisplayElement = document.getElementById(
      'jspsych-display-element',
    );
    if (jspsychDisplayElement) {
      jspsychDisplayElement.setAttribute(
        'data-font-size',
        configuration.fontSize,
      );
    }
  }

  // Initiate Timeline
  const timeline: Timeline = [];

  // Push trials to Timeline
  // 1. Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: generatePreloadStrings(),
    on_load() {
      addFontSizeMenu(configuration.fontSize);
      addFullscreenButton();
    },
  });

  // Add FullScreen Plugin
  timeline.push(fullScreenPlugin(jsPsych));

  // 2. Add Device Connect pages
  if (connectType && !configuration.skipDevice) {
    timeline.push(
      deviceConnectPages(
        jsPsych,
        deviceInfo,
        connectType,
        configuration.forceDevice,
      ),
    );
  }

  if (photoDiodeSettings.usePhotoDiode !== 'off') {
    const photoDiodeElement = document.createElement('div');
    photoDiodeElement.id = 'photo-diode-element';
    photoDiodeElement.className = `photo-diode photo-diode-black ${photoDiodeSettings.usePhotoDiode} ${photoDiodeSettings.testPhotoDiode ? 'photo-diode-test' : ''}`;
    document
      .getElementById('jspsych-display-element')
      ?.appendChild(photoDiodeElement);
    if (photoDiodeSettings.usePhotoDiode === 'customize') {
      const left = photoDiodeSettings.photoDiodeLeft;
      const top = photoDiodeSettings.photoDiodeTop;
      const width = photoDiodeSettings.photoDiodeWidth;
      const height = photoDiodeSettings.photoDiodeHeight;
      if (photoDiodeElement && left && top && width && height) {
        photoDiodeElement.style.setProperty('--photodiode-left', left);
        photoDiodeElement.style.setProperty('--photodiode-top', top);
        photoDiodeElement.style.setProperty('--photodiode-width', width);
        photoDiodeElement.style.setProperty('--photodiode-height', height);
      }
    }
  }

  if (configuration.hardImageSize) {
    setHardCodedSizes(configuration.hardImageSize);
  } else if (configuration.skipCalibration) {
    setSizes(1);
  } else {
    timeline.push(resize(jsPsych));
  }

  if (!sequencing.customize || sequencing.instructionsFirst) {
    timeline.push(
      groupInstructions(
        jsPsych,
        expPartsCountables[0],
        configuration.continueButtonDelay,
      ),
      tipScreen(),
    );
  }

  const hasSecondBlock = sequencing.secondBlock || !sequencing.customize;

  timeline.push(
    createButtonPage(
      i18next.t('experimentStart'),
      i18next.t('experimentStartBtn'),
    ),
    partofexp(
      jsPsych,
      expPartsCountables[0],
      blocksPerHalf,
      configuration.usePhotoDiode,
      configuration.addConfidenceQuestion,
      hasSecondBlock,
      deviceInfo,
      () => {
        onFinish(
          jsPsych.data.get(),
          input.settings,
          hasSecondBlock ? StatusEnum.Block2 : StatusEnum.Done,
        );
      },
    ),
  );
  if (hasSecondBlock) {
    timeline.push(
      createButtonPage(i18next.t('firstHalfEnd'), i18next.t('resizeBtn')),
    );
    if (sequencing.instructionsSecond || !sequencing.customize) {
      timeline.push(
        groupInstructions(
          jsPsych,
          expPartsCountables[1],
          configuration.continueButtonDelay,
        ),
        tipScreen(),
      );
    }
    timeline.push(
      createButtonPage(
        i18next.t('experimentStart'),
        i18next.t('experimentStartBtn'),
      ),
      partofexp(
        jsPsych,
        expPartsCountables[1],
        blocksPerHalf,
        configuration.usePhotoDiode,
        configuration.addConfidenceQuestion,
        hasSecondBlock,
        deviceInfo,
        () => {
          onFinish(jsPsych.data.get(), input.settings, StatusEnum.Done);
        },
      ),
    );
  }

  if (nextStepSettings.linkToNextPage) {
    timeline.push({
      ...getEndPage(
        nextStepSettings.title,
        nextStepSettings.description,
        nextStepSettings.link,
        nextStepSettings.linkText,
      ),
      on_load() {
        onFinish(jsPsych.data.get(), input.settings, StatusEnum.Done);
      },
    });
  } else {
    timeline.push({
      ...getEndPage(
        i18next.t('endMessage'),
        i18next.t('endMessageDescription'),
        '',
        '',
      ),
      on_load() {
        onFinish(jsPsych.data.get(), input.settings, StatusEnum.Done);
      },
    });
  }

  await jsPsych.run(timeline);

  document
    .getElementsByClassName('jspsych-content-wrapper')[0]
    .setAttribute('style', 'overflow-x: hidden;');

  if (jsPsych.data.get().last(2).values()[0].trialType === 'quit-survey') {
    showEndScreen(i18next.t('abortedMessage'));
  } else if (!nextStepSettings.linkToNextPage) {
    showEndScreen(i18next.t('endMessage'));
  }

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
