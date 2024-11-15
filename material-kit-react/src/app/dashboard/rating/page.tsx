import UserRating from '@/components/dashboard/rating/UserRating'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import RatingPage from '@/components/dashboard/rating/RatingPage'
const page = () => {
  return (
    <>
        <Stack spacing={3}>
      <div>
        <Typography variant="h4" padding={3}>
          评分
        </Typography>
      </div>
      <RatingPage></RatingPage>
    </Stack>
    </>
  )
}

export default page
