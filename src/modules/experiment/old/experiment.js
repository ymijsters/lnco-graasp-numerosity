/* eslint-disable */

/**
 * @title Numerosity
 * @description Social numerosity task.
 * @version 0.1.0
 *
 * @assets assets/
 */
// You can import stylesheets (.scss or .css).
// Import required plugins and modules from jsPsych
import i18next from './i18n';
import { initJsPsych } from 'jspsych';

import FullscreenPlugin from '@jspsych/plugin-fullscreen';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import PreloadPlugin from '@jspsych/plugin-preload';
import jsPsychSurveyHtmlForm from '@jspsych/pl../jspsych/instructionsml-form';
../jspsych/quit
// Import styles../jspsych/quit
import '../../styles/main.scss';../jspsych/setup
import { groupInstructions, tipScreen } from './instructions';../jspsych/utils
import { quitBtnAction, showEndScreen } from './quit';
import { generatePreloadStrings, resize } from './setup';
import { connectToUSB, createButtonPage, sendTriggerToUSB } from './utils';
/**
 * @function generateTimelineVars
 * @description Generate timeline variables for the experiment.
 * For each numerosity, "nb_block" images are randomly selected and put in a list ordered by numerosity.
 * @param { JsPsych } JsPsych - The jsPsych instance
 * @param { number } nb_blocks - Number of blocks per numerosity
 * @returns { img_description[] } - Array of image descriptions
 */
function generateTimelineVars(JsPsych, nb_blocks) {
    const timeline_variables = [];
    for (let num = 5; num <= 8; num++) {
        const id_list = JsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], nb_blocks);
        for (let i = 0; i < nb_blocks; i++) {
            timeline_variables.push({
                num: num,
                id: id_list[i],
                bs_jitter: (Math.random() - 0.5) * 300,
            });
        }
    }
    return timeline_variables;
}
/**
 * @function partofexp
 * @description Timeline for one half of the numerosity task.
 * The order of stimuli correspond to the following pattern:
 * There are "nb_blocks" blocks consisting of a random image from each numerosity (5,6,7,8) in random order.
 * Two identical images will never be contained in one experiment.
 * @param { JsPsych } jsPsych - The jsPsych instance
 * @param { 'people' | 'objects' } cntable - The type of countable (people or objects)
 * @param { number } nb_blocks - Number of blocks per half
 * @returns { timeline } - Timeline for one half of the numerosity task
 */
const partofexp = (jsPsych, cntable, nb_blocks, devices_out) => ({
    timeline: [
        // Blackscreen before stimuli
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '',
            choices: 'NO_KEYS',
            trial_duration: () => 1500 + jsPsych.evaluateTimelineVariable('bs_jitter'),
            on_start: () => {
                sendTriggerToUSB(devices_out.usb_device, '0');
                document.body.style.cursor = 'none';
            },
        },
        // Crosshair shown before each image for 500ms.
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<p style="font-size: 3cm;">+</p>',
            choices: 'NO_KEYS',
            trial_duration: 500,
            on_start: () => {
                sendTriggerToUSB(devices_out.usb_device, '1');
                document.body.style.cursor = 'none';
            },
        },
        // Image is shown for 250ms
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function () {
                return `<img src='../assets/num-task-imgs/${cntable}/num-${jsPsych.evaluateTimelineVariable('num')}-${jsPsych.evaluateTimelineVariable('id')}.png' alt='task image'>`;
            },
            choices: 'NO_KEYS',
            trial_duration: 250,
            on_start: () => {
                sendTriggerToUSB(devices_out.usb_device, '2');
                document.body.style.cursor = 'none';
            },
        },
        // Blackscreen after image
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '',
            choices: 'NO_KEYS',
            trial_duration: 1000,
            on_start: () => {
                sendTriggerToUSB(devices_out.usb_device, '3');
                document.body.style.cursor = 'none';
            },
            on_finish: () => {
                document.body.style.cursor = 'auto';
            },
        },
        // Survey to ask how many countables (people/objects) were estimated.
        {
            type: jsPsychSurveyHtmlForm,
            preamble: `How many ${cntable} were in the virtual room?`,
            html: `<input type="number" label="numerosity input" name="num-input" id="task-input" required min="0" step="1" placeholder="${i18next.t('inputPlaceholder')}"><br>`,
            autofocus: 'task-input',
            button_label: i18next.t('estimateSubmitBtn'),
            on_load: () => {
                document
                    .getElementById('jspsych-survey-html-form')
                    .addEventListener('submit', () => sendTriggerToUSB(devices_out.usb_device, '5'));
                const input = document.getElementById('task-input');
                // Initially set the custom validity message
                input.setCustomValidity(i18next.t('inputInfo'));
                // Add input event listener
                input.addEventListener('input', () => {
                    // If the input value is not empty, clear the custom validity message
                    input.setCustomValidity(input.value === '' ? i18next.t('inputInfo') : '');
                });
            },
            on_start: () => {
                sendTriggerToUSB(devices_out.usb_device, '4');
            },
            on_finish: function () {
                jsPsych.progressBar.progress =
                    Math.round((jsPsych.progressBar.progress + 1 / (8 * nb_blocks)) * 1000000) / 1000000;
            },
        },
    ],
    // Generate random timeline variables (pick random images for each numerosity).
    timeline_variables: generateTimelineVars(jsPsych, nb_blocks),
    sample: {
        type: 'custom',
        // Custom sampling function to produce semi-random pattern described in function description.
        fn: function (t) {
            const blocks = t.length / 4;
            let template = [];
            let intermediate = [];
            let new_t = [];
            // Shuffle all indices for timeline variables with same numerosity
            for (let nums = 0; nums < 4; nums++) {
                template = [...Array(blocks).keys()].map((x) => x + nums * blocks);
                intermediate = intermediate.concat(jsPsych.randomization.shuffle(template));
            }
            // Create and append block of four numerosities by picking one of each (shuffled) numerosity groups in template array.
            for (let i = 0; i < blocks; i++) {
                const block = [];
                block.push(intermediate[i], intermediate[i + blocks], intermediate[i + 2 * blocks], intermediate[i + 3 * blocks]);
                // Shuffle order of numerosity in a block and append.
                new_t = new_t.concat(jsPsych.randomization.shuffle(block));
            }
            return new_t;
        },
    },
});
/**
 * @function run
 * @description This function will be executed by jsPsych Builder and is expected to run the jsPsych experiment.
 * Initializes jsPsych, sets up the timeline, and runs the experiment.
 * @returns { Promise<JsPsych> } - Promise resolving to the jsPsych instance
 */
export async function run({ assetPaths, input, environment, title, version, onFinish }) {
    let devices = { usb_device: null };

    console.log(`In ExperimentTS input ${input}`);

    const blocks_per_half = input.trialsPerHalf || 1;
  
    console.log(`In ExperimentTS blocks per half setting ${blocks_per_half}`);    
    const jsPsych = initJsPsych({
        show_progress_bar: true,
        auto_update_progress_bar: false,
        message_progress_bar: i18next.t('progressBar'),
        display_element: 'jspsych-content',
        on_finish: () => {
            const resultData = jsPsych.data.get();
            onFinish(resultData, blocks_per_half);        
        },
    });
    const timeline = [];
    // Preload assets
    timeline.push({
        type: PreloadPlugin,
        images: generatePreloadStrings(),
        info: {
            name: 'PreloadPlugin',
            version: '8.0.1',
            data: {},
        },
    });

    // Switch to fullscreen
    timeline.push({
        type: FullscreenPlugin,
        fullscreen_mode: true,
        message: '<button class="jspsych-btn" id="init-btn">initiate USB</button><br><br>',
        button_label: i18next.t('fullscreen'),
        info: {
            name: 'FullscreenPlugin',
            version: '8.0.1',
            data: {},
        },
        on_load: function () {
            const quit_btn = document.createElement('button');
            quit_btn.setAttribute('type', 'button');
            quit_btn.setAttribute('style', 'color: #fff; border-radius: 4px; background-color: #1d2124; border-color: #171a1d; position: absolute; right: 1%; top: 50%; transform: translateY(-50%)');
            quit_btn.addEventListener('click', () => quitBtnAction(jsPsych));
            quit_btn.appendChild(document.createTextNode(i18next.t('quitBtn')));
            document
                .getElementById('jspsych-progressbar-container')
                .appendChild(quit_btn);
            document
                .getElementById('init-btn')
                .addEventListener('click', async () => {
                devices.usb_device = await connectToUSB();
            });
            resize();
        },
    });
    // Randomize order of countables
    let exp_parts_cntables = ['people', 'objects'];
    exp_parts_cntables = jsPsych.randomization.shuffle(exp_parts_cntables);
    // Run numerosity task
    timeline.push(groupInstructions(jsPsych, exp_parts_cntables[0]), tipScreen(), createButtonPage(i18next.t('experimentStart'), i18next.t('experimentStartBtn')), partofexp(jsPsych, exp_parts_cntables[0], blocks_per_half, devices), createButtonPage(i18next.t('firstHalfEnd'), i18next.t('resizeBtn')), groupInstructions(jsPsych, exp_parts_cntables[1]), tipScreen(), createButtonPage(i18next.t('experimentStart'), i18next.t('experimentStartBtn')), partofexp(jsPsych, exp_parts_cntables[1], blocks_per_half, devices));
    await jsPsych.run(timeline);
    document
        .getElementsByClassName('jspsych-content-wrapper')[0]
        .setAttribute('style', 'overflow-x: hidden;');
    if (jsPsych.data.get().last(2).values()[0].trial_type === 'quit-survey') {
        showEndScreen(i18next.t('abortedMessage'));
    }
    else {
        showEndScreen(i18next.t('endMessage'));
    }
    // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
    // if you handle results yourself, be it here or in `on_finish()`)
    return jsPsych;
}
