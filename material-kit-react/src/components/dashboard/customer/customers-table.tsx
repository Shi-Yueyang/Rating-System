'use client';

import * as React from 'react';
import { LinearProgress, Tab } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { User } from '@/types/user';
import { useSelection } from '@/hooks/use-selection';

import { UserResource } from '../assignments/ActivityDetails';

interface CustomersTableProps {
  count?: number;
  page?: number;
  users?: User[];
  userResources?: UserResource[];
  rowsPerPage?: number;
}

export function CustomersTable({
  count = 0,
  users = [],
  userResources = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return users.map((customer) => customer.id);
  }, [users]);
  const { selected } = useSelection(rowIds);

  const tasksForEachUser = users.map((user) => {
    const taskNum = userResources.filter((userResource) => userResource.user === user.id).length;
    return { user: user.id, taskNum };
  });
  const completedTasksForEachUser = users.map((user) => {
    const completeTaskNum = userResources.filter(
      (userResource) => userResource.user === user.id && userResource.score > 0
    ).length;
    return { user: user.id, completeTaskNum };
  });

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>姓名</TableCell>
              <TableCell>邮箱</TableCell>
              <TableCell>评审进度</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const isSelected = selected?.has(user.id);

              return (
                <TableRow hover key={user.id} selected={isSelected}>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={user.avatar} />
                      <Typography variant="subtitle2">{user.realname}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {(() => {
                      const completedTasks =
                        completedTasksForEachUser.find((task) => task.user === user.id)?.completeTaskNum || 0;
                      const totalTasks = tasksForEachUser.find((task) => task.user === user.id)?.taskNum || 0;
                      const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                      return (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress
                            color="primary"
                            variant="determinate"
                            value={completionPercentage}
                            sx={{ width: '100px', height: '10px', borderRadius: '5px' }}
                          />
                          <Typography variant="body2" sx={{ minWidth: '50px', textAlign: 'right' }}>
                            {`${completedTasks}/${totalTasks}`}
                          </Typography>
                        </Stack>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
