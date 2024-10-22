import HtmlButtonResponsePlugin from '@jspsych/plugin-html-button-response';
import jsPsychinstructions from '@jspsych/plugin-instructions';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import i18next from 'i18next';
import { DataCollection, JsPsych } from 'jspsych';

// Import styles and language functions
import { type Timeline } from './experiment.js';
import * as langf from './languages.js';
import { activateMQCunderline } from './utils.js';

/**
 * @function generateInputExample
 * @description Generates an HTML string for an example input screen used in the instructions.
 * @param {'people' | 'objects'} cntable - The type of countable (people or objects).
 * @returns {string} - An HTML string representing the example input screen.
 */
const generateInputExample: (cntable: 'people' | 'objects') => string = (
  cntable: 'people' | 'objects',
) =>
  `
      <img class="inst-monitor" src="./assets/instruction-media/monitor-crosshair.png" alt="computer monitor pictogram">
      <div class="inst-screen input-example">
        <div class="input-content">
          <p>${i18next.t('instructionScreenExample', { cntable: langf.translateCountable(cntable) })}</p>
          <input type="number" readonly>
          <button class="jspsych-btn" style="pointer-events: none; padding: 2%;" readonly>${i18next.t('estimateSubmitBtn')}</button>
        </div>
      </div>`;

/**
 * @function generateInstructionPages
 * @description Generate instruction pages based on the type of countable (people/objects).
 * If example is true, it generates the example page with a video.
 * @param { 'people' | 'objects' } cntable - The type of countable (people or objects)
 * @returns { string[] } - Array of instruction pages as HTML strings
 */
function generateInstructionPages(cntable: 'people' | 'objects'): string[] {
  const instructionImages: string[] = [
    `
    <img class="inst-monitor" src="./assets/instruction-media/monitor-crosshair.png" alt="computer monitor pictogram">`,
    `
    <img class="inst-monitor" src="./assets/instruction-media/monitor-crosshair.png" alt="computer monitor pictogram">
    <img class="inst-screen" src="./assets/instruction-media/screen-${cntable}.png" alt='task image'>`,
    generateInputExample(cntable),
  ];

  const pages: string[] = [];
  for (let pageNumber: number = 0; pageNumber < 3; pageNumber += 1) {
    pages.push(
      `          
      <h3>${i18next.t('instructionTitle')}</h3>
      <div class="inst-container">
        <div class="inst-graphic">
          ${instructionImages[pageNumber]}
        </div>
          <p class="inst-text"><b>${i18next.t('instructionTexts', { returnObjects: true, cntable: langf.translateCountable(cntable) })[pageNumber]}</b></p>
      </div>`,
    );
  }
  pages.push(
    `         
    <h3>${i18next.t('instructionTitle')}</h3>
    <div class="inst-container">
      <div class="inst-graphic">
        <div class="group-monitors"">
          ${instructionImages[0]}
        </div>
        <div class="group-monitors"">
          ${instructionImages[1]}
        </div>
        <div class="group-monitors"">
          ${generateInputExample(cntable)}
        </div>
      </div>
      <p class="inst-text"><b>${i18next.t('instructionTexts', { returnObjects: true })[3]}</b></p>
    </div>`,
  );
  pages.push(
    `
        <h3>${i18next.t('instructionTitle')}</h3>
        <div class="inst-container">
          <div class="inst-graphic">
            ${instructionImages[2]}
          </div>
            <p class="inst-text"><b>${i18next.t('instructionTexts', { returnObjects: true, cntable: langf.translateCountable(cntable) })[4]}</b></p>
        </div>`,
  );
  pages.push(
    `
    <h3>${i18next.t('instructionTitle')}</h3>
    <div class="inst-container">
      <div class="inst-graphic"> 
        <video muted autoplay loop preload="auto" src="./assets/instruction-media/${cntable}-vid.mp4" style="height: 45vh;">
          <source type="video/mp4"></source>
        </video>
      </div>
      <p class="inst-text">${i18next.t('instructionExample', { cntable: langf.translateCountable(cntable) })}</p>
    </div>`,
  );
  return pages;
}

/**
 * @function instructions
 * @description Create instruction timeline based on the type of countable.
 * Combines both text and example (video) instructions.
 * @param { 'people' | 'objects' } cntable - The type of countable (people or objects)
 * @returns { Timeline } - Timeline for instructions
 */
function instructions(cntable: 'people' | 'objects'): Timeline {
  return {
    timeline: [
      {
        type: jsPsychinstructions,
        pages: generateInstructionPages(cntable),
        button_label_next: i18next.t('instructionBtnNext'),
        button_label_previous: i18next.t('instructionBtnPrevious'),
        show_clickable_nav: true,
      },
    ],
  };
}

/**
 * @function instructionQuiz
 * @description Instruction quiz timeline with looping functionality until correct answers are given.
 * @param { 'people' | 'objects' } cntable - The type of countable (people or objects)
 * @returns { timeline } - Timeline for instruction quiz
 */
const instructionQuiz: (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
  secondHalf?: boolean,
) => Timeline = (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
): Timeline => ({
  timeline: [
    {
      type: jsPsychSurveyMultiChoice,
      questions: langf.quizQuestions(cntable),
      preamble: `<b>${i18next.t('quizPreamble')}</b><br><br><button id="quiz-repeat-btn" class="jspsych-btn">${i18next.t('repeatInstructions')}</button>`,
      button_label: i18next.t('estimateSubmitBtn'),
    },
  ],
  on_load: (): void => {
    // make repeat instruction button fulfill its function
    document
      .getElementById('quiz-repeat-btn')!
      .addEventListener('click', (): void => {
        jsPsych.finishTrial({
          response: { Q0: 'read-again' },
        });
      });

    // make selected choice underlined
    activateMQCunderline();
  },
});

/**
 * @function returnPage
 * @description Generates a timeline object for displaying a return page based on the specified countable type.
 * The return page is conditional based on the user's previous response.
 * @param {JsPsych} jsPsych - The jsPsych instance.
 * @param {'people' | 'objects'} cntable - The type of countable (people or objects).
 * @returns {timeline} - An object representing the timeline for the return page.
 */
const returnPage: (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
) => Timeline = (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
): Timeline => ({
  timeline: [
    {
      type: HtmlButtonResponsePlugin,
      stimulus: `<p><b>${i18next.t('repeatInstructions')}</b></p>`,
      choices: [i18next.t('repeatInstructions')],
    },
  ],
  conditional_function(): boolean {
    return (
      jsPsych.data.getLastTimelineData().values()[0].response.Q0 !==
        'read-again' &&
      jsPsych.data.getLastTimelineData().values()[0].response.Q0 !==
        langf.quizQuestions(cntable)[0].options[2]
    );
  },
});

/**
 * @function groupInstructions
 * @description Generates a timeline object for displaying group instructions including the instruction text,
 * instruction quiz, and return page based on the countable type and experiment phase.
 * @param {JsPsych} jsPsych - The jsPsych instance.
 * @param {'people' | 'objects'} cntable - The type of countable (people or objects).
 * @param {boolean} [secondHalf=false] - Indicates if it is the second half of the experiment.
 * @returns {Timeline} - An object representing the timeline for the group instructions.
 */
export const groupInstructions: (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
  secondHalf?: boolean,
) => Timeline = (
  jsPsych: JsPsych,
  cntable: 'people' | 'objects',
  secondHalf: boolean = false,
): Timeline => ({
  timeline: [
    instructions(cntable),
    instructionQuiz(jsPsych, cntable, secondHalf),
    returnPage(jsPsych, cntable),
  ],
  loop_function(data: DataCollection): boolean {
    return (
      data.last(2).values()[1].response.Q0 !==
      langf.quizQuestions(cntable)[0].options[2]
    );
  },
  on_finish: (): void => {
    // eslint-disable-next-line no-param-reassign
    jsPsych.getDisplayElement().innerHTML = '';
  },
});

/**
 * @function tipScreen
 * @description Generates a timeline object for displaying a tip screen.
 * @returns {timeline} - An object representing the timeline for the tip screen.
 */
export function tipScreen(): Timeline {
  return {
    timeline: [
      {
        type: HtmlButtonResponsePlugin,
        stimulus: `<b>${i18next.t('tipTitle')}</b><br><img src="./assets/instruction-media/tip.png" alt='tip image' style="width: 20vw;"><br>${i18next.t('tipDescription')}<br><br>`,
        choices: [i18next.t('tipBtnTxt')],
      },
    ],
  };
}
