import React, { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Stack, TextField, Typography } from '@mui/material';

import { Activity } from '@/hooks/UseApiResource';

interface Props {
  activity: Activity;
  handleActivityChange: (newActivity: Activity) => void;
}

const ActivityTitleCard = ({ activity, handleActivityChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);
  const [initialActivity, setInitialActivity] = useState(activity);
  useEffect(() => {
    setInitialActivity(activity);
    setEditedActivity(activity);
  }, [activity]);

  const handleCancel = () => {
    setEditedActivity(initialActivity);
    setIsEditing(false);
  };

  const handleSave = () => {
    handleActivityChange(editedActivity);
    setIsEditing(false);
  };
  return (
    <Card
      sx={{
        boxShadow: '0 3px 5px rgba(0,0,0,0.2)', // Add some shadow for depth
        marginBottom: 3, // Space below the card
      }}
    >
      <CardHeader
        title="活动名称"
        titleTypographyProps={{
          variant: 'h5',
          fontWeight: 'bold',
          color: 'primary',
        }}
      />
      <CardContent>
        {isEditing ? (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="活动名称"
              variant="outlined"
              value={editedActivity.name}
              onChange={(e) => {
                setEditedActivity({ ...editedActivity, name: e.target.value });
              }}
            />
            <TextField
              fullWidth
              label="截止日期"
              variant="outlined"
              type='date'
              value={editedActivity.dueDate}
              onChange={(e) => {
                setEditedActivity({ ...editedActivity, dueDate: e.target.value });
              }}
            />
          </Stack>
        ) : (
          <>
            <Typography>
              <strong>名称：</strong>
              {activity.name}
            </Typography>
            <Typography>
              <strong>截至日期：</strong>
              {activity.dueDate}
            </Typography>
          </>
        )}
      </CardContent>
      <Divider />
      
      <CardActions>
        {isEditing ? (
          <>
            <Button onClick={handleSave} color="primary">保存</Button>
            <Button onClick={handleCancel} color="secondary">取消</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} color="primary">编辑</Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ActivityTitleCard;
