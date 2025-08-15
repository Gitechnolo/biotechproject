// Biotech holiday and banner script

document.addEventListener("DOMContentLoaded", function () {
  // Banner cycling
  const banners = [
    "Biotech-file/images/Biotech-menu/banner1.avif",
    "Biotech-file/images/Biotech-menu/banner2.avif",
    "Biotech-file/images/Biotech-menu/banner3.avif",
    "Biotech-file/images/Biotech-menu/banner4.avif"
  ];
  let bnrCntr = 0;
  const bannerImg = document.getElementById("Banner");
  function bancycle() {
    if (bannerImg) {
      bnrCntr = (bnrCntr + 1) % banners.length;
      bannerImg.src = banners[bnrCntr];
      setTimeout(bancycle, 3000);
    }
  }
  if (bannerImg) setTimeout(bancycle, 3000);


  // Modern: Always show countdown to the next holiday
  function getHolidayMsg() {
    const curDay = new Date();
    const holidays = [
      {
        name: "St. Patrick's Day",
        date: new Date(`${curDay.getFullYear()}-03-17`),
        style: "st-patrick"
      },
      {
        name: "4th di luglio",
        date: new Date(`${curDay.getFullYear()}-07-04`),
        style: "july4"
      },
      {
        name: "Halloween",
        date: new Date(`${curDay.getFullYear()}-10-31`),
        style: "halloween"
      },
      {
        name: "Natale",
        date: new Date(`${curDay.getFullYear()}-12-25`),
        style: "natale"
      }
    ];
    // If today is after Christmas, show next year's St. Patrick's Day
    if (curDay > holidays[3].date) {
      holidays[0].date = new Date(`${curDay.getFullYear() + 1}-03-17`);
    }
    // Find the next holiday
    let next = holidays.find(h => h.date > curDay);
    if (!next) next = holidays[0];
    const days = Math.ceil((next.date - curDay) / (1000 * 60 * 60 * 24));
    return {
      msg: `Solo ${days} giorni a <span class="holiday-name ${next.style}">${next.name}</span>!`,
      style: next.style
    };
  }

  // Insert holiday message
  const msgContainer = document.getElementById("holidayMsg");
  if (msgContainer) {
    const holiday = getHolidayMsg();
    msgContainer.innerHTML = `<p class="holiday-countdown ${holiday.style}">${holiday.msg}</p>`;
  }
});
