'use strict';

const apiUrl = 'https://developer.nps.gov/api/v1/parks'
const apiKey = 'ZcHO2ebUqyQoC9hSnBbMgqdRtDnPDMrghu7zUbOT';
const stateJsonUrl = '../assets/states.json';


const handleErrors = (response) => {
  if (!response.ok) {
    throw new Error((response.status + ': ' + response.statusText));
  }
  return response.json();
}
/**
 * 
 * @param {string} url - The URL to fetch from
 * @param {function} succeed - function to execute on success
 * @param {function} fail - function to execute on fail
 */
const createRequest = (url, succeed, fail) => {
  fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .then((error) => fail(error));
};
const stateSelector = document.querySelector('#state-selector');

/**
 * 
 * @param {object} data 
 */
const fillStatesSelector = (data) => {
  data.forEach((state) => {
    let option = document.createElement('option');
    option.value = state.abbreviation;
    option.innerText = state.name;
    stateSelector.appendChild(option);
  }
  );

  //after filling the selector with values
  //we call requestParksAndMakeCards with the current selected value.
  requestParksAndMakeCards(stateSelector.value);
}

/** 
* Fetch the states.json and pass it to fillStatesSelector
*/
createRequest(
  stateJsonUrl,
  fillStatesSelector,
  (error) => { console.log(error) }
);


/**
 * 
 * @param {object} park - Object with park information
 * @returns {string} column - a column element with the park card
 */
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

/**
 * Access the data array in the object and call the create card for each item
 * @param {object} object - Response from the request
 */
function makeCards(object) {
  resetCards();
  let parks = object.data;
  parks.forEach((park) => {
    let parkCard = createCard(park);
    parksContainer.appendChild(parkCard);
  })
}
/**
 * Remove all cards from the page.
 */
function resetCards() {
  while (parksContainer.firstChild) {
    parksContainer.removeChild(parksContainer.firstChild);
  }
}

let currentSelected = stateSelector.value;

/**
 * Requests the parks from a state and make the cards
 * @param {string} currentSelected - the state abbreviation we want to request the parks
 */
const requestParksAndMakeCards = (currentSelected) => {
  createRequest(
    apiUrl + '?stateCode=' + currentSelected + '&api_key=' + apiKey,
    makeCards,
    (error) => { console.log(error) }
  )
};

//make request when selected state changes
stateSelector.addEventListener('change', (e) => {
  currentSelected = stateSelector.value;
  console.log(currentSelected);
  requestParksAndMakeCards(currentSelected);
})
