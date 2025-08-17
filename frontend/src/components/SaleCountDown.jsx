import React, { useEffect, useState } from 'react';

export default function SaleCountdown() {
  const targetDate = new Date('2025-08-28T23:59:00'); // Sale ends here
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const total = targetDate - new Date();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return total > 0
      ? { total, days, hours, minutes, seconds }
      : { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[var(--primary-color)] text-white p-10 rounded-xl text-center max-w-xl mx-auto shadow-2xl">
      <h2 className="text-3xl font-bold mb-4">Sale Ends In:</h2>
      <div className="text-4xl font-mono flex justify-center gap-8">
        <div>
          <span>{timeLeft.days}</span>
          <div className="text-lg">Days</div>
        </div>
        <div>
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <div className="text-lg">Hours</div>
        </div>
        <div>
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <div className="text-lg">Minutes</div>
        </div>
        <div>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <div className="text-lg">Seconds</div>
        </div>
      </div>
    </div>
  );
}
