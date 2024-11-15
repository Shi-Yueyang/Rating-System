import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Activity } from '@/hooks/UseApiResource';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';


interface Props {
  activity: Activity;
  onClick:()=>void;
}

const ActivityCard = ({ activity,onClick }: Props) => {
  const router = useRouter();


  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }} // Add cursor to indicate it's clickable
      onClick={onClick} // Make the card clickable
    >
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
