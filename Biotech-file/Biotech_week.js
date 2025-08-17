document.addEventListener('DOMContentLoaded', () => {
const weekElement = document.getElementById("week");
if (!weekElement) return;
function createSpans(text, start) {
return text.split('').map((char, index) => 
`<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`
).join('');
}
const dayMessages = {
0: 'buona domenica!',
1: 'buon lunedì!',
2: 'buon martedì!',
3: 'buon mercoledì!',
4: 'buon giovedì!',
5: 'buon venerdì!',
6: 'buon sabato!'
};
const today = new Date().getDay();
const message = dayMessages[today];
const daySpans = createSpans(message, 26);
const titleSpans = createSpans('Biotech Project vi augura ', 1);
weekElement.innerHTML = titleSpans + daySpans;
});   