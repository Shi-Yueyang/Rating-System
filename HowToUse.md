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

### Edit user-popover.tsx (and the avatar on MainNav)
- hierarchy: layout.tsx(of dashboard) -- main-nav.tsx -- UserPopover, Avatar
```ts
// user-popover.tsx
// extract user information from the context
const {user, checkSession } = useUser();
//
// Render the component based on context value
<Typography variant="subtitle1">{user?.username}</Typography>
<Typography color="text.secondary" variant="body2">
  {user?.email}
</Typography>


// main-nav.tsx
const {user, checkSession } = useUser();
// ...

```

### Customize user model
- Start a new "core" app, add it to INSTALLED_APPS
- Extend the AbstractUser in the core app (add an image field)
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
- Make migrations and migrate
- update MEDIA_URL and MEDIA_ROOT in settings
- add DEBUG = True in settings
- Add the urls of static contents

## account-info.tsx
- hierarchy: page.tsx (src/app/dashboard/account/page.tsx) -- account-info.tsx



## Q&A
- how to get user inside the dashboard: By `const {user, checkSession } = useUser();`
- how does user-context.tsx work: Defining a context interface, a contex, a provider and create a custom hook in use-user.ts

## todo
- activity create
- √ Event viewset supports transaction for post a event along with aspects
- √ Dateformat to YYYY-MM-DD
- √ Error message from UseActivity mutation, use onError from useMutation and mutate. 
- √ Datepicker with react form hook: in onchange, need to convert date object to string
- √ post new activity: can't create mutation inside onsubmit, but rather in the outer function
- √ create event submit button doesn't work: datepicker can't integrate with react form hook
- √ create event page: add due date, aspect delete button
- √ Aspects Table add name field
- √ Add new assignment: create route structure
- √ signup avatar: add manually using spread opeartor in onsubmit
- √ Authguard, checksession, getuser error, auto log out
- √ re-enter password, sanitize username input
- √ Sign up page: success auto log in
- √ Sign up page: print out error meessage with seterror form form hook
- √ guestguard error: don't need to use an error message to block the page
- √ remove adds from mobile nav
- √ Automatically update avatar on main nav after upload: do a "checksession" in the onSuccess callback in upload mutation
- √ Custom user model: delete old avatar when uploading new one
- √ UserUpload hook
- √ account-detail-form: build with zod and useform
- √ Upload avatar in account page: some component must be server-side, use wraper component to wrap two client component to share state.
- √ lift the preview in account-info to a upper level
- √ Preview the uploaded avatar
- √ Account page: Edit account-info.tsx, the hierachy: Add 'use client'; wherever using context hook
- √ Set password through browsable api bug: the validated_data['password'] is already hashed. No need to hash again in the serializer. Probably need to hash in the model, incase save directly from admin.
- √ PATCH method of user model: PATCH is only visible in DETAIL and RAW view in browsable api
- √ Password field is empty in browsable API: because it is a write only field

## Caveat
- use 'Content-Type': 'application/json' to send json data, and 'Content-Type': 'multipart/form-data' for form data(upload files)