const element = document.getElementById('countdown-days');
if (element) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const newYear = now.getMonth() === 11 && now.getDate() === 31 && now.getHours() === 23 ? 
        new Date(currentYear + 1, 11, 31) : 
        new Date(currentYear, 11, 31);
    const remainingDays = Math.ceil((newYear - now) / 86400000);
    element.textContent = remainingDays;
}   
