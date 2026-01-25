
import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { checkUser } from '../lib/checkUser';

const Header = async () => {
  const user = await checkUser();
  return (
    <div className="fixed top-0 h-12 w-full bg-white shadow-md flex items-center px-4 z-50">
      <div className="flex w-full justify-between items-center">
        <div>
          <Link href="/" className="font-bold text-xl text-blue-600">
            TRACO
          </Link>
        </div>
        
        <div className="flex items-center gap-4">

          <SignedIn>
            <Link href={"/dashboard"}>
            <Button variant='outline' className="bg-white text-black hover:text-blue-600">
              <LayoutDashboard size={16} className="mr-2" />
              <span className='hidden md:inline'>
                Dashboard</span>
            </Button>
            </Link>

            <Link href={"/transaction/create"}>
            <Button variant='outline' className="bg-black text-white hover:text-blue-400 hover:bg-black">
              <PenBox size={16} className="mr-2" />
              <span className='hidden md:inline'>
                Add Transaction</span>
            </Button>
            </Link>
            </SignedIn>

          <SignedOut>
           
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant="outline">Sign In</Button>
            </SignInButton>

            
            <SignUpButton forceRedirectUrl='/dashboard'>
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Header;