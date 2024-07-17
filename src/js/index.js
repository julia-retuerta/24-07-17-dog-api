// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const breedsSelect = document.getElementById('breeds');
const randomPhotoButtonElement = document.getElementById('random-photo-button');

let breed = null;
let subBreed = null;

const printAllBreeds = breeds => {
  const fragment = document.createDocumentFragment();
  breeds.forEach(breed => {
    const newOption = document.createElement('option');
    newOption.textContent = breed;
    fragment.append(newOption);
  });

  breedsSelect.append(fragment);
};

const fetchData = async url => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getAllBreeds = async () => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    const allBreeds = Object.keys(data.message);
    printAllBreeds(allBreeds);
  } catch (error) {
    console.log(error);
  }
};

const getRandomBreedPhoto = async () => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    const imgUrl = data.message;
  } catch (error) {
    console.log(error);
  }
};

getAllBreeds();
