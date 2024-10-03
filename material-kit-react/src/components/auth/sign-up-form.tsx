'use client';

import * as React from 'react';
import { useState } from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  username: zod.string().min(1, { message: '您需要提供用户名' }).max(30, { message: '用户名最多30个字符' }) // Limit to 30 characters
  .regex(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' }),
  email: zod.string().min(1, { message: '您需要提供邮箱' }).email(),
  password: zod.string().min(6, { message: '密码最少6个字符' }),
  rePassword: zod.string(),
  terms: zod.boolean().refine((value) => value, '您必须同意用户条款'),
}).superRefine(({rePassword,password},ctx)=>{
  if (rePassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "确认密码错误",
      path: ['rePassword']
    });
  }
});

interface FormInputs {
  username: string;
  email: string;
  password: string;
  rePassword:string;
  terms: boolean;
  avatar: File | null; // Avatar will be manually handled
}

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: FormInputs): Promise<void> => {
      setIsPending(true);

      const { error, fieldErrors } = await authClient.signUp(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        if (fieldErrors?.username) {
          setError('username', { type: 'server', message: fieldErrors['username'][0] });
        }
        return;
      }

      const { error: signInError } = await authClient.signInWithPassword({
        emailOrUsername: values.username,
        password: values.password,
      });

      if (signInError) {
        setError('root', { type: 'server', message: signInError });
        setIsPending(false);
        return;
      }
      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">注册</Typography>
        <Typography color="text.secondary" variant="body2">
          已经拥有账户?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            登录
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} alignItems="center" padding={3}>
          <Avatar src={previewUrl || ''} sx={{ height: '60px', width: '60px' }} />
          <input type="file" id="upload-button-file" accept="image/*" hidden />
          <label htmlFor="upload-button-file">
            <Button component="span" variant="outlined" color="primary" fullWidth>
              上传头像
            </Button>
          </label>
        </Stack>

        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>用户名</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>邮箱</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>密码</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="rePassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.rePassword)}>
                <InputLabel>确认密码</InputLabel>
                <OutlinedInput {...field} label="Re-enter Password" type="password" />
                {errors.rePassword ? <FormHelperText>{errors.rePassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      我同意<Link>用户条款</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />

          {errors.root ? <Alert color="error">"注册失败"</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            注册
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
