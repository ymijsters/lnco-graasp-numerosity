// You can import stylesheets (.scss or .css).
// Import required plugins and modules from jsPsych
import i18next from 'i18next';
import { JsPsych } from 'jspsych';

import { activateMQCunderline } from './utils';

/**
 * @function generateQuitSurvey
 * @description Generates the HTML for the quit survey with options and a form.
 * @returns {string} - The HTML string for the quit survey.
 */
function generateQuitSurvey(): string {
  return `
    <div class="quit-survey-content">
      <div style="position: relative;">
        <h3>${i18next.t('quitSurveyPreamble')}</h3>
        <button id="quit-close-btn" class="jspsych-btn">${i18next.t('quitSurveyBtnClose')}</button>
      </div>
      <br>
      <form id="quit-form">
        <div>
          <label><b>${i18next.t('quitSurveyPrompt')}</b></label>
        </div>
        ${(i18next.t('quitSurveyOptions', { returnObjects: true }) as string[])
          .map(
            (option, index) =>
              `<div class="jspsych-survey-multi-choice-text"><input type="radio" name="quit-option" value="${index}" id="option-${index}" required><label for="option-${index}">${option}</label></div>`,
          )
          .join('')}
        <div align="center">
          <input type="submit" class="jspsych-btn" id="quit-end-btn" value="${i18next.t('quitSurveyBtnEnd')}">
        </div>
      </form>
    </div>`;
}

/**
 * @function showEndScreen
 * @description Creates and displays an end screen overlay with a given message. If the document is in fullscreen mode, it exits fullscreen.
 * @param {string} message - The message to be displayed on the end screen.
 */
export function showEndScreen(message: string): void {
  const screen: HTMLElement = document.createElement('div');

  screen.classList.add('custom-overlay');
  screen.innerHTML = `<h2 style="text-align: center; top: 50%;">${message}</h2>`;
  document.getElementById('jspsych-content')?.appendChild(screen);
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

/**
 * @function quitBtnAction
 * @description Creates and displays the quit survey form when the quit button is clicked.
 * This includes handling form submission, validation, and the close button action.
 * @param { JsPsych } jsPsych - The JsPsych instance.
 */
export function quitBtnAction(jsPsych: JsPsych): void {
  jsPsych.pauseExperiment();
  const panel: HTMLElement = document.createElement('div');

  panel.id = 'quit-overlay';
  panel.classList.add('custom-overlay');
  panel.innerHTML = generateQuitSurvey();
  document.getElementById('jspsych-content')?.appendChild(panel);
  document.body.style.cursor = 'auto';
  panel.style.top = `${document.getElementById('jspsych-progressbar-container')!.offsetHeight + 1}px`;
  panel.style.zIndex = '2';

  const form: HTMLFormElement = document.getElementById(
    'quit-form',
  ) as HTMLFormElement;

  const options: NodeListOf<HTMLInputElement> = form.querySelectorAll(
    'input[name="quit-option"]',
  ) as NodeListOf<HTMLInputElement>;
  options.forEach((option) => {
    option.addEventListener('invalid', () => {
      option.setCustomValidity(i18next.t('quitSurveyInputInfo'));
    });
  });
  activateMQCunderline();

  document.getElementById('quit-close-btn')!.addEventListener('click', () => {
    document.getElementById('jspsych-content')?.removeChild(panel);
    jsPsych.resumeExperiment();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  });

  document.getElementById('quit-end-btn')!.addEventListener('click', () => {
    const selectedOption: HTMLElement = document.querySelector(
      'input[name="quit-option"]:checked',
    )!;
    if (selectedOption) {
      options.forEach((option) => {
        option.setCustomValidity('');
      });

      // Save the selected value to jsPsych data
      jsPsych.data.get().push({
        trialType: 'quit-survey',
        quitReason: (selectedOption as HTMLInputElement).value,
      });

      document.getElementById('jspsych-content')?.removeChild(panel);

      showEndScreen('You quit the experiment');

      // End the experiment
      jsPsych.abortExperiment();
    }
  });
}
