import React from 'react'

const Cards = () => {

    const cards = [
        {
            title:"Budgeting",
            description:"Create and manage budgets to keep your spending on track.",
            video:"money-bag.mp4"
        }
        ,
        {
            title:"Expense Tracking",
            description:"Monitor your expenses in real-time with detailed categorization.",
            video:"line-chart.mp4"
        }
        ,
        {
            title:"Email Notifications",
            description:"Receive timely email alerts for important account activities.",
            video:"message.mp4"
        }
        ,
        {
          title:"Effortless Access",
          description:"Access your financial data anytime, anywhere with our user-friendly platform.",
          video:"click.mp4"
        }
        ,
        {
          title:"AI-Powered Insights",
          description:"Leverage AI to gain personalized financial insights and recommendations.",
          video:"artificial-intelligence.mp4"
        }
        ,
        {
          title:"Save More",
          description:"Utilize our tools to identify saving opportunities and reach your goals faster.",
          video:"save-money.mp4"
        }
    ];


  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 m-20">

      {cards.map((card,index)=>(
        <div
  key={index}
  className="border border-blue-200 p-4 shadow-lg rounded-lg flex flex-col items-center gap-3 text-center min-h-[260px]">

            <video className='item-center mx-auto' autoPlay loop muted
            width={60}
            src={card.video} ></video>
            <h2 className='text-center'>{card.title}</h2>
            <p className='text-sm leading-relaxed px-2 break-words'>{card.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Cards
