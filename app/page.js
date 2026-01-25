"use client";

import { use, useEffect,useRef } from "react";
import {Button } from "../components/ui/button";
import Cards from "@/components/Cards";
import Link from "next/link";


export default function Home() {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleScroll = () => {
      if (window.scrollY > 200) {
        img.classList.add("scrolled");
      } else {
        img.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
  
  {/*<Button variant="destructive">hello</Button>*/}
  <h1 className="gradient-title text-4xl md:text-8xl px-20 font-extrabold text-center mt-20 text-blue-500">
    Manage your personal finances with Traco
  </h1>
 <br />
  <p className="font-bold text-center px-20">
  Take control of your money by tracking every expense in real time, understanding where your money goes, setting clear financial goals
  
  <span className="hidden md:inline"> <br /> And building better habits that help you save more, spend smarter, and stay financially confident every day.
</span>
  </p>

  <div className="text-center mt-8">
<Button variant="outline" className="bg-black hover:bg-blue-500 text-white mr-6 px-6 py-5">
  <Link href="/Sign-in">Get Started</Link></Button>
  <Button variant="outline" className="hover:bg-blue-500 hover:text-white mr-6 px-6 py-5">
  <Link href="/Sign-in">Watch Demo</Link></Button>
  </div>

  <main className="mb-20 mt-4">
    < div className="image-wrapper ">
    <img ref={imgRef} className="image border-x-fuchsia-600 rounded mx-auto md:w-4/6 h-auto object-contain" src="Her2.png" alt="" />

    </div>
  </main>

  <div className="flex flex-col my-30 bg-blue-300">
    
   
<div className="pb-6 pt-10">

 
  <h2 className="text-center text-white font-extrabold text-4xl mb-10">
    WHY CHOOSE TRACO?
  </h2>

 
  <div className="grid grid-cols-2 md:grid-cols-4 justify-around items-center font-bold text-2xl">

    <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full shadow-md">
        <img className="h-10 w-10" src="presentation.png" alt="Analysis" />
      </div>
      <div className="mt-3">Get Analysis</div>
    </div>

    <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full shadow-md">
        <img className="h-10 w-10" src="savings.png" alt="Save Money" />
      </div>
      <div className="mt-3">Save Money</div>
    </div>

    <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full shadow-md">
        <img className="h-10 w-10" src="target.png" alt="Set Goals" />
      </div>
      <div className="mt-3">Set Goals</div>
    </div>

    <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full shadow-md">
        <img className="h-10 w-10" src="artificial-intelligence.png" alt="AI Insights" />
      </div>
      <div className="mt-3">AI Insights</div>
    </div>

  </div>
</div>
  </div>
  <Cards />

  <div className="flex flex-col my-20 bg-blue-300">
    <div className="text-center pt-10">
       <h1 className="text-4xl font-bold mb-4 text-white">
        HOW IT WORKS?
      </h1>
    </div>
   
<div className="md:flex justify-around items-center  ">
 <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full">
         <img 
         className="h-10 w-10" 
         src="login-.png" 
         alt="" />
      </div>
     
     <div className="font-bold text-2xl py-4 text-center">
        1.Create Account
      </div>
      <p className="text-center">
        Sign up for a free account using your email or social media accounts.
      </p>
    </div>

    <div className="flex flex-col items-center p-5">
      
      <div className="bg-white p-3 rounded-full">
         <img 
         className="h-10 w-10" 
         src="tracking.png" 
         alt="" />
      </div>
     
      <div className="font-bold text-2xl py-4 text-center">
        2.Track Expenses
      </div>
      <p className="text-center">
        Log your daily expenses manually or sync with your bank for automatic tracking.
      </p>
    </div>

    <div className="flex flex-col items-center p-5">
      <div className="bg-white p-3 rounded-full">
         <img 
         className="h-10 w-10" 
         src="statistics.png" 
         alt="" />
      </div>
     
      <div className="font-bold text-2xl py-4 text-center">
        3.Get Insights
      </div>
      <p className="text-center">
        View detailed reports and analytics to understand your spending habits.
      </p>
    </div>

    
</div>
   
  </div>

  <div className="mt-20 text-center bg-linear-to-r from-blue-500 to-purple-500 p-10 rounded-lg text-white">
   
    <h1 className="text-3xl md:text-5xl font-extrabold mb-4"> Ready To Take Control Of Your Finances?</h1>
    Join thousands of satisfied users who have transformed their financial lives with Traco.
    <div className="text-center my-10">
      <Button className="float hover:bg-black bg-white text-black hover:text-white  font-bold py-5 px-6 rounded-lg">
        <Link href="/Sign-up">
        Start Free Trial
        </Link>
      </Button>
    </div>
  </div>

    </>
  );
}
