"use client";

import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { LayoutDashboard, PenBox, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  // 1. On mount, check localStorage or system preference
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // 2. Toggle function
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-8xl mx-auto">
        <Link href="/" className="font-bold text-2xl text-blue-600 dark:text-blue-400">
          TRACO
        </Link>

        <div className="flex items-center gap-4">
          {/* Manual Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Header;