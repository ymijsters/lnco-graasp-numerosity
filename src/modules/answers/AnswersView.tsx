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

import { hooks } from '@/config/queryClient';

import UserAnswerRow from './UserAnswersRow';

const AnswersView: FC = () => {
  const { data: appData } = hooks.useAppData();

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Answers</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="answers table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blocks Per Half</TableCell>
              <TableCell>Trial Object Length</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appData?.map((data) => (
              <UserAnswerRow
                key={data.id}
                name={data.creator?.name}
                trialsPerHalf={Number(data.data.trialsPerHalf)}
                trials={1}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AnswersView;
