import React from "react";

const Cards = () => {
  const cards = [
    {
      title: "Budgeting",
      description: "Create and manage budgets to keep your spending on track.",
      video: "money-bag.mp4",
    },
    {
      title: "Expense Tracking",
      description:
        "Monitor your expenses in real-time with detailed categorization.",
      video: "line-chart.mp4",
    },
    {
      title: "Email Notifications",
      description:
        "Receive timely email alerts for important account activities.",
      video: "message.mp4",
    },
    {
      title: "Effortless Access",
      description:
        "Access your financial data anytime, anywhere with our user-friendly platform.",
      video: "click.mp4",
    },
    {
      title: "AI-Powered Insights",
      description:
        "Leverage AI to gain personalized financial insights and recommendations.",
      video: "artificial-intelligence.mp4",
    },
    {
      title: "Save More",
      description:
        "Utilize our tools to identify saving opportunities and reach your goals faster.",
      video: "save-money.mp4",
    },
  ];

  return (
    <>
      <section className="max-w-8xl mx-auto px-6 py-20 container bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Key Features
        </h2>

        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-14">
          Everything you need to track, manage, and understand your finances
          effortlessly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="
            group
            border border-blue-100
            bg-white
            p-6
            rounded-2xl
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            flex
            flex-col
            items-center
            text-center
            min-h-[280px]
          "
            >
              <video
                className="mx-auto mb-4"
                autoPlay
                loop
                muted
                playsInline
                width={70}
                src={card.video}
              />

              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Cards;
