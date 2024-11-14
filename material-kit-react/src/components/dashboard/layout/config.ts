import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'activity', title: '活动', href: paths.dashboard.activity, icon: 'chart-pie' }, // newly added
  { key: 'customers', title: '用户', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: '账户', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
