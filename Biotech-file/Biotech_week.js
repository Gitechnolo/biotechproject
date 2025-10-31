document.addEventListener('DOMContentLoaded', () => {
    const weekElement = document.getElementById("week");
    if (!weekElement) return;

    function createSpans(text, start) {
        return text.split('').map((char, index) => 
            `<span style='--i:${start + index}'>${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    }

    const messages = {
        it: ['buona domenica!', 'buon lunedì!', 'buon martedì!', 'buon mercoledì!', 'buon giovedì!', 'buon venerdì!', 'buon sabato!'],
        en: ['happy sunday!', 'happy monday!', 'happy tuesday!', 'happy wednesday!', 'happy thursday!', 'happy friday!', 'happy saturday!'],
        es: ['¡buen domingo!', '¡buen lunes!', '¡buen martes!', '¡buen miércoles!', '¡buen jueves!', '¡buen viernes!', '¡buen sábado!'],
        fr: ['bon dimanche !', 'bon lundi !', 'bon mardi !', 'bon mercredi !', 'bon jeudi !', 'bon vendredi !', 'bon samedi !'],
        de: ['schönen sonntag!', 'schönen montag!', 'schönen dienstag!', 'schönen mittwoch!', 'schönen donnerstag!', 'schönen freitag!', 'schönen samstag!'],
        nl: ['fijne zondag!', 'fijne maandag!', 'fijne dinsdag!', 'fijne woensdag!', 'fijne donderdag!', 'fijne vrijdag!', 'fijne zaterdag!'],
        pt: ['boa domingo!', 'boa segunda!', 'boa terça!', 'boa quarta!', 'boa quinta!', 'boa sexta!', 'bom sábado!']
    };

    const baseTitle = 'Biotech Project vi augura ';
    const titles = {
        en: 'Biotech Project wishes you ',
        es: 'Biotech Project le desea ',
        fr: 'Biotech Project vous souhaite ',
        de: 'Biotech Project wünscht Ihnen ',
        nl: 'Biotech Project wenst u ',
        pt: 'Biotech Project deseja a você '
    };

    const userLang = (navigator.language || 'it').slice(0, 2).toLowerCase();
    const lang = messages[userLang] ? userLang : 'it';

    const today = new Date().getDay();
    const message = messages[lang][today];
    const title = titles[lang] || baseTitle;

    const daySpans = createSpans(message, 26);
    const titleSpans = createSpans(title, 1);
    weekElement.innerHTML = titleSpans + daySpans;
});      