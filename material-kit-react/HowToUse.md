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
