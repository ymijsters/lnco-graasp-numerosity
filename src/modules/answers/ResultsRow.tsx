import { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton, Tooltip } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export type ResultData = {
  name: string | undefined;
  duration: number | undefined;
  length: number;
  rawDataDownload: () => void;
  deleteResult: () => void;
};

const ResultsRow: FC<ResultData> = ({
  name,
  duration,
  length,
  rawDataDownload,
  deleteResult,
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
    <TableCell>
      <IconButton
        color="secondary"
        onClick={deleteResult}
        sx={{ width: 'auto' }}
      >
        <Tooltip title="Delete Result">
          <DeleteIcon />
        </Tooltip>
      </IconButton>
    </TableCell>
  </TableRow>
);

export default ResultsRow;
