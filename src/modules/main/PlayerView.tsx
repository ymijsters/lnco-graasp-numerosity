import { useCallback } from 'react';

import { DataCollection } from 'jspsych';

import { hooks, mutations } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';

import { Experiment } from '../experiment/Experiment-Component';

const PlayerView = (): JSX.Element => {
  const appSettings = hooks.useAppSettings();
  const { mutate: postAppData } = mutations.usePostAppData();

  let trialsPerHalfSetting = 1;
  appSettings.data?.forEach((setting) => {
    // eslint-disable-next-line
    console.log(setting);
    if ('trials' in setting.data) {
      trialsPerHalfSetting = Number(setting.data.trials);
    }
  });

  const onCompleteExperiment = useCallback(
    (trialsPerHalf: number, rawData: DataCollection): void => {
      postAppData({
        data: { trialsPerHalf, rawData },
        type: 'a-type',
      });
    },
    [postAppData],
  );

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <Experiment
        trialsPerHalf={trialsPerHalfSetting}
        onCompleteExperiment={onCompleteExperiment}
      />
    </div>
  );
};
export default PlayerView;
