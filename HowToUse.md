# Tutorial
## Add new nav bar item
- create a new folder in src/app/dashboard, and create a component in it
```
src
|-app
   |-dashboard
         |-testComponent
                 |-page.tsx (newly created)
```
page.tsx
```ts
const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page
```
- modify the path object in src/paths.ts
```ts
export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    test: '/dashboard/testComponent', // newly added
  },
  errors: { notFound: '/errors/not-found' },
} as const;
```
- modify src/components/dashboard/layout/config.ts, add a new item in navItems
```ts
export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  { key: 'test', title: 'Test', href: paths.dashboard.test, icon: 'chart-pie' }, // newly added
] satisfies NavItemConfig[];

```
## Fetch data from backend
- In the root layout.tsx ( src/app/layout.tsx )
  - Mark it as client component
  - Use QueryClient and QueryClientProvider
  - Wrap everything inside a QueryClientProvider
```ts
"use client";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const [queryClient] = useState(() => new QueryClient());

// ...

return (
// ...
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
// ...
);
```

## Authentication
### Frontend
- Related parts
  - SignInForm (sign-in-form.tsx)
    - Define a form with zod
    - Await a token from authClient.signInWithPassword
    - Get checkSession from useUser()
    - Await checkSession() In onSubmit()
  - AuthClient (client.ts): Define signInWithPassword, **getUser**, etc
  - useUser() (use-user.ts): Wrapper of UserContext, make sure UserProvider exists
  - UserContext (user-context.tsx): Provide user,error,isLoading by calling AuthClient.getUser()
  - AuthGuard (auth-guard.tsx): Get { user, error, isLoading } from useUser(), route to sign-in if not logged in
  - GuestGuard (guest-guard.tsx): Get { user, error, isLoading } from useUser(), route to dashboard if logged in

- Things that equalls getUser()
```ts
// sign-in-form.tsx
const { checkSession } = useUser();
await checkSession?.();

// guest-guard.tsx and auth-guard.tsx
const { user, error, isLoading } = useUser();
```

- SignInForm: Edit zod schema
```ts
const schema = zod.object({
emailOrUsername: zod.string()
  .min(1, { message: 'Email or username is required' })
  .refine(value => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Basic username validation: alphanumeric, underscores, hyphens, and periods
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    // Return true if it matches either email or username format
    return emailRegex.test(value) || usernameRegex.test(value);
  }, { message: 'Must be a valid email or username' }),

password: zod.string()
  .min(1, { message: 'Password is required' }),
});

```
- signInWithPassword(): Get access token from backend (src/lib/auth/client.ts)
  - To prevent await signInWithPassword returns immediatelly, Must use await axios.post() inside 
```ts
async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
  const { emailOrUsername, password } = params;

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', {
      username:emailOrUsername,
      password: password
    })

    const token = response.data.access;
    localStorage.setItem('custom-auth-token',token);
    console.log('[signInWithPassword] token: '+token);
    return {};
  } catch (error){
    return {error:'invalid credentials'}
  }
}
```

- getUser(): Retrieve token from local storage, then use the token to call the me endpoint and get the user json, finally return the user object
```ts
async getUser(): Promise<{ data?: User | null; error?: string }> {
  const token = localStorage.getItem('custom-auth-token');
  console.log("[getUser] token:"+token)
  
  if (!token) {
    return {}
  }

  console.log("[getUser] found token")

  return axios
  .get('http://127.0.0.1:8000/rate/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    console.log('[getUser] me endpoint response: ', JSON.stringify(response.data, null, 2));
    return { data: response.data as User, error: undefined };
  })
  .catch((error) => {
    // Handle the error and return an appropriate message
    return { data: null, error: error.response?.data?.message || 'An error occurred' };
  });
}
```
### Backend
- /api/token: use username and password to get access token
- /api/users/me: use the token to retrieve the user object

## user-popover.tsx
### How user-context.tsx and use-user.ts have
- UserContextValue: Interface with user, error, isLoading and checkSession()
- UserContext: The context with default values
- UserProvider: The context provider
- UserConsumer: Old way of consume the context
- useUser: A custom hook for easier consumption of the context

### Edit UserPopover
```ts
// extract user information from the context
const {user, checkSession } = useUser();

// Render the component based on context value
<Typography variant="subtitle1">{user?.username}</Typography>
<Typography color="text.secondary" variant="body2">
  {user?.email}
</Typography>
```

### Customize user model
- Start a new "core" app, add it to INSTALLED_APPS
- Extend the AbstractUser in the core app
- Overwrite the save method to hash the password
- Update AUTH_USER_MODEL to the new user model
- Edit the admin.py of core app
- Update legacy code e.g.
```python
from django.contrib.auth.models import User
# change to
from core.models import CustomUser as User
```
- Install Pillow
- 
## Q&A
- how to get user inside the dashboard: By `const {user, checkSession } = useUser();`
- how does user-context.tsx work: Defining a context interface, a contex, a provider and create a custom hook in use-user.ts

## todo
- Retrive the task of current user
- Customize django user model