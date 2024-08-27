/* eslint-disable */
import { FC, useEffect, useRef } from 'react';

import { DataCollection, JsPsych } from 'jspsych';

import { run } from '../experiment/experiment';

type ExperimentProps = {
  trialsPerHalf: number;
  onCompleteExperiment: (
    trialsPerHalf: number,
    rawData: DataCollection,
  ) => void;
};

export const Experiment: FC<ExperimentProps> = ({
  trialsPerHalf,
  onCompleteExperiment,
}) => {
  const jsPsychRef = useRef<null | Promise<JsPsych>>(null);

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

  const onFinish = (data: DataCollection, blocksPerHalf: number): void => {
    onCompleteExperiment(blocksPerHalf, data);
  };

  useEffect(() => {
    if (!jsPsychRef.current) {
      console.log(`In Experiment Component ${trialsPerHalf}`);
      jsPsychRef.current = run({
        assetPaths: assetPath,
        input: { trialsPerHalf },
        environment: '',
        title: 'Numerosity Experiment on Graasp',
        version: '0.1',
        onFinish,
      });
    }
  }, []);

  return (
    <div>
      <div className="jspsych-content-wrapper">
        <div id="jspsych-content" className="jspsych-content" />
      </div>
    </div>
  );
};
