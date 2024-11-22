import { Aspect } from '@/hooks/UseApiResource';
import { Card, CardHeader, CardContent, Grid, Typography, TextField, Divider, CardActions, Button } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';

interface Props{
    aspects:Aspect[];
    handleAspectChange: (index: number, field: keyof Aspect, value: any) => void;
}

const EditAspectCard = ({aspects,handleAspectChange}:Props) => {
const [isEditing, setIsEditing] = useState(false);

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
          {aspects?.map((aspect, index) => (
            <Grid item xs={12} key={index}>
              <Stack spacing={2}>
                <Typography variant="h6" color="secondary">
                  {`No ${index + 1}`}
                </Typography>
                {isEditing ? (
                  <>
                    <TextField
                      label="标准名称"
                      type="text"
                      fullWidth
                      value={aspect.name}
                      variant="outlined"
                      size="small"
                      onChange={(e) => handleAspectChange(index, 'name', e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                    <TextField
                      label="分值"
                      type="number"
                      fullWidth
                      value={aspect.percentage}
                      variant="outlined"
                      size="small"
                      onChange={(e) => handleAspectChange(index, 'percentage', e.target.value)}
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                    <TextField
                      label="介绍"
                      type="text"
                      fullWidth
                      value={aspect.description}
                      onChange={(e) => handleAspectChange(index, 'description', e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                    />
                  </>
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
      <CardActions sx={{ justifyContent: 'flex-end', paddingX: 2 }}>
        <Button onClick={() => setIsEditing(true)} disabled={isEditing} variant="contained" color="primary">
        {isEditing ? '提交' : '编辑'}
        </Button>
        <Button
          onClick={() => setIsEditing(false)}
          disabled={!isEditing}
          variant="outlined"
          color="error"
          sx={{ marginLeft: 2 }}
        >
          取消
        </Button>
      </CardActions>
    </Card>
  );
};

export default EditAspectCard;
