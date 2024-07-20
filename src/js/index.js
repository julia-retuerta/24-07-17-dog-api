// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const breedsSelectElement = document.getElementById('breeds');
const randomPhotoButtonElement = document.getElementById('random-photo-button');
const randomImageElement = document.getElementById('random-image');
let subBreedsSelectElement = null;

// Almacenan la raza y subraza seleccionada
let breed = null;
let subBreed = null;

// Función para añadir todas las razas al primer select
const printAllBreeds = breeds => {
  const fragment = document.createDocumentFragment();

  // Crear una opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = 'default';
  defaultOption.textContent = 'Select breed';
  fragment.append(defaultOption);

  // Crear una opción por cada raza
  breeds.forEach(breed => {
    const newOption = document.createElement('option');
    newOption.value = breed;
    newOption.textContent = breed;
    fragment.append(newOption);
  });

  // Añadir las opciones al select
  breedsSelectElement.append(fragment);
};

// Función para ir a una URL y devolver los datos
const fetchData = async url => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Función para obtener todas las razas y pasarlas a printAllBreeds
const getAllBreeds = async () => {
  const data = await fetchData('https://dog.ceo/api/breeds/list/all');
  const allBreeds = Object.keys(data.message); // Obtiene las llaves (razas) del objeto (un array con los nombres de todas las razas)
  printAllBreeds(allBreeds); // Llama a la función para imprimir las razas en el select
};

// Función para obtener las subrazas de una raza específica
const getSubBreeds = async breed => {
  const data = await fetchData(`https://dog.ceo/api/breed/${breed}/list`);
  return data.message;
};

// Función para obtener una foto aleatoria de una raza (o subraza) seleccionada
const getRandomBreedPhoto = async () => {
  let url = `https://dog.ceo/api/breed/${breed}/images/random`;
  if (subBreed) {
    url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`;
  }
  const data = await fetchData(url);
  randomImageElement.src = data.message; // Muestra la imagen en el elemento img
};

// Función para crear y actualizar el segundo select (subrazas)
const createSubBreedsSelect = subBreeds => {
  if (subBreeds.length === 0) {
    if (subBreedsSelectElement) {
      subBreedsSelectElement.classList.add('d-none');
      subBreedsSelectElement.textContent = ''; // Limpiar opciones anteriores
    }
    subBreed = null; // Si no hay subrazas, también se reinicia la subraza seleccionada
    return;
  }

  // Si el segundo select no existe, lo crea
  if (!subBreedsSelectElement) {
    subBreedsSelectElement = document.createElement('select');
    subBreedsSelectElement.id = 'subBreeds';
    breedsSelectElement.parentElement.append(subBreedsSelectElement);
  } else {
    subBreedsSelectElement.textContent = '';
  }

  // Limpiar las opciones del select antes de añadir las nuevas
  subBreedsSelectElement.textContent = '';

  const fragment = document.createDocumentFragment();

  // Si hay más de una subraza, añade una opción por defecto
  if (subBreeds.length > 1) {
    const defaultOption = document.createElement('option');
    defaultOption.value = 'default';
    defaultOption.textContent = 'Select sub-breed';
    fragment.append(defaultOption);
  }

  // Crear una opción por cada subraza
  subBreeds.forEach(subBreed => {
    const newOption = document.createElement('option');
    newOption.value = subBreed;
    newOption.textContent = subBreed;
    fragment.append(newOption);
  });

  // Añadir las opciones al select
  subBreedsSelectElement.append(fragment);
  subBreedsSelectElement.classList.remove('d-none');
  subBreedsSelectElement.addEventListener('change', selectSubBreed);
};

// Función para manejar la selección de una raza
const selectBreed = async event => {
  const value = event.target.value;
  if (value === 'default') {
    breed = null;
    if (subBreedsSelectElement) {
      subBreedsSelectElement.classList.add('d-none');
      subBreedsSelectElement.textContent = ''; // Limpiar opciones anteriores
    }
    return;
  }

  breed = value; // Actualiza la raza seleccionada (obtiene el valor seleccionado en el select)
  subBreed = null; // Reinicia la subraza seleccionada
  const subBreeds = await getSubBreeds(breed); // Obtiene las subrazas de la raza seleccionada
  createSubBreedsSelect(subBreeds); // Crea el select de subrazas
};

// Función para manejar la selección de una subraza
const selectSubBreed = event => {
  if (event.target.value === 'default') {
    subBreed = null;
  } else {
    subBreed = event.target.value; // Actualiza la subraza seleccionada
  }
};

// Inicializa el primer select con todas las razas
getAllBreeds();

randomPhotoButtonElement.addEventListener('click', getRandomBreedPhoto);
breedsSelectElement.addEventListener('change', selectBreed);
