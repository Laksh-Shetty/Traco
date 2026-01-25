import React from 'react'
import {Button } from "../components/ui/button";
import Link from 'next/link';


const notfound = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='gradient-title text-4xl font-bold'>404 - Page Not Found</h1>
      <Button>
        
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}

export default notfound
