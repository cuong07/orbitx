import React from 'react'
import { Link } from 'react-router'
import { Button } from '../ui/button'
import { Globe } from 'lucide-react'

const navItems = [
  {
    label: 'Markets',
    href: '/'
  },
  {
    label: "Individual",
    href: '/'
  },
  {
    label: "Business",
    href: '/'
  },
  {
    label: "Trading",
    href: '/'
  },
  {
    label: "About",
    href: '/'
  },
  {
    label: "Contact",
    href: '/'
  }
]

export const Header = () => {
  return (
    <div className='h-14 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-background' >
      <div className=' flex items-center'>
        <Link to={'/'} className='w-48 pr-4 border-r-2  border-slate-800'>
          <img src='/2.png' alt='logo' />
        </Link>
        <div className='flex items-center gap-2 pl-4'>
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className='px-4 text-secondary-foreground'>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button className='rounded-full' variant='secondary'>Login</Button>
        <Button className='bg-primary rounded-full text-primary-foreground'>Register</Button>
        <div className='cursor-pointer'>
          <Globe className='w-5 h-5' />
        </div>
      </div>
    </div>
  )
}
