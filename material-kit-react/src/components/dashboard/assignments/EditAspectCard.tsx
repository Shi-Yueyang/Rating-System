import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

import { Aspect } from '@/hooks/UseApiResource';

interface EditAspectCardProps {
  aspects: Aspect[];
  handleAspectChange: (newAspects: Aspect[]) => void;
}

const EditAspectCard = ({ aspects, handleAspectChange }: EditAspectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAspects, setEditedAspects] = useState(aspects);
  const [initialAspects, setInitialAspects] = useState(aspects);
  useEffect(() => {
    setEditedAspects(aspects);
    setInitialAspects(aspects);
  }, [aspects]);

  const handleCancel = () => {
    setEditedAspects(initialAspects);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    handleAspectChange(editedAspects);
  };

  return (
    <Card
      sx={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Stronger shadow for emphasis
        borderRadius: 2, // Rounded corners
        marginBottom: 3,
        padding: 2, // Add padding for inner spacing
      }}
    >
      <CardHeader
        title="评价标准"
        titleTypographyProps={{
          variant: 'h5',
          fontWeight: 'bold',
          color: 'primary',
        }}
      />
      <CardContent>
        <Grid container direction="column" spacing={3}>
          {editedAspects?.map((aspect, index) => (
            <Grid item xs={12} key={index} mb={2}>
              <Stack spacing={2}>
                <Typography variant="h6" color="secondary" mb={2}>
                  {`No ${index + 1}`}
                </Typography>
                {isEditing ? (
                  <Stack spacing={3}>
                    <TextField
                      label="标准名称"
                      type="text"
                      fullWidth
                      value={aspect.name}
                      variant="outlined"
                      size="small"
                      onChange={(e) => {
                        setEditedAspects((prev) => {
                          const newAspects = [...prev];
                          newAspects[index].name = e.target.value;
                          return newAspects;
                        });
                      }}
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                    <TextField
                      label="分值"
                      type="number"
                      fullWidth
                      value={aspect.percentage}
                      variant="outlined"
                      size="small"
                      onChange={(e) => {
                        setEditedAspects((prev) => {
                          const newAspects = [...prev];
                          newAspects[index].percentage = parseInt(e.target.value);
                          return newAspects;
                        });
                      }}
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                    <TextField
                      label="介绍"
                      type="text"
                      fullWidth
                      value={aspect.description}
                      onChange={(e) => {
                        setEditedAspects((prev) => {
                          const newAspects = [...prev];
                          newAspects[index].description = e.target.value;
                          return newAspects;
                        });
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                  </Stack>
                ) : (
                  <>
                    <Typography>
                      <strong>名称：</strong>
                      {aspect.name}
                    </Typography>
                    <Typography>
                      <strong>分值：</strong>
                      {aspect.percentage}
                    </Typography>
                    <Typography>
                      <strong>介绍：</strong>
                      {aspect.description}
                    </Typography>
                  </>
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Divider />
      <CardActions>
        {isEditing ? (
          <>
            <Button onClick={handleSave} color="primary">
              保存
            </Button>
            <Button onClick={handleCancel} color="secondary">
              取消
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            color="primary"
          >
            编辑
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EditAspectCard;
