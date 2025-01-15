import { FC } from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  duration: number | undefined;
  length: number;
  rawDataDownload: () => void;
};

const ResultsRow: FC<ResultData> = ({
  name,
  duration,
  length,
  rawDataDownload,
}) => (
  <TableRow>
    <TableCell>{name}</TableCell>
    <TableCell>{duration}</TableCell>
    <TableCell>{length}</TableCell>
    <TableCell>
      <IconButton
        onClick={(): void => {
          rawDataDownload();
        }}
      >
        <FileDownloadIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

export default ResultsRow;
