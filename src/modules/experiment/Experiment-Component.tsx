import { FC, useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { DataCollection, JsPsych } from 'jspsych';

import '../../styles/main.scss';
import { StatusEnum } from '../config/appResults';
import useExperimentResults from '../context/ExperimentContext';
import { AllSettingsType, useSettings } from '../context/SettingsContext';
import { run } from './jspsych/experiment';

export const Experiment: FC = () => {
  const jsPsychRef = useRef<null | Promise<JsPsych>>(null);
  const [experimentStarted, setExperimentStarted] = useState<boolean>(false);
  const [experimentDone, setExperimentDone] = useState<boolean>(false);
  const settings = useSettings();

  const { status, experimentResultsAppData, setExperimentResult } =
    useExperimentResults();

  const assetPath = {
    images: [
      'assets/instruction-media/monitor-crosshair.png',
      'assets/instruction-media/screen-objects.png',
      'assets/instruction-media/screen-people.png',
      'assets/instruction-media/tip-org.png',
      'assets/instruction-media/tip.png',
      'assets/num-task-imgs/objects/num-5-0.png',
      'assets/num-task-imgs/objects/num-5-1.png',
      'assets/num-task-imgs/objects/num-5-2.png',
      'assets/num-task-imgs/objects/num-5-3.png',
      'assets/num-task-imgs/objects/num-5-4.png',
      'assets/num-task-imgs/objects/num-5-5.png',
      'assets/num-task-imgs/objects/num-5-6.png',
      'assets/num-task-imgs/objects/num-5-7.png',
      'assets/num-task-imgs/objects/num-5-8.png',
      'assets/num-task-imgs/objects/num-5-9.png',
      'assets/num-task-imgs/objects/num-6-0.png',
      'assets/num-task-imgs/objects/num-6-1.png',
      'assets/num-task-imgs/objects/num-6-2.png',
      'assets/num-task-imgs/objects/num-6-3.png',
      'assets/num-task-imgs/objects/num-6-4.png',
      'assets/num-task-imgs/objects/num-6-5.png',
      'assets/num-task-imgs/objects/num-6-6.png',
      'assets/num-task-imgs/objects/num-6-7.png',
      'assets/num-task-imgs/objects/num-6-8.png',
      'assets/num-task-imgs/objects/num-6-9.png',
      'assets/num-task-imgs/objects/num-7-0.png',
      'assets/num-task-imgs/objects/num-7-1.png',
      'assets/num-task-imgs/objects/num-7-2.png',
      'assets/num-task-imgs/objects/num-7-3.png',
      'assets/num-task-imgs/objects/num-7-4.png',
      'assets/num-task-imgs/objects/num-7-5.png',
      'assets/num-task-imgs/objects/num-7-6.png',
      'assets/num-task-imgs/objects/num-7-7.png',
      'assets/num-task-imgs/objects/num-7-8.png',
      'assets/num-task-imgs/objects/num-7-9.png',
      'assets/num-task-imgs/objects/num-8-0.png',
      'assets/num-task-imgs/objects/num-8-1.png',
      'assets/num-task-imgs/objects/num-8-2.png',
      'assets/num-task-imgs/objects/num-8-3.png',
      'assets/num-task-imgs/objects/num-8-4.png',
      'assets/num-task-imgs/objects/num-8-5.png',
      'assets/num-task-imgs/objects/num-8-6.png',
      'assets/num-task-imgs/objects/num-8-7.png',
      'assets/num-task-imgs/objects/num-8-8.png',
      'assets/num-task-imgs/objects/num-8-9.png',
      'assets/num-task-imgs/people/num-5-0.png',
      'assets/num-task-imgs/people/num-5-1.png',
      'assets/num-task-imgs/people/num-5-2.png',
      'assets/num-task-imgs/people/num-5-3.png',
      'assets/num-task-imgs/people/num-5-4.png',
      'assets/num-task-imgs/people/num-5-5.png',
      'assets/num-task-imgs/people/num-5-6.png',
      'assets/num-task-imgs/people/num-5-7.png',
      'assets/num-task-imgs/people/num-5-8.png',
      'assets/num-task-imgs/people/num-5-9.png',
      'assets/num-task-imgs/people/num-6-0.png',
      'assets/num-task-imgs/people/num-6-1.png',
      'assets/num-task-imgs/people/num-6-2.png',
      'assets/num-task-imgs/people/num-6-3.png',
      'assets/num-task-imgs/people/num-6-4.png',
      'assets/num-task-imgs/people/num-6-5.png',
      'assets/num-task-imgs/people/num-6-6.png',
      'assets/num-task-imgs/people/num-6-7.png',
      'assets/num-task-imgs/people/num-6-8.png',
      'assets/num-task-imgs/people/num-6-9.png',
      'assets/num-task-imgs/people/num-7-0.png',
      'assets/num-task-imgs/people/num-7-1.png',
      'assets/num-task-imgs/people/num-7-2.png',
      'assets/num-task-imgs/people/num-7-3.png',
      'assets/num-task-imgs/people/num-7-4.png',
      'assets/num-task-imgs/people/num-7-5.png',
      'assets/num-task-imgs/people/num-7-6.png',
      'assets/num-task-imgs/people/num-7-7.png',
      'assets/num-task-imgs/people/num-7-8.png',
      'assets/num-task-imgs/people/num-7-9.png',
      'assets/num-task-imgs/people/num-8-0.png',
      'assets/num-task-imgs/people/num-8-1.png',
      'assets/num-task-imgs/people/num-8-2.png',
      'assets/num-task-imgs/people/num-8-3.png',
      'assets/num-task-imgs/people/num-8-4.png',
      'assets/num-task-imgs/people/num-8-5.png',
      'assets/num-task-imgs/people/num-8-6.png',
      'assets/num-task-imgs/people/num-8-7.png',
      'assets/num-task-imgs/people/num-8-8.png',
      'assets/num-task-imgs/people/num-8-9.png',
    ],
    audio: [],
    video: [
      'assets/instruction-media/objects-vid.mp4',
      'assets/instruction-media/people-vid.mp4',
    ],
    misc: ['assets/instruction-media - Shortcut.lnk'],
  };

  const updateData = (
    rawData: DataCollection,
    expSettings: AllSettingsType,
    expStatus: StatusEnum,
  ): void => {
    let responseArray = [];
    if (experimentResultsAppData && experimentResultsAppData.rawData?.trials) {
      if (experimentResultsAppData.rawData.trials.length < rawData.count()) {
        responseArray = rawData.values();
      } else {
        responseArray = [
          ...rawData.values(),
          ...experimentResultsAppData.rawData.trials.slice(
            rawData.values().length,
          ),
        ];
      }
    } else {
      responseArray = rawData.values();
    }
    setExperimentResult({
      rawData: { trials: responseArray },
      settings: expSettings,
      status: expStatus,
    });
  };

  useEffect(() => {
    if (status === 'success' && !experimentResultsAppData) {
      setExperimentResult({
        rawData: { trials: [] },
        settings,
        status: StatusEnum.Block1,
      });
    } else if (
      experimentResultsAppData &&
      experimentResultsAppData?.status !== StatusEnum.Block1 &&
      !experimentStarted
    ) {
      setExperimentDone(true);
    }
    if (!jsPsychRef.current && experimentResultsAppData && !experimentDone) {
      jsPsychRef.current = run({
        assetPaths: assetPath,
        input: { settings, results: experimentResultsAppData },
        onFinish: updateData,
      });
      setExperimentStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    experimentResultsAppData,
    setExperimentResult,
    settings,
    status,
    updateData,
    experimentDone,
    experimentStarted,
  ]);

  return experimentDone ? (
    <Stack bgcolor="white">
      <Typography variant="h5">
        You have previously completed this experiment. Please reach out to the
        experimenter
      </Typography>
    </Stack>
  ) : (
    <div className="jspsych-content-outer-wrapper">
      <div id="jspsych-display-element" className="jspsych-content-outer" />
    </div>
  );
};
