import { SignIn } from '@clerk/nextjs'
import React from 'react'
//auth folder so that clerk does not redirect to sign-in page again and again
//also so that we can have custom sign-in page
//used to difference public and private routes

//[[...Sign-in]] to catch all routes under sign-in
//it doesnt show unncecessary parts in url
const page = () => {
  return (
    <div>
      <SignIn />
    </div>
  )
}

export default page
