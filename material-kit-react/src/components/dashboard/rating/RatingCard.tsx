import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';

import { Activity } from '@/hooks/UseApiResource';

interface RatingCardProps {
  activity: Activity;
  handleClickView: () => void;
}

const RatingCard = ({ activity, handleClickView: handleClickView }: RatingCardProps) => {

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
        <Button variant="outlined" color="primary" onClick={handleClickView}>
          开始打分
        </Button>

      </CardActions>
    </Card>
  );
};

export default RatingCard;
