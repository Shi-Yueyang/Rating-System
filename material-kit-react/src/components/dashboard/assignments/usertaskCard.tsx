import React from 'react';
import { Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import dayjs from 'dayjs';

export interface Activity {
  id: number;
  name: string;
  due_date: string;
}

interface Props {
  activity: Activity;
}

const usertaskCard = ({ activity }: Props) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {activity.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Event ID: {activity.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Due Date: {activity.due_date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default usertaskCard;
