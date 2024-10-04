'use client';

import InputFileUpload from '@/components/dashboard/assignments/InputFileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, Grid, IconButton, Stack, styled, TextField, Typography } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// Zod validation schema
const schema = z.object({
  eventName: z.string().min(1, { message: '请输入任务名称' }),
  dueDate: z.date({ required_error: '请选择日期' }),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, { message: '请输入标准名称' }),
        description: z.string().min(1, { message: '请输入标准描述' }),
        percentage: z.number().min(1, { message: '百分比至少为1' }),
      })
    )
    .min(1, { message: '至少一个标准' })
    .superRefine((criteria, ctx) => {
      const totalPercentage = criteria.reduce((acc, item) => acc + item.percentage, 0);
      if (totalPercentage !== 100) {
        ctx.addIssue({
          code: 'custom',
          message: `百分比总和必须为100, 当前为${totalPercentage}`,
          path: ['percentage'],
        });
      }
    }),
  resources: z.array(z.instanceof(File)).optional(),
});

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type FormData = z.infer<typeof schema>;

const CreateAssignment = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // For dynamic criteria fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria',
  });

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    // Add logic to send the form data to the backend
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: '600px', margin: 'auto', padding: 3 }}>
      <Typography variant="h4">新建活动</Typography>
    
        {/* Event Name Input */}
        <TextField
          label="活动名称"
          {...register('eventName')}
          error={!!errors.eventName}
          helperText={errors.eventName?.message}
        />

        {/* Criteria List */}
        <Stack spacing={2}>
          <Typography variant="h6">评价标准</Typography>
          {fields.map((field, index) => (
            <Box key={field.id} sx={{ border: '1px solid #ddd', padding: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    label="名称"
                    {...register(`criteria.${index}.name`)}
                    error={!!errors.criteria?.[index]?.name}
                    helperText={errors.criteria?.[index]?.name?.message}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label="描述"
                    {...register(`criteria.${index}.description`)}
                    error={!!errors.criteria?.[index]?.description}
                    helperText={errors.criteria?.[index]?.description?.message}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="百分比"
                    type="number"
                    {...register(`criteria.${index}.percentage`, { valueAsNumber: true })}
                    error={!!errors.criteria?.[index]?.percentage}
                    helperText={errors.criteria?.[index]?.percentage?.message}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => remove(index)}
                    disabled={fields.length === 1} // Ensure at least one criteria remains
                  ></IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Button to Add More Criteria */}
          <Button variant="outlined" onClick={() => append({ name: '', description: '', percentage: 0 })}>
            添加评价标准
          </Button>
        </Stack>

      <Divider />

      {/* Resources Upload */}
      <InputFileUpload/>
      <Divider />

      {/* Submit Button */}
      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
        创建
      </Button>

      {/* Display Errors */}
      {errors.criteria && <Typography color="error">{errors.criteria.message || '标准部分有错误'}</Typography>}
    </Stack>
  );
};

export default CreateAssignment;
