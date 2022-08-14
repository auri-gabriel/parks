'use strict';

const apiUrl = 'https://developer.nps.gov/api/v1/parks'
const apiKey = '';
const stateCodes = [
  "AL",
  "AK",
  "AS",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FM",
  "FL",
  "GA",
  "GU",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MH",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "MP",
  "OH",
  "OK",
  "OR",
  "PW",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VI",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY"
];

const stateSelector = document.querySelector('#state-selector');

stateCodes.forEach((stateCode) => {
  let option = document.createElement('option');
  option.value = stateCode;
  option.innerText = stateCode;
  stateSelector.appendChild(option);
});

let currentSelected = stateSelector.options[stateSelector.selectedIndex].text;


const handleErrors = (response) => {
  if (!response.ok) {
    throw new Error((response.status + ': ' + response.statusText));
  }
  return response.json();
}

const createRequest = (url, succeed, fail, init) => {
  fetch(url, init)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .then((error) => fail(error));
};

const createCard = (park) => {
  let column = document.createElement('div');
  column.classList.add('col');

  column.innerHTML = `
    <div class="col">
      <div class="card mb-3" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-4 ratio ratio-1x1" style="overflow: hidden;">
            <img src="${park.images[0].url}" class="img-fluid rounded-top" style=" height: 100%; object-fit: cover;" alt="${park.images[0].altText}" />
          </div>
          <div class="col-md-12">
            <div class="card-body">
              <h5 class="card-title">${park.fullName}</h5>
              <p class="card-text">
                ${park.description.substring(0, 150) + '...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  return column;
}

const parksContainer = document.querySelector('#parks');

function makeCards(object) {
  resetCards();
  let parks = object.data;
  parks.forEach((park) => {
    let parkCard = createCard(park);
    parksContainer.appendChild(parkCard);
  })
}

function resetCards() {
  while (parksContainer.firstChild) {
    parksContainer.removeChild(parksContainer.firstChild);
  }
}

//make request on start
createRequest(
  apiUrl + '?stateCode=' + currentSelected + '&api_key=' + apiKey,
  makeCards,
  (error) => { console.log(error) }
);

//make request when selected state changes
stateSelector.addEventListener('change', (e) => {
  currentSelected = stateSelector.options[stateSelector.selectedIndex].text;
  console.log(currentSelected);
  createRequest(
    apiUrl + '?stateCode=' + currentSelected + '&api_key=' + apiKey,
    makeCards,
    (error) => { console.log(error) }
  );
})
