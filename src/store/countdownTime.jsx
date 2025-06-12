export const countdownTime = () => {
    const targetDate = new Date('2024-07-28');
    const currentDate = new Date();
    const difference = targetDate.getTime() - currentDate.getTime();

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
}