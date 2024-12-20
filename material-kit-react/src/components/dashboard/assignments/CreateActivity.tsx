'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { backendURL } from '@/config';
import { paths } from '@/paths';
import { ActivityWithAspect, Aspect, UseApiResources } from '@/hooks/UseApiResource';

// Zod validation schema
const schema = z.object({
  eventName: z.string().min(1, { message: '请输入任务名称' }),
  duedate: z.string(),
  criteria: z
    .array(
      z.object({
        name: z.string().min(1, { message: '请输入标准名称' }),
        description: z.string().min(1, { message: '请输入标准描述' }),
        percentage: z.number().min(1, { message: '百分比至少为1' }),
      })
    )
    .min(1, { message: '至少一个标准' }),
  resources: z.array(z.instanceof(File)).optional(),
});

type FormData = z.infer<typeof schema>;

const CreateActivity = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // For dynamic criteria fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria',
  });

  const accessToken = localStorage.getItem('custom-auth-token');
  const [errorCreateActivity, setErrorCreateActivity] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { useMutateResources: useMutateActivityWithAspect } = UseApiResources<ActivityWithAspect>({
    endPoint: `${backendURL}/rate/events/`,
    queryKey: ['events'],
    accessToken: accessToken,
  });
  const usePostActivityWithAspect = useMutateActivityWithAspect('POST');

  // Form submission handler
  const onSubmit = (data: FormData) => {
    const aspects: Aspect[] = data.criteria.map((criterion) => ({ ...criterion }) as Aspect);
    const activityWithAspect: ActivityWithAspect = { name: data.eventName, dueDate: data.duedate, aspects };

    usePostActivityWithAspect.mutate(activityWithAspect, {
      onError: (error: AxiosError) => {
        if (!error.response || !error.response.data) {
          return;
        }
        const fieldErrors = error.response.data as Record<string, string[]>;
        setErrorCreateActivity(
          Object.entries(fieldErrors)
            .map(([field, messages]) => `${field}:${messages.join(' ')}`)
            .join(';')
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activities'] });
        router.push(paths.dashboard.assignment.base);
      },
    });
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: '800px', margin: 'auto', padding: 3 }}>
      <Typography variant="h4">新建活动</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Name field */}
          <TextField
            label="活动名称"
            {...register('eventName')}
            error={!!errors.eventName}
            helperText={errors.eventName?.message}
          />

          {/* Date field */}
          <Controller
            control={control}
            name="duedate"
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <>
                  <DatePicker
                    {...field}
                    label="截至日期"
                    value={field.value ? dayjs(field.value) : null} // Ensure value is a valid date
                    onChange={(date) => {
                      try {
                        field.onChange(dayjs(date).format('YYYY-MM-DD'));
                      } catch (error) {
                        console.error('[CreateAssignment] date error' + error);
                      }
                    }}
                  />
                  {/* <TextField label="date error" error={!!errors.date} helperText={errors.date?.message} /> */}
                </>
              );
            }}
          />
          {/* Criteria List */}
          <Stack spacing={2}>
            <Typography variant="h6">评价标准</Typography>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ border: '1px solid #ddd', padding: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="名称"
                      {...register(`criteria.${index}.name`)}
                      error={!!errors.criteria?.[index]?.name}
                      helperText={errors.criteria?.[index]?.name?.message}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="描述"
                      {...register(`criteria.${index}.description`)}
                      error={!!errors.criteria?.[index]?.description}
                      helperText={errors.criteria?.[index]?.description?.message}
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="分值"
                      type="number"
                      {...register(`criteria.${index}.percentage`, { valueAsNumber: true })}
                      error={!!errors.criteria?.[index]?.percentage}
                      helperText={errors.criteria?.[index]?.percentage?.message}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} container justifyContent={'center'}>
                    <Button
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      删除
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}

            {/* Button to Add More Criteria */}
            <Button
              variant="outlined"
              onClick={() => {
                append({ name: '', description: '', percentage: 0 });
              }}
            >
              添加评价标准
            </Button>
            <Divider />
          </Stack>

          <Button variant="contained" color="primary" type="submit">
            创建
          </Button>
        </Stack>
      </form>
      {usePostActivityWithAspect.isError && (
        <Typography color="error">error: {usePostActivityWithAspect.error?.message}</Typography>
      )}
      {errorCreateActivity && <Typography color="error">{errorCreateActivity}</Typography>}
    </Stack>
  );
};

export default CreateActivity;
