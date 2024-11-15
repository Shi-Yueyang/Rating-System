import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const staffNavItems:NavItemConfig[] = [
  { key: 'activity', title: '活动发布', href: paths.dashboard.activity, icon: 'chart-pie' }, // newly added
  { key: 'rating', title: '评分', href: paths.dashboard.rating, icon: 'chart-pie' }, // newly added
  { key: 'customers', title: '用户', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: '账户', href: paths.dashboard.account, icon: 'user' },
] ;

export const userNavItems:NavItemConfig[] = [
  { key: 'rating', title: '评分', href: paths.dashboard.rating, icon: 'chart-pie' }, // newly added
  { key: 'account', title: '账户', href: paths.dashboard.account, icon: 'user' },
] ;
