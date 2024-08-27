import { FC } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name?: string;
  trialsPerHalf: number | undefined;
  trials: number | undefined;
};

const UserAnswerRow: FC<ResultData> = ({ name, trialsPerHalf, trials }) => (
  <TableRow>
    <TableCell>{name}</TableCell>
    <TableCell>{trialsPerHalf}</TableCell>
    <TableCell>{trials}</TableCell>
  </TableRow>
);

export default UserAnswerRow;
