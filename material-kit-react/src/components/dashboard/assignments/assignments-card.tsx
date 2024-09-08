import React from 'react';
import { Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import dayjs from 'dayjs';

export enum AssignmentStatus {
  NotStarted = '未开始',
  InProgress = '进行中',
  Completed = '已完成',
  Overdue = '已过期',
}

export interface Assignment {
  id: string; // Unique identifier for the assignment
  title: string; // Title of the assignment
  dueDate: Date; // Due date for the assignment
  status: AssignmentStatus; // Current status of the assignment
  description?: string; // Optional brief description of the assignment
  assignedDate: Date; // Date when the assignment was assigned
  progress?: number; // Optional progress percentage (0-100)
  rating?: number; // Optional rating provided by the user (if applicable)
  comments?: string; // Optional comments or feedback
}

interface Props {
  assignment: Assignment;
}
const AssignmentCard = ({ assignment }: Props) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Typography align="center" variant="body1">
          {assignment.title}
        </Typography>
      </CardContent>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 0.5 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-left', p: 0.5 }}>
          <ClockIcon />
          <Typography color="text.secondary" display="inline" variant="body2">
            发布：{dayjs(assignment.assignedDate).format('YYYY-MM-D')}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-left', p: 0.5 }}>
          <ClockIcon />
          <Typography color="text.secondary" display="inline" variant="body2">
            截止：{dayjs(assignment.dueDate).format('YYYY-MM-D')}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-start', p: 0.5 }}>
        <ClockIcon />
        <Typography color="text.secondary" display="inline" variant="body2">
          状态：{assignment.status}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', p: 1 }}>
        <Button variant="outlined" color="primary">
          查看详情
        </Button>
        <Button variant="outlined" color="secondary">
          立即评分
        </Button>
      </Stack>
    </Card>
  );
};

export default AssignmentCard;
