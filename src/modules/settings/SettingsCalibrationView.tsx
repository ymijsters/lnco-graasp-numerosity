import jsPsychSurveyHtmlForm from '@jspsych/plugin-survey-html-form';
import i18next from 'i18next';
import { DataCollection, JsPsych, initJsPsych } from 'jspsych';

import { AllSettingsType } from '../context/SettingsContext';
import { Timeline } from '../experiment/jspsych/experiment';

/**
 * @function resize
 * @description Generates the resize timeline for the experiment with calibration and quit button.
 * @returns {timeline} - The timeline object for resizing.
 */
export const calibrationResize: () => Timeline = (): Timeline => ({
  timeline: [
    {
      type: jsPsychSurveyHtmlForm,
      preamble: ` <div class="resize-page"> 
                      <h3>${i18next.t('barResizeTitle')}</h3>
                      <p style="text-align: center;">${i18next.t('barResizeInstructions')}</p>
                      <br>
                      <div id="resize-bar"></div>
                      <br>
                    </div>`,
      html: `
                  <div class='bar-size-input-field'>
                    <labelfor="cm-bar-input">${i18next.t('barResizeInputLabel')}</label>
                    <input name="input" id="cm-bar-input" type="number" min="0.001" step="0.001" placeholder="cm" required style="font-size: larger; margin-left: 5%; width: 30%;">
                  </div>
  `,
      autofocus: 'cm-bar-input',
      button_label: i18next.t('resizeBtn'),
    },
  ],
});

/**
 * @function run
 * @description Initializes and runs the jsPsych experiment. This function sets up the experiment, including asset preloading, device configuration, resizing, and running the numerosity task. It handles experiment setup based on user-defined parameters, such as asset paths and connection types.
 * @param {any} params.input - Additional input parameters for the experiment.
 * @returns {Promise<JsPsych>} - A promise that resolves to the initialized jsPsych instance.
 */
export async function run({
  input,
  onFinish,
}: {
  input: AllSettingsType;
  onFinish: (data: DataCollection) => void;
}): Promise<JsPsych> {
  // Initialize jspsych
  const jsPsych: JsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    display_element: 'calibration-div',
    on_finish: (): void => {
      onFinish(jsPsych.data.get());
    },
  });

  if (input.configuration.fontSize) {
    const jspsychDisplayElement = document.getElementById('calibration-div');
    if (jspsychDisplayElement) {
      jspsychDisplayElement.setAttribute(
        'data-font-size',
        input.configuration.fontSize,
      );
    }
  }

  // Initiate Timeline
  const timeline: Timeline = [];

  timeline.push(calibrationResize());

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
