import ActivityPage from '@/components/dashboard/assignments/ActivityPage'
import ScoreList from '@/components/dashboard/assignments/ResultList'
import { StaffOrOrganizerGuard } from '@/components/dashboard/StaffOrOrganizerGuard'
import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
const mockWorks = [
  {
    id: 1,
    title: "Project A",
    reviewers: [
      {
        id: 1,
        name: "Reviewer 1",
        aspectScores: [
          { aspect: "Creativity", score: 8 },
          { aspect: "Technicality", score: 9 },
        ],
      },
      {
        id: 2,
        name: "Reviewer 2",
        aspectScores: [
          { aspect: "Creativity", score: 7 },
          { aspect: "Technicality", score: 8 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Project B",
    reviewers: [
      {
        id: 3,
        name: "Reviewer 3",
        aspectScores: [
          { aspect: "Creativity", score: 9 },
          { aspect: "Technicality", score: 10 },
        ],
      },
    ],
  },
];

const page = () => {
  return (
    <StaffOrOrganizerGuard>
      <Stack spacing={3}>
        <div>
          <Typography variant="h4" padding={3}>
            结果
          </Typography>
        </div>
        <ScoreList works={mockWorks} />
      </Stack>
    </StaffOrOrganizerGuard>
  )
}

export default page
