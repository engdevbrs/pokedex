var input = document.getElementById("liveToastBtn");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});

const cargaDatos = async () => {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=100&offset=0`);
    const dataStorage = await data.json();
    console.log(dataStorage);
    let getDataStorage = [];
    let dataCharacteristics = [];
    let arrayRand = [];    
    for(let j = 0; j < 20;j++){
        let rand = Math.floor(Math.random() * (100 - 1)) + 1;
        arrayRand.push(rand);
    }
    for(let i = 0; i < 20;i++){
        const homeData = await fetch(`${dataStorage.results[arrayRand[i]].url}`);
        let pokeDataStorage = await homeData.json();
        getDataStorage.push(pokeDataStorage);
        const dataCharacts = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeDataStorage.id}/`);
        if(dataCharacts.status !== 200){
            console.log(`Problema al obtener al pokémon ${pokeDataStorage.name}`);
        }else{
            const characters = await dataCharacts.json();
            dataCharacteristics.push(characters)
        }
    }
    localStorage.setItem("dataLocal",JSON.stringify(getDataStorage));
    localStorage.setItem("dataCharacts",JSON.stringify(dataCharacteristics));
    let getData = localStorage.getItem('dataLocal');
    cards(getData);
}

const comprobarLocalStorage = () => {
    if(localStorage.getItem('dataLocal') === undefined || localStorage.getItem('dataLocal') === null){
        cargaDatos();
    }else{
        cards(localStorage.getItem('dataLocal'));
    }
}

const cards = (dataHome) =>{ 
    JSON.parse(dataHome).forEach(element => {
    let cardTemplate = document.querySelector('.container-fluid');
    let fetch = document.querySelector('.container-fluid').innerHTML;
    cardTemplate.innerHTML = `<div class="card col-lg-4" style="width: 15rem; margin:10px; background: rgb(255,161,0);
    background: radial-gradient(circle, rgba(255,161,0,0.35384576193758754) 0%, rgba(0,36,16,0.6395600476518732) 47%);">
            <img src="${element.sprites.front_default}" class="card-img-top" alt="${element.name}">
            <div class="card-body" id="card" style="text-align:center;">
                <h5 class="card-title"><span style="color: white;">${element.name}</span></h5>
            </div>
            </div>` + fetch;
    });
}

const searchPokemon = async () => {
    let vm = this;
    let pokemonName = document.getElementById('liveToastBtn').value;
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if(data.status === 200){
        const encontrado = await data.json();
        let recentlys = localStorage.getItem('recentsSearchs');
        if(recentlys === null){
            vm.arrayRecents = [];
            let pokemonNameStorage = document.getElementById('liveToastBtn').value;
            vm.arrayRecents.push(pokemonNameStorage);
            localStorage.setItem("recentsSearchs",vm.arrayRecents);
        }else{
            let recentlysArr = recentlys.split(",");
            let pokemonNameStorage = document.getElementById('liveToastBtn').value;
            if(!recentlysArr.includes(pokemonNameStorage)){
                vm.arrayRecents = [recentlys,pokemonNameStorage];
                localStorage.setItem("recentsSearchs",vm.arrayRecents);
            }
        }
        const dataCharacts = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${encontrado.id}/`);
        const characters = await dataCharacts.json();
        modalSearch(encontrado,characters);
    }else{
        console.log(`Problema al obtener al pokémon ${pokemonName}`);
        let noEncontrado = document.querySelector('.modal-content');
        noEncontrado.innerHTML = `<div class="modal-body" style="display:flex; flex-direction: column; justify-content: center; text-align:center;">
                            <h6><span style="color: white;">No se pudo encontrar el pokémon</span></h6>
                            <br>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>`;
    }
}

const modalSearch = (data,characters) => { 

    let searchTemplate = document.querySelector('.modal-content');
    searchTemplate.innerHTML = `
                    <div class="modal-header">
                        <h4 class="modal-title" id="exampleModalLabel"><span style="color: white;">Nombre: ${data.name}</span></h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6><span style="color: white;">Descripción: Es una pokémon que habita en el ${characters.habitat.name} 
                        es de color ${characters.color.name} </span></h6>
                        <br>
                        <h6><span style="color: white;">Experiencia base: ${data.base_experience}</span></h6>
                        <h6><span style="color: white;">Altura: ${data.height}</span></h6>
                        <h6><span style="color: white;">Peso: ${data.weight}</span></h6>
                        <h6><span style="color: white;">Tipo: ${data.types[0].type.name}</span></h6>habitat.name 
                        <h6><span style="color: white;">Categoría: ${characters.genera[6].genus}</span></h6>
                    </div>
                    <div class="modal-footer">
                        <img src="${data.sprites.front_default}" class="d-block" alt="...">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>`;
}

const recentSearch = () => {
    let recentlys = localStorage.getItem('recentsSearchs');
    if(recentlys !== null){
        let arrayRecentlys = recentlys.split(",");
        arrayRecentlys.reverse();
        let searchTemplate = document.querySelector('#liveToast');
        searchTemplate.innerHTML = `
                            <div class="toast-header">
                            <strong class="me-auto">Búsquedas recientes</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                            <span>${
                                arrayRecentlys.map(values => 
                                    `<small>${values}</small>
                                    <br>`
                                ).join("")
                            }</span>
                            </div>`;
    }else{
        let searchTemplate = document.querySelector('#liveToast');
        searchTemplate.innerHTML = `
                            <div class="toast-header">
                            <strong class="me-auto">Búsquedas recientes</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body">
                            <span></span>
                            </div>`;
    }
}

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
if (toastTrigger) {
  toastTrigger.addEventListener('click', () => {
    const toast = new bootstrap.Toast(toastLiveExample)

    toast.show()
  })
}

comprobarLocalStorage();