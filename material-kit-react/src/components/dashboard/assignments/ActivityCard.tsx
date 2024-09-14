import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Activity } from '@/hooks/UseActivity';



interface Props {
  activity: Activity;
}

const ActivityCard = ({ activity }: Props) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {activity.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          截至日期: {activity.dueDate}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
