import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Activity } from '@/hooks/UseApiResource';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';



interface Props {
  activity: Activity;
}

const ActivityCard = ({ activity }: Props) => {
  const router = useRouter();
  const handleCardClick = () => {
    router.push(paths.eventDetails+activity.id);
  };

  return (
    <Card
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }} // Add cursor to indicate it's clickable
      onClick={handleCardClick} // Make the card clickable
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
