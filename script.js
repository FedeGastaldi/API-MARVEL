// Claves de la API de Marvel
const publicKey = '9ec6bf585ae2f3cc23d3338ee984c211';
const privateKey = 'a06083e49e78f780a959c13f7c3490dc9a2c58b8';

let currentOffset = 0;
const limit = 20;

// Genera el timestamp y el hash para la autenticación de la API
function generarHash() {
    const timestamp = new Date().getTime();
    const hash = CryptoJS.MD5(timestamp + privateKey + publicKey).toString(CryptoJS.enc.Hex);
    return { timestamp, hash };
}

// Muestra el spinner y oculta las tarjetas
function mostrarSpinner() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('contenedor-personajes').classList.add('oculto');
}

// Oculta el spinner y muestra las tarjetas
function ocultarSpinner() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('contenedor-personajes').classList.remove('oculto');
}

// Obtiene personajes de la API de Marvel
function obtenerPersonajes() {
    mostrarSpinner();
    const { timestamp, hash } = generarHash();
    const offset = Math.floor(Math.random() * 1500); // Offset aleatorio inicial
    const url = `https://gateway.marvel.com/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&offset=${offset}&limit=${limit}&orderBy=-modified`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarPersonajes(data.data.results);
            currentOffset = offset;
        })
        .catch(error => console.error('Error:', error))
        .finally(ocultarSpinner);
}

// Muestra los personajes en tarjetas
function mostrarPersonajes(personajes) {
    const contenedor = document.getElementById('contenedor-personajes');
    contenedor.innerHTML = ''; // Limpia el contenedor

    personajes.forEach(personaje => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');
        tarjeta.innerHTML = `
            <img src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" alt="${personaje.name}">
            <h2>${personaje.name}</h2>
            <p>${personaje.description ? personaje.description : 'Descripción no disponible'}</p>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Filtra los personajes por nombre
function filtrarPersonajes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const personajes = document.querySelectorAll('.tarjeta');

    personajes.forEach(personaje => {
        const nombre = personaje.querySelector('h2').textContent.toLowerCase();
        personaje.style.display = nombre.includes(searchTerm) ? 'block' : 'none';
    });
}

// Paginación
function paginaSiguiente() {
    currentOffset += limit;
    cargarPagina(currentOffset);
}

function paginaAnterior() {
    if (currentOffset >= limit) {
        currentOffset -= limit;
        cargarPagina(currentOffset);
    }
}

// Carga la página de personajes con el offset actual
function cargarPagina(offset) {
    mostrarSpinner();
    const { timestamp, hash } = generarHash();
    const url = `https://gateway.marvel.com/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hash}&offset=${offset}&limit=${limit}&orderBy=-modified`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarPersonajes(data.data.results);
        })
        .catch(error => console.error('Error:', error))
        .finally(ocultarSpinner);
}

// Cargar personajes al inicio
document.addEventListener('DOMContentLoaded', obtenerPersonajes);
