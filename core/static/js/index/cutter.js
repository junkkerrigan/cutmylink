class Converter {
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
            console.log(`idx: ${idx}\nid: ${id}`);
            idx = id % base;
            id = Math.floor(id / base);
            converted += this._alphabet[idx];
        }

        return converted;
    }
}

const cutLinkBtn = document.querySelector(
    'button[data-appointment="cutLink"]');

const hostName = 'localhost:8000';

const createContainer = () => {
    const resultContainer = document.querySelector(
        '[data-appointment="resultContainer"]');
    resultContainer.classList.add('invisible', 'd-block');
};

const showResult = shortLink => {
    const resultContainer = document.querySelector(
        '[data-appointment="resultContainer"]');
    resultContainer.classList.remove('invisible');

    const result = document.querySelector(
        '[data-appointment="result"]');
    result.innerText = `${hostName}/#${shortLink}`;
};

const scrollToSectionBottom = () => {
    const section = document.querySelector(
        '[data-appointment="cutterSection"]');
    section.scrollIntoView(
        {
            block: 'end',
            behavior: 'smooth',
        }
    );
};

const handleLinkBtnClick = event => {
    const input = document.querySelector('input[name="longLink"]');
    const longLink = input.value;
    // TODO: add links validator
    // TODO: check if short url already exists

    let lastId = localStorage.getItem('lastId');

    let curId;

    if (!lastId) {
        curId = 0;
    } else {
        curId = Number(lastId) + 1;
    }

    localStorage.setItem('lastId', curId);

    const c = new Converter();
    const shortLink = c.convert(curId);

    localStorage.setItem(shortLink, longLink);

    const resultPromise = new Promise( resolve => {
        createContainer();
        resolve();
    });
    resultPromise
        .then(() => {
            return new Promise( resolve => {
                scrollToSectionBottom();
                setTimeout(() => resolve(shortLink), 200);
            })
        })
        .then(showResult);
};

cutLinkBtn.addEventListener('click', handleLinkBtnClick);

const redirect = event => {
    if (window.location.hash.length < 1)
        return;

    const shortLink = window.location.hash.substr(1);
    const longLink = localStorage.getItem(shortLink);

    window.location.href = longLink;
};

window.addEventListener('load', redirect);
window.addEventListener('hashchange', redirect);

const copyResultBtn = document.querySelector(
    '[data-appointment="copyResult"]');
const copyFrom =document.querySelector(
    '[data-appointment="result"]');

const copy = event => {
    const range = document.createRange();
    range.selectNode(copyFrom);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    $(copyResultBtn).popover('show');
    setTimeout(() => $(copyResultBtn).popover('hide'), 2000);
};

copyResultBtn.addEventListener('click', copy);



