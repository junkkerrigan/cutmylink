// instance of this class long link id to short link
class Converter {

    // creates alphabet for converting to custom base
    constructor() {
        this._positions = [];

        const fillPositionsArray = (start, end) => {
            for(let i = start; i <= end; i++) {
                this._positions.push(i);
            }
        };

        fillPositionsArray(97, 122);
        fillPositionsArray(65, 90);
        fillPositionsArray(48, 57);

        this._alphabet = String.fromCharCode(...this._positions);
    }

    // converts passed number to custom base
    convert(id, base = 62) {
        if (!Number.isInteger(base) || base < 2 || base > 62) {
            throw new Error('Wrong base: base must be integer between 2 and 62');
        }

        let converted = '';
        let idx;

        if (id === 0) {
            return 'a';
        }

        while(id >= 1) {
            idx = id % base;
            id = Math.floor(id / base);
            converted += this._alphabet[idx];
        }

        return converted;
    }
}

// button that triggers cutter
const cutLinkBtn = document.querySelector(
    'button[data-appointment="cutLink"]');

const hostName = 'localhost:8000';

// makes container for short link existing but invisible
const createContainer = () => {
    const resultContainer = document.querySelector(
        '[data-appointment="resultContainer"]');
    resultContainer.classList.add('invisible', 'd-block');
};

// makes container visible and inserts short link into it
const showResult = shortLink => {
    const resultContainer = document.querySelector(
        '[data-appointment="resultContainer"]');
    resultContainer.classList.remove('invisible');

    const result = document.querySelector(
        '[data-appointment="result"]');
    result.innerText = `${hostName}/#${shortLink}`;
};

// scrolls window to bottom of passed element
const scrollToBottom = elem => {
    elem.scrollIntoView(
        {
            block: 'end',
            behavior: 'smooth',
        }
    );
};

// cuts long link, saves it to localStorage and displays short link
const cut = event => {
    // receiving long link
    const input = document.querySelector('input[name="longLink"]');
    let longLink = input.value;

    console.log(longLink);
    // handles invalid links
    if (
        !(
            longLink.startsWith('http://') ||
            longLink.startsWith('https://') ||
            longLink.startsWith('ftp://')
        )
    ) {
        longLink = 'http://' + longLink;
    }

        console.log(longLink);

    // TODO: check if short url already exists

    // calculating id for long link
    let lastId = localStorage.getItem('lastId');

    let curId;

    if (!lastId) {
        curId = 0;
    } else {
        curId = Number(lastId) + 1;
    }

    localStorage.setItem('lastId', curId);

    // converting id to short link
    const c = new Converter();
    const shortLink = c.convert(curId);

    // saving pair <shortLink, longLink> to localStorage
    localStorage.setItem(shortLink, longLink);

    // displaying short link
    const resultPromise = new Promise( resolve => {
        createContainer();
        resolve();
    });

    resultPromise
        .then(() => {
            return new Promise( resolve => {
                const section = document.querySelector(
            '[data-appointment="cutterSection"]');
                scrollToBottom(section);
                setTimeout(() => resolve(shortLink), 200);
            })
        })
        .then(showResult);
};

cutLinkBtn.addEventListener('click', cut);

// redirects to stored long link
const redirect = event => {
    if (window.location.hash.length < 1)
        return;

    const shortLink = window.location.hash.substr(1);
    const longLink = localStorage.getItem(shortLink);

            console.log(longLink);


    window.location.href = longLink;
};

window.addEventListener('load', redirect);
window.addEventListener('hashchange', redirect);

// button that copies short link to clipboard
const copyResultBtn = document.querySelector(
    '[data-appointment="copyResult"]');

// source to copy short link from
const copyFrom =document.querySelector(
    '[data-appointment="result"]');

// copies short link to clipboard and shows popover
const copy = event => {
    // getting source to copy from
    const range = document.createRange();
    range.selectNode(copyFrom);

    // copying to clipboard
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    // showing popover and hiding it in 2 seconds
    $(copyResultBtn).popover('show');
    setTimeout(() => $(copyResultBtn).popover('hide'), 2000);
};

copyResultBtn.addEventListener('click', copy);

// button that scrolls to cutter section
const scrollToCutterBtn = document.querySelector(
    '[data-appointment="scrollToCutter"]');

// scrolls from welcome section to cutter section
const scrollToCutter = event => {
    const section = document.querySelector(
            '[data-appointment="cutterSection"]');
    scrollToBottom(section);
};

scrollToCutterBtn.addEventListener('click', scrollToCutter);


