import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const educatorData = dummyEducatorData
  const { user } = useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 transition-all duration-300'>
      <Link to='/' className="transition-transform duration-300 hover:scale-105">
        <img src={assets.logo} alt="" />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p className="transition-colors duration-300 hover:text-blue-600">Hi {user ? user.fullName : 'Developers'}</p>
        {
          user ? <UserButton /> : <img className='max-w-8 transition-transform duration-300 hover:scale-110' src={assets.profile_img} />
        }
      </div>
    </div>
  )
}

export default Navbar