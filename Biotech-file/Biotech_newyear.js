// NEW YEAR COUNTDOWN
(function() {
const now = new Date();
let nextNY = new Date(now.getFullYear(), 11, 31);
if (nextNY < now) nextNY.setFullYear(nextNY.getFullYear() + 1);
const remainingDays = Math.ceil((nextNY - now) / 86400000);
document.currentScript.insertAdjacentHTML('afterend', '&nbsp;' + remainingDays + ' giorni al nuovo anno!');
})();   