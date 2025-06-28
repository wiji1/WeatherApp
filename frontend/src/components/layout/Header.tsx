import React from 'react'
import {UserMenu} from '../auth'

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}