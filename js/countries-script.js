const searchButton = document.querySelector('#search-button');
const input = document.querySelector('.input-keyword')
const loading = document.querySelector('.loading')
const alertDanger = document.querySelector('.container.failedFetch')
const countryContainer = document.querySelector('.country-container');

// ketika search diklik
searchButton.addEventListener('click', async function(){
    try {
        loading.innerHTML = showLoading()
        const inputKeyWord = document.querySelector('.input-keyword');
        const countries = await getCountries(inputKeyWord.value);  // fetch API countries
        updateUI(countries);
        loading.innerHTML = ''
        alertDanger.innerHTML = ``
    }
    catch(error) {
        // alert(error)
        countryContainer.innerHTML = '';
        loading.innerHTML = ''
        alertDanger.innerHTML = showFailed()
    }
});

// search ketika input ditekan tombol enter
input.addEventListener('keyup', async function (event) {
    if (event.key == "Enter" && input.value != "") {
        try {
            loading.innerHTML = showLoading()
            const inputKeyWord = document.querySelector('.input-keyword');
            const countries = await getCountries(inputKeyWord.value);  // fetch API countries
            updateUI(countries) 
            loading.innerHTML = ''
            alertDanger.innerHTML = ``
        }
        catch (e) {
            // alert (e)
            countryContainer.innerHTML = '';
            loading.innerHTML = ''
            alertDanger.innerHTML = showFailed()
        }
    }
})

function getCountries(keyword) {
    return fetch("https://restcountries.com/v3.1/name/" + keyword)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);   //dilempar nanti diambil ke "catch"
            }
            return response.json();
        })
        .then(response => {
            if (response.Error === "Not Found") {
                throw new Error (response.Error);
            }
            return response;
        }
    );
}

function updateUI (countries) {
    let cards = "";
    countries.forEach(card => cards += showCards(card));
    const countryContainer = document.querySelector('.country-container');
    countryContainer.innerHTML = cards;
}

// event binding -> ngasih event ke element yang belum ada ketika si event nya sendiri belum dieksekusi
// ketika tombol detail diklik
document.addEventListener('click', async function(element) {
    try {
        if (element.target.classList.contains('modal-detail-button')){
            const ccn3 = element.target.dataset.ccn3;
            const countryDetail = await getCountryDetail(ccn3);
            updateUIdetail(countryDetail);
        }
    }
    catch(error) {
        alert(error)
    }
});

function getCountryDetail(ccn3) {
    return fetch("https://restcountries.com/v3.1/alpha/"+ccn3)
        .then(response => {
            if (!response.ok){
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(result => {
            // console.log(result);
            return result;
        });
}

function updateUIdetail(result){
    const detailBody = showDetail(result);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = detailBody;
}


function showCards (country){
    return `<div class="col-md-4 my-5">
            <div class="card">
                <img src="${country.flags.png}" class="card-img-top" alt="" height=180px>
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Capital: ${country.capital}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#countryDetailModal" data-ccn3=${country.ccn3}>Show Details</a> 
                    </div>
                </div>
            </div>
        </div>`
}

function showDetail (result) {
    const currency = result[0].currencies;
    const currencyName = Object.keys(result[0].currencies);
    const currVal = Object.values(result[0].currencies);
    const currDisplay = currVal.map((c, index) => ` ${currencyName[index]} ${c.name}`)
    // console.log(currDisplay)

    return `<div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <img src="${result[0].coatOfArms.png}" class="img-fluid">
            </div>
            <div class="col-md">
                <ul class="list-group">
                    <li class="list-group-item"><h4>Country Name: ${result[0].name.common}</h4></li>
                    <li class="list-group-item"><strong>Continent: ${result[0].region}</strong></li>
                    <li class="list-group-item"><strong>Sub-Continent: ${result[0].subregion}</strong></li>
                    <li class="list-group-item"><strong>Capital: ${result[0].capital}</strong></li>
                    <li class="list-group-item"><strong>Area: ${result[0].area.toLocaleString()} km\u00B2</strong></li>
                    <li class="list-group-item"><strong>Population: ${result[0].population.toLocaleString()}</strong></li>
                    <li class="list-group-item"><strong>Languages: ${Object.values(result[0].languages)}</strong></li>
                    <li class="list-group-item"><strong>Currencies: ${currDisplay}</strong></li>
                    <li class="list-group-item"><strong>Time Zones: ${result[0].timezones}</strong></li>
                </ul>
            </div>
        </div>
    </div>`
}

function showLoading() {
    return `<div class="d-flex align-items-center">
        <strong role="status">Loading...</strong>
        <div class="spinner-border ms-auto"></div>
    </div>`
}

function showFailed() {
    return `<div class="alert alert-danger" role="alert">
        <strong>Failed to fetch data,</strong> Please try to search another country name or check your connection.
    </div>`
}