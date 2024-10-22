import HtmlButtonResponsePlugin from '@jspsych/plugin-html-button-response';

// Type aliases
type ButtonTrial = {
  type: typeof HtmlButtonResponsePlugin;
  stimulus: string;
  choices: string[];
  on_finish: () => void;
};

/**
 * @function activateMQCunderline
 * @description Adds an underline to the selected response in a multiple-choice survey by adding the 'underlined' class to the clicked element. Removes the underline from other elements.
 */
export function activateMQCunderline(): void {
  const responses: NodeListOf<Element> = document.querySelectorAll(
    '.jspsych-survey-multi-choice-text',
  );

  responses.forEach((response) =>
    response.addEventListener('click', () => {
      responses.forEach((response2) =>
        response2.classList.remove('underlined'),
      );
      response.classList.add('underlined');
    }),
  );
}

/**
 * @function createButtonPage
 * @description Creates a button trial object for use in jsPsych, with a stimulus text and a single button choice.
 * @param {string} pageText - The text to display on the page.
 * @param {string} btnText - The text to display on the button.
 * @returns {ButtonTrial} - An object containing the trial configuration.
 */
export function createButtonPage(
  pageText: string,
  btnText: string,
): ButtonTrial {
  return {
    type: HtmlButtonResponsePlugin,
    stimulus: `<b>${pageText}</b><br><br>`,
    choices: [btnText],
    on_finish: () => {
      const jsPsychContent = document.querySelector('.jspsych-content');
      if (jsPsychContent) {
        if (!jsPsychContent.classList.contains('test-phase')) {
          // If currently in the instruction phase, switch to the test phase
          jsPsychContent.classList.add('test-phase');
        } else {
          jsPsychContent.classList.remove('test-phase');
        }
      }
    },
  };
}

/**
 * @function connectToSerial
 * @description Prompts the user to select a serial port and then opens it with specified settings.
 * @returns {Promise<SerialPort | null>} - A Promise that resolves to the connected SerialPort object or null if the connection fails.
 */
export async function connectToSerial(): Promise<SerialPort | null> {
  try {
    // Request a serial port from the user
    const port: SerialPort = await navigator.serial.requestPort();

    // Open the serial port with desired settings
    await port.open({ baudRate: 9600 }); // Adjust baudRate as needed

    // eslint-disable-next-line no-console
    console.log('Serial Port Opened');
    return port;
  } catch (error) {
    console.error('Serial Port Connection Error:', error);
    return null;
  }
}

/**
 * @function connectToUSB
 * @description Prompts the user to select a USB device and then connects to it with specified settings.
 * @returns {Promise<USBDevice | null>} - A Promise that resolves to the connected USBDevice object or null if the connection fails.
 */
export async function connectToUSB(): Promise<USBDevice | null> {
  try {
    const device: USBDevice = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x2341, productId: 0x8037 }], // Replace with your device's vendorId and productId
    });

    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);

    return device;
  } catch (error) {
    console.error('USB Connection Error:', error);
    return null;
  }
}

/**
 * @function sendTriggerToSerial
 * @description Sends a trigger string to the connected serial port.
 * @param {SerialPort | null} device - The connected serial port device.
 * @param {string} trigger - The trigger string to send.
 * @returns {Promise<void>} - A Promise that resolves when the trigger has been sent.
 */
export async function sendTrigger(
  device: SerialPort | USBDevice | null,
  trigger: string,
): Promise<void> {
  try {
    if (device) {
      if (device instanceof SerialPort) {
        const writer: WritableStreamDefaultWriter<Uint8Array> =
          device.writable!.getWriter();
        const encoder: TextEncoder = new TextEncoder();
        await writer.write(encoder.encode(trigger));
        // eslint-disable-next-line no-console
        console.log('Trigger sent:', trigger);
        writer.releaseLock();
      } else if (device instanceof USBDevice) {
        const encoder: TextEncoder = new TextEncoder();
        await device.transferOut(1, encoder.encode(trigger));
        // eslint-disable-next-line no-console
        console.log('Trigger sent:', trigger);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(`No device connected. Tried to send ${trigger}`);
    }
  } catch (error) {
    console.error('Failed to send trigger:', error);
  }
}
