class Cotxe {
  constructor(matricula, model) {
    this.matricula = matricula;
    this.model = model;
  }

  getNode() {
    let string = '';
    string += `<div class="ui card">`;
    string += `<div class="content">`;
    string += `<a class="right floated meta">`
    string += `<i class="remove icon"></i>Remove`
    string += `</a>`;
    string += `<span class="header">${this.matricula}</span>`;
    string += `<div class="meta">`
    string += `<b>Model:</b><span>${this.model.nom}</span>`
    string += `</div>`
    string += `</div>`
    string += `<div class="image"><img src="${this.model.image}"></div>`
    string += `<div class="content">`
    string += `<span>CALENDAR.</span>`
    string += `</div>`
    string += `</div>`
    let body = new DOMParser().parseFromString(string, 'text/html');
    let icon = body.querySelector('.right.floated.meta')
    let node = body.querySelector('div');
    icon.addEventListener('click', () => {
      node.remove();
      let index = coches.findIndex(c => c.matricula == this.matricula);
      coches.splice(index, 1);
    })
    return node
  };
}

class Model {
  constructor(nom, image) {
    this.nom = nom;
    this.image = image;
  }
}

coches = [];
models = [
  new Model('tesla', 'https://tctechcrunch2011.files.wordpress.com/2015/08/tesla_model_s.jpg?w=738'),
  new Model('lamborghini', 'https://www.lamborghini.com/es-en/sites/es-en/files/DAM/lamborghini/share%20img/huracan-coupe-facebook-og.jpg'),
];

window.onload = () => {
  bindings();
}

function bindings() {
  // Botons
  let btnLlistatCotxes = document.querySelector('#llistatCotxes');
  let btnAltaCotxe = document.querySelector('#altaCotxe');
  let btnNouModel = document.querySelector('#nouModel');
  let btnBaixaModel = document.querySelector('#baixaModel');

  // Vistes
  let vistaLlistatCotxes = document.querySelector('#vistaLlistatCotxes');
  let vistaAltaCotxe = document.querySelector('#formNouCotxe');
  let vistaNouModel = document.querySelector('#formNouModel');
  let vistaBaixaModel = document.querySelector('#formEliminarModel');


  // Amagem totes les vistes al començar
  amagaVistes();

  // Menu
  btnLlistatCotxes.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    removerActivosBotones();
    btnLlistatCotxes.classList.add('active');
    vistaLlistatCotxes.classList.remove('hidden');

    const board = document.querySelector('.ui.four.cards');
    board.innerHTML = '';
    if (coches.length) {
      coches.forEach(c => board.appendChild(c.getNode()));
    } else {
      const h1 = document.createElement('h1');
      h1.className = 'ui header';
      h1.textContent = 'No hi ha cap cotxe registrat'
      board.appendChild(h1)
    }
    // Mostrar mensaje correcto o redirigir vista.

  })

  btnAltaCotxe.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    removerActivosBotones();
    btnAltaCotxe.classList.add('active');
    vistaAltaCotxe.classList.remove('hidden')

    let nodes = generarNodosOpcionesModelo();
    let select = vistaAltaCotxe.querySelector('select');
    select.innerHTML = '';
    nodes.forEach(n => select.appendChild(n))
  })

  btnNouModel.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    removerActivosBotones();
    btnNouModel.classList.add('active');
    vistaNouModel.classList.remove('hidden');

    let btnEnviarAltaCotxe = vistaNouModel.querySelector('[type="submit"');
    btnEnviarAltaCotxe.addEventListener('click', (e) => {
        e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    let field = vistaAltaCotxe.querySelector('.field');
    // Llevam s'error
    field.classList.remove('error');

    let nomModel = vistaNouModel.querySelector('input[type="text"');
    let URLModel = vistaNouModel.querySelector('input[type="url"');
    generarModel(nomModel, URLModel);
}
)

  })

  btnBaixaModel.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    removerActivosBotones();
    btnBaixaModel.classList.add('active');
    vistaBaixaModel.classList.remove('hidden');

    let nodes = generarNodosOpcionesModelo();
    let select = vistaBaixaModel.querySelector('select');
    select.innerHTML = '';
    nodes.forEach(n => select.appendChild(n))



  })

    let btnEnviarBaixamodel = vistaBaixaModel.querySelector('[type="submit"');
    btnEnviarBaixamodel.addEventListener('click', (e) => {
        e.preventDefault();
    let field = vistaBaixaModel.querySelector('.field');
    //llevam s'error
    field.classList.remove('error');
    let modelElegit = vistaBaixaModel.querySelector('select').value;
    eliminarModel(modelElegit);
    })



  // Formulari Nou Cotxe
  let subAltaCotxe = vistaAltaCotxe.querySelector('[type="submit"');
  subAltaCotxe.addEventListener('click', (e) => {
    e.preventDefault();
    let field = vistaAltaCotxe.querySelector('.field');
    // Llevam s'error
    field.classList.remove('error');

    let matricula = vistaAltaCotxe.querySelector('input[type="text"').value;
    let model = vistaAltaCotxe.querySelector('select').value;
    let serieVehicles = vistaAltaCotxe.querySelector('input[type="checkbox"').checked;
    let numVehicles = vistaAltaCotxe.querySelector('input[type="number"]').value;


    if (!checkMatricula(matricula) || existeMatricula(matricula)) {
      field.classList.add('error')
      return;
    }

    if (serieVehicles) {
      numVehicles = isNaN(numVehicles) ? 2 : +numVehicles; // Sino es numero, lo convertimos a 2, sino lo casteamos a number
      numVehicles = Number.isInteger(numVehicles) ? numVehicles : Number.parseInt(numVehicles) // Es entero
      numVehicles = numVehicles > 20 ? 20 : numVehicles; // No es mayor a 20
      numVehicles = numVehicles < 2 ? 2 : numVehicles; // Ni menor a 2

      let objModel = models.find(m => m.nom === model)
      for (let i = 0; i < numVehicles; i++) {
        coches.push(new Cotxe(generarMatricula(matricula), objModel));
      }
      alert('Afegit ' + numVehicles + ' coches nou.')

    } else {
      let objModel = models.find(m => m.nom === model)
      coches.push(new Cotxe(matricula, objModel))
      alert('Nou cotxe afegit: ' + matricula)
    }

  })

  // Amaga i mostra el checkbox del formulari Nou Cotxe
  let checkboxAltaCotxe = vistaAltaCotxe.querySelector('input[type="checkbox"')
  checkboxAltaCotxe.addEventListener('change', () => {
    vistaAltaCotxe.querySelectorAll('.field')[3].classList.toggle('hidden');
  })

  // Amaga totes les vistes
  function amagaVistes() {
    if (!vistaLlistatCotxes.classList.contains('hidden')) {
      vistaLlistatCotxes.classList.add('hidden')
    }

    if (!vistaAltaCotxe.classList.contains('hidden')) {
      vistaAltaCotxe.classList.add('hidden')
    }

    if (!vistaNouModel.classList.contains('hidden')) {
      vistaNouModel.classList.add('hidden')
    }

    if (!vistaBaixaModel.classList.contains('hidden')) {
      vistaBaixaModel.classList.add('hidden')
    }
  }

  function removerActivosBotones() {
    btnLlistatCotxes.classList.remove('active') 
    btnAltaCotxe.classList.remove('active') 
    btnNouModel.classList.remove('active') 
    btnBaixaModel.classList.remove('active') 
  }

}

/**
 * Comprueba que ninguno de nuestros coches no tiene la matricula
 * @param {string} matricula 
 */
function checkMatricula(matricula) {
  const reg = new RegExp(/[E]{1}\-\d{4}\-((([B-D]|[F-H]|[J-N]|[P-T]|[V-Z])){3})/g)
  return reg.test(matricula);
}

/**
 * Genera nodos de opciones en base a los modelos que hay.
 * <option value='modelo.nom'>Model.nom<option>
 */
function generarNodosOpcionesModelo() {
  return models.map(model => {
    const option = document.createElement('option');
    option.value = model.nom;
    option.textContent = model.nom;
    return option;
  })
}

/**
 * Comprueba que ningun coche tiene la misma matricula
 * @param {string} matricula 
 */
function existeMatricula(matricula) {
  return coches.some(x => x.matricula === matricula)
}

/**
 * Generar la matricula consecuitva y comprueba que no existe.
 * @param {string} matricula 
 */
function generarMatricula(matricula) {
  let [pais, codi, letras] = matricula.split('-');
  letras = +codi + 1 > '9999' ? nuevasLetras(letras) : letras;
  codi = +codi + 1 > '9999' ? '0000' : rellenarZeros(+codi + 1);
  let nuevaMatricula = pais + '-' + codi + '-' + letras;
  return existeMatricula(nuevaMatricula) ? generarMatricula(nuevaMatricula) : nuevaMatricula;
}

/**
 * Genera una nueva string de las letras de la matricula, y devuelve la consecuitva. 
 * Si es la última, vuelve a empezar. 
 * @param {string} letras 
 */
function nuevasLetras(letras) {

  // És el unico caso, volvemos a empezar
  if (letras == 'ZZZ') {
    return 'BBB';
  }

  const valides = Array.from("BCDFGHJKLMNOPQRSTVWXYZ");
  let arrayLetras = Array.from(letras).map(x => x.toUpperCase()).reverse();

  for (let x = 0; x < arrayLetras.length - 1; x++) {
    let index = valides.findIndex(l => l == arrayLetras[x]);

    if (index < valides.length - 1) {
      arrayLetras[x] = valides[index + 1]
      return arrayLetras.reverse().join('')
    }

  }
}

/**
 * En base a un numero, rellenar zeros a la derecha hasta llegar a 4
 * @param {number} codigo 
 */
function rellenarZeros(codigo) {
  codigo = codigo.toString()
  let zeros = 4 - codigo.length;

  for (let i = 0; i < zeros; i++) {
    codigo = '0' + codigo
  }

  return codigo;
}

function checkImatgeModel(imatgeModel) {
    const reg = new RegExp(/(https?:\/\/.*\.(?:png|jpg))/i);
    return reg.test(imatgeModel.value);
}

function checkModel(nomModel, imatgeModel){
    return models.some(model => model.nom.toLowerCase() === nomModel.value.toLowerCase())
}

function existeMatricula(matricula) {
    return coches.some(x => x.matricula === matricula)
}

function generarModel(nomModel, imatgeModel){
    if(!checkModel(nomModel, imatgeModel) && checkImatgeModel(imatgeModel)) {
        models.push(new Model(nomModel.value, imatgeModel.value));
        alert("s'ha creat el model " + nomModel.value);
    }else{
        alert("ja existeix aquest model, inserta un model nou.");
        pass;
    }
}

function eliminarModel(modelElegit) {
    for (var i = 0; i < models.length; i++) {
        if (models[i].nom === modelElegit) {
            models.splice(i, 1);
            alert("s'ha eliminat el model " + modelElegit);
        }
    }
}