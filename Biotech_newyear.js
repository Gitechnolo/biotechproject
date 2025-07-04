// NEW YEAR COUNTDOWN
let today = new Date(); // Get the current date
let newYear = today.getFullYear(); // Get the year of the current date
    
// Check if the current date is already past by checking if the month is December and the current day is greater than 31
if (today.getMonth() == 11 && today.getDate() > 31) {
newYear = newYear + 1; // Add an year so that the next new year date could be used
}
let newYearDate = new Date(newYear, 11, 31); // Get the date of the next New year
let dayMilliseconds = 1000 * 60 * 60 * 24; // Get the number of milliseconds in 1 day
let remainingDays = Math.ceil((newYearDate.getTime() - today.getTime()) / (dayMilliseconds)); // Get the remaining amount of days
document.write(" - " + remainingDays + " giorni al 2026."); // Write it to the page
// END NEW YEAR COUNTDOWN