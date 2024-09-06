import { FC } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  duration: number | undefined;
  sequencing: 'people' | 'objects' | 'random' | undefined;
  rawDataLength: number | undefined;
};

const ResultsRow: FC<ResultData> = ({
  name,
  duration,
  sequencing,
  rawDataLength,
}) => (
  <TableRow>
    <TableCell>{name}</TableCell>
    <TableCell>{duration}</TableCell>
    <TableCell>{sequencing}</TableCell>
    <TableCell>{rawDataLength}</TableCell>
  </TableRow>
);

export default ResultsRow;
