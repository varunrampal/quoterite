import {
    AlertCircle as AlertCircleIcon,
    BarChart as BarChartIcon,
    Lock as LockIcon,
    Settings as SettingsIcon,
    ShoppingBag as ShoppingBagIcon,
    User as UserIcon,
    UserPlus as UserPlusIcon,
    Users as UsersIcon,
    Activity as ActivityIcon,
    Clipboard as ClipboardIcon,
    File as FileIcon,
    List as ListIcon,
    Airplay as DashboardIcon
    
  } from 'react-feather';
export const adminItems = [
    {
      href: '/admin/dashboard',
      icon: DashboardIcon,
      title: 'Dashboard'
    },
    {
      href: '/admin/customerslist',
      icon: UsersIcon,
      title: 'Customers'
    },
    {
      href: '/admin/quoteslist',
      icon: ClipboardIcon,
      title: 'Quotes'
    },
    {
      href: '/app/orders',
      icon: ShoppingBagIcon,
      title: 'Orders'
    },
    {
      href: '/app/invoices',
      icon: FileIcon,
      title: 'Invoices'
    },
    {
      href: '/app/picklist',
      icon: ListIcon,
      title: 'Pick List'
    },
    {
      href: '/app/reports',
      icon: ActivityIcon,
      title: 'Reports'
    },
    {
      href: '/customer/account',
      icon: UserIcon,
      title: 'Account'
    },
    {
      href: '/app/settings',
      icon: SettingsIcon,
      title: 'Settings'
    },
    {
      href: '/register',
      icon: UserPlusIcon,
      title: 'Register Admin'
    },
    
  ];
  
  export const customerItems = [
    {
      href: '/customer/dashboard',
      icon: DashboardIcon,
      title: 'Dashboard'
    },
    {
      href: '/app/Quotes',
      icon: ClipboardIcon,
      title: 'Quotes'
    },
    {
      href: '/app/Orders',
      icon: ShoppingBagIcon,
      title: 'Orders'
    },
    {
      href: '/app/Invoices',
      icon: FileIcon,
      title: 'Invoices'
    },
    {
      href: '/app/reports',
      icon: ActivityIcon,
      title: 'Reports'
    },
    {
      href: '/customer/account',
      icon: UserIcon,
      title: 'Account'
    },
      
  ];