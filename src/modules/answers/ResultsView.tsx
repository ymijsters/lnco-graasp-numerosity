import { FC } from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { DataCollection } from 'jspsych';

import { hooks } from '@/config/queryClient';

import { ExperimentResult } from '../config/appResults';
import ResultsRow from './ResultsRow';

const ResultsView: FC = () => {
  const { data: appData } = hooks.useAppData<ExperimentResult>();

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Answers</Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, textAlign: 'center' }}
          aria-label="answers table"
        >
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Number of Blocks</TableCell>
              <TableCell>Sequencing</TableCell>
              <TableCell>jsPsych Data Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData?.map((data) => {
              const rawDataLength = data.data.rawData
                ? new DataCollection(data.data.rawData.trials).count()
                : 0;
              return (
                <ResultsRow
                  key={data.id}
                  name={data.creator?.name}
                  duration={data.data.settings?.duration.content}
                  sequencing={data.data.settings?.sequencing.content}
                  rawDataLength={rawDataLength}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default ResultsView;
