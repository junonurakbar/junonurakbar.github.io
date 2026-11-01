const searchButton = document.querySelector("#search-button");
const input = document.querySelector(".input-keyword");
const loading = document.querySelector(".loading");
const alertDanger = document.querySelector(".container.failedFetch");
const countryContainer = document.querySelector(".country-container");

// ketika search diklik
searchButton.addEventListener("click", async function () {
  try {
    loading.innerHTML = showLoading();
    const inputKeyWord = document.querySelector(".input-keyword");
    const countries = await getCountries(inputKeyWord.value); // fetch API countries
    updateUI(countries);
    loading.innerHTML = "";
    alertDanger.innerHTML = ``;
  } catch (e) {
    // alert(e)
    countryContainer.innerHTML = "";
    loading.innerHTML = "";
    alertDanger.innerHTML = showFailed(e);
  }
});

// search ketika input ditekan tombol enter
input.addEventListener("keyup", async function (event) {
  if (event.key == "Enter" && input.value != "") {
    try {
      loading.innerHTML = showLoading();
      const inputKeyWord = document.querySelector(".input-keyword");
      const countries = await getCountries(inputKeyWord.value); // fetch API countries
      updateUI(countries);
      loading.innerHTML = "";
      alertDanger.innerHTML = ``;
    } catch (e) {
      // alert (e)
      countryContainer.innerHTML = "";
      loading.innerHTML = "";
      alertDanger.innerHTML = showFailed(e);
    }
  }
});

async function getCountries(keyword) {
  return fetch(
    "https://api.restcountries.com/countries/v5/name?q=" +
      keyword +
      "&pretty=1",
    {
      headers: {
        Authorization: "Bearer rc_live_自分のAPIキーを使ってください",
      },
    },
  )
    .then((response) => {
      //console.log(response);
      if (response.status !== 200) {
        throw new Error("Rest Countries API denied the request."); //dilempar nanti diambil ke "catch"
      }
      return response.json();
    })
    .then((response) => {
      //console.log(response.data.objects); // array isinya object
      if (response.Error === "Not Found") {
        throw new Error(response.Error);
      }
      response.data.meta.limit = 100;
      if (response.data.objects.length === 0) {
        //console.log(response);
        throw new Error("countries not found");
      }
      //return response.data.objects;
      return response.data.objects;
    });
}

async function getCountryDetail(ccn3) {
  return fetch(
    "https://api.restcountries.com/countries/v5/names.common/" + ccn3,
    {
      headers: {
        Authorization: "Bearer rc_live_自分のAPIキーを使ってください",
      },
    },
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((result) => {
      //console.log(result);
      return result.data.objects;
    });
}

function updateUI(countries) {
  //console.log(countries);
  let cards = "";
  countries.forEach((card) => {
    cards += showCards(card);
  });
  const countryContainer = document.querySelector(".country-container");
  countryContainer.innerHTML = cards;
}

// event binding -> ngasih event ke element yang belum ada ketika si event nya sendiri belum dieksekusi
// ketika tombol detail diklik
document.addEventListener("click", async function (element) {
  try {
    if (element.target.classList.contains("modal-detail-button")) {
      const ccn3 = element.target.dataset.ccn3;
      const countryDetail = await getCountryDetail(ccn3);
      updateUIdetail(countryDetail);
    }
  } catch (error) {
    alert(error);
  }
});

function updateUIdetail(result) {
  //console.log(result);
  const detailBody = showDetail(result);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = detailBody;
}

function showCards(country) {
  //console.log(country);
  const capitals = country.capitals.map((city) => ` ${city.name}`);
  return `<div class="col-md-4 my-5">
            <div class="card">
                <img src="${country.flag.url_png}" class="card-img-top" alt="" height=180px>
                    <div class="card-body">
                        <h5 class="card-title">${country.names.common}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Capital: ${capitals}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#countryDetailModal" data-ccn3="${country.names.common}">Show Details</a> 
                    </div>
                </div>
            </div>
        </div>`;
}

function showDetail(result) {
  console.log(result[0]);
  //const currency = result[0].currencies;
  //const currencyName = Object.keys(result[0].currencies);
  //const currVal = Object.values(result[0].currencies);
  const currDisplay = result[0].currencies.map((c) => ` ${c.name} (${c.code})`);
  const capitals = result[0].capitals.map((city) => ` ${city.name}`);
  const languages = result[0].languages.map((language) => ` ${language.name}`);
  const areas = `${result[0].area.kilometers.toLocaleString()} km\u00B2/ ${result[0].area.miles.toLocaleString()} mi\u00B2`;
  // console.log(currDisplay)
  return `<div class="container-fluid">
        <!--<div class="row-sm-4">
            <div class="row-sm-4">
                <img src="${result[0].flag.url_svg}" class="img-fluid">
            </div>-->
            <div class="col-md">
                <ul class="list-group">
                    <li class="list-group-item"><h4>Country Name: ${result[0].names.common}</h4></li>
                    <li class="list-group-item"><strong>Continent: ${result[0].region}</strong></li>
                    <li class="list-group-item"><strong>Sub-Continent: ${result[0].subregion}</strong></li>
                    <li class="list-group-item"><strong>Capital: ${capitals}</strong></li>
                    <li class="list-group-item"><strong>Area: ${areas}</strong></li>
                    <li class="list-group-item"><strong>Population: ${result[0].population.toLocaleString()}</strong></li>
                    <li class="list-group-item"><strong>Languages: ${languages}</strong></li>
                    <li class="list-group-item"><strong>Currencies: ${currDisplay}</strong></li>
                    <li class="list-group-item"><strong>Time Zones: ${result[0].timezones.map((t) => ` ${t}`)}</strong></li>
                </ul>
            </div>
        </div>
    </div>`;
}

function showLoading() {
  return `<div class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto"></div>
    </div>`;
}

function showFailed(e) {
  //console.log(e);
  return `<div class="alert alert-danger" role="alert">
        <strong>Failed to fetch data,</strong> Either try to search another country name or check your connection or maybe the API has exceeded the limit.
        <span>${e}</span>
    </div>`;
}
