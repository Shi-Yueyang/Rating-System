import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AssignmentCard, { Assignment, AssignmentStatus } from '@/components/dashboard/assignments/assignments-card';

const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Review Financial Report Q1',
    dueDate: new Date('2024-09-15'),
    status: AssignmentStatus.NotStarted,
    description: 'Review and rate the financial report for the first quarter.',
    assignedDate: new Date('2024-09-01'),
    progress: 0,
  },
  {
    id: '2',
    title: 'Evaluate Marketing Strategy',
    dueDate: new Date('2024-09-20'),
    status: AssignmentStatus.InProgress,
    description: 'Evaluate the effectiveness of the new marketing strategy and provide feedback.',
    assignedDate: new Date('2024-09-05'),
    progress: 50,
  },
  {
    id: '3',
    title: 'Audit Project Compliance',
    dueDate: new Date('2024-09-10'),
    status: AssignmentStatus.Completed,
    description: 'Complete audit of project compliance with regulatory standards.',
    assignedDate: new Date('2024-08-20'),
    progress: 100,
    rating: 4,
    comments: 'Well documented and compliant, but needs some improvements in documentation clarity.',
  },
  {
    id: '4',
    title: 'Update User Interface Design',
    dueDate: new Date('2024-09-25'),
    status: AssignmentStatus.Overdue,
    description: 'Update the user interface design based on the latest feedback from the user testing.',
    assignedDate: new Date('2024-08-30'),
    progress: 20,
    comments: 'Design updates are in progress but need to be accelerated to meet the deadline.',
  },
  {
    id: '5',
    title: 'Prepare Annual Budget Presentation',
    dueDate: new Date('2024-10-01'),
    status: AssignmentStatus.NotStarted,
    description: 'Prepare and finalize the presentation for the annual budget review meeting.',
    assignedDate: new Date('2024-09-07'),
  },
];

const Page = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">任务</Typography>
      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid key={assignment.id} lg={4} md={6} xs={12}>
            <AssignmentCard assignment={assignment} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Page;
