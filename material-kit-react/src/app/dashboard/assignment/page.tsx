import ActivityPage from '@/components/dashboard/assignments/ActivityPage';
import { Stack, Typography } from '@mui/material';


export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" padding={3}>
          活动信息
        </Typography>
      </div>
      <ActivityPage></ActivityPage>
    </Stack>
  );
}
