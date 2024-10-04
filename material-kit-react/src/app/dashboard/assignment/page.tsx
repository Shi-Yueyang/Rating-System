import { Stack, Typography } from '@mui/material';

import AssignmentPage from '@/components/dashboard/assignments/AssignmentPage';

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" padding={3}>
          活动信息
        </Typography>
      </div>
      <AssignmentPage></AssignmentPage>
    </Stack>
  );
}
