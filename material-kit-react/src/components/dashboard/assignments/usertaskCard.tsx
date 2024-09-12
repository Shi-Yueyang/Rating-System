import React from 'react'
import { Button, Card, CardContent, Divider, Grid, Stack, Typography } from '@mui/material';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import dayjs from 'dayjs';

interface UserTask{
    user_id:number;
    resource_id:number;
    task_id:number;
    event_id:number; 
    score:number
}


const usertaskCard = () => {
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent sx={{ flex: '1 1 auto' }}>
            <Typography align="center" variant="body1">
              resource name
            </Typography>
          </CardContent>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 0.5 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-left', p: 0.5 }}>
              <ClockIcon />
              <Typography color="text.secondary" display="inline" variant="body2">
                发布日期
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-left', p: 0.5 }}>
              <ClockIcon />
              <Typography color="text.secondary" display="inline" variant="body2">
                截止日期
              </Typography>
            </Stack>
          </Stack>
    
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-start', p: 0.5 }}>
            <ClockIcon />
            <Typography color="text.secondary" display="inline" variant="body2">
              状态
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', p: 1 }}>
            <Button variant="outlined" color="primary">
              下载资源
            </Button>
            <Button variant="outlined" color="secondary">
              立即评分
            </Button>
          </Stack>
        </Card>
      );
}

export default usertaskCard