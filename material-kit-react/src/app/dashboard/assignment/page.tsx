import React from 'react';
import { Stack, Typography } from '@mui/material';

import ActivityPage from '@/components/dashboard/assignments/ActivityPage';
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard';

export default function Page(): React.JSX.Element {
  return (
    <StaffOrOrganizerGuard>
      <Stack spacing={3}>
        <div>
          <Typography variant="h4" padding={3}>
            活动信息
          </Typography>
        </div>
        <ActivityPage></ActivityPage>
      </Stack>
    </StaffOrOrganizerGuard>
  );
}
