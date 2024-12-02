import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { CaretDown, ListBullets, Star } from '@phosphor-icons/react';

export interface AspectScore {
  id: number;
  user_resource: number;
  aspect: number;
  aspect_name: string;
  score: number;
}

export interface ReviewerScore {
  id: number;
  name: string;
  aspectScores: AspectScore[];
}

export interface Work {
  id: number;
  title: string;
  reviewerScores: ReviewerScore[];
}

interface Props {
  works: Work[];
}

const ScoreList: React.FC<Props> = ({ works }) => {
  const calculateAverageScoreOfOneReviewer = (aspectScores: AspectScore[]) => {
    if (aspectScores.length === 0) return 0;
    const sum = aspectScores.reduce((sum, aspect) => sum + aspect.score, 0);
    return sum / aspectScores.length;
  };

  const calculateTotalAverageScore = (reviewers: ReviewerScore[]) => {
    const nomberOfValidReviewers = reviewers.filter((reviewer) => reviewer.aspectScores.length > 0).length;
    if (nomberOfValidReviewers === 0) return 0;
    const sum = reviewers.reduce((sum, reviewer) => sum + calculateAverageScoreOfOneReviewer(reviewer.aspectScores), 0);
    return sum / nomberOfValidReviewers;
  };

  return (
    <Grid container spacing={3}>
      {works.map((work) => (
        <Grid item xs={12} key={work.id}>
          <Card>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <ListBullets size={24} weight="bold" />
                  <Typography variant="h6">作评: {work.title}</Typography>
                </Box>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <Star size={20} color="#ffb400" />
                  <Typography>总分: {calculateTotalAverageScore(work.reviewerScores).toFixed(2)}</Typography>
                </Box>
              }
            />
            <CardContent>
              <Accordion>
                <AccordionSummary expandIcon={<CaretDown size={20} />}>
                  <Typography variant="subtitle1">
                    <ListBullets size={20} /> 查看专家评分
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {work.reviewerScores.map((reviewer) => (
                    <Box key={reviewer.id} mb={2}>
                      <Typography variant="h6">
                        {reviewer.name}:{' '}
                        {reviewer.aspectScores.length > 0
                          ? calculateAverageScoreOfOneReviewer(reviewer.aspectScores).toFixed(2)
                          : '未评分'}
                      </Typography>
                      {reviewer.aspectScores.length > 0 && (
                        <Accordion>
                          <AccordionSummary expandIcon={<CaretDown size={20} />}>
                            <Typography>
                              <ListBullets size={16} /> 查看小分
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>标准</TableCell>
                                    <TableCell>分数</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {reviewer.aspectScores.map((aspectScore, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{aspectScore.aspect_name}</TableCell>
                                      <TableCell>{aspectScore.score}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ScoreList;
