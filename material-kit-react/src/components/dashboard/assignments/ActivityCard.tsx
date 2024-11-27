import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';

import { paths } from '@/paths';
import { Activity } from '@/hooks/UseApiResource';

interface Props {
  activity: Activity;
  onClick: () => void;
}

const ActivityCard = ({ activity, onClick }: Props) => {
  const router = useRouter();

  return (
    <Card
      sx={{
        boxShadow: '0 3px 5px rgba(0,0,0,0.2)', // Add some shadow for depth
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {activity.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          截至日期: {activity.dueDate}
        </Typography>
      </CardContent>
      <Divider />
      
      <CardActions>
        <Button variant="outlined" color="primary" onClick={onClick}>
          查看详情
        </Button>
      </CardActions>
    </Card>
  );
};

export default ActivityCard;
