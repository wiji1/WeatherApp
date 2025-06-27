import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center">Weather App</h1>
      </div>
    </header>
  )
}