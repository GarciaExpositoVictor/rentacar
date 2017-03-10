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
      let index = cotxes.findIndex(c => c.matricula == this.matricula);
      cotxes.splice(index, 1);
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

cotxes = [];
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
  // let vistaNouModel = document.querySelector('#nouModel');
  // let vistaBaixaModel = document.querySelector('#baixaModel');


  // Amagem totes les vistes al començar
  amagaVistes();

  // Menu
  btnLlistatCotxes.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    vistaLlistatCotxes.classList.remove('hidden');

    const board = document.querySelector('.ui.four.cards');
    board.innerHTML = '';
    const nodes = cotxes.map(c => board.appendChild(c.getNode()));
    // Mostrar mensaje correcto o redirigir vista.

  })

  btnAltaCotxe.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
    amagaVistes();
    vistaAltaCotxe.classList.remove('hidden')

    let nodes = generarNodesOpcions();
    let select = vistaAltaCotxe.querySelector('select');
    select.innerHTML = '';
    nodes.forEach(n => select.appendChild(n))
  })

  btnNouModel.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
  })

  btnBaixaModel.addEventListener('click', (e) => {
    e.preventDefault(); // No expandeix l'event. No recarga la pàgina
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


    if (!checkMatricula(matricula) || matriculaExisteix(matricula)) {
      field.classList.add('error')
      return;
    }

    if (serieVehicles) {
      numVehicles = isNaN(numVehicles) ? 2 : +numVehicles; // Sino es numero, lo convertimos a 2, sino lo casteamos a number
      numVehicles = Number.isInteger(numVehicles) ? numVehicles : Number.parseInt(numVehicles) // Es entero
      numVehicles = numVehicles > 20 ? 20 : numVehicles; // No es mayor a 20
      numVehicles = numVehicles < 2 ? 2 : numVehicles; // Ni menor a 2

      let objModel = models.find(m => m.nom === model)
      for(let i = 0; i < numVehicles; i++) {
        cotxes.push(new Cotxe(generarMatricula(matricula), objModel));
      }
      alert('Afegit ' + numVehicles + ' cotxes nou.')

    } else {
      let objModel = models.find(m => m.nom === model)
      cotxes.push(new Cotxe(matricula, objModel))
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
  }


}

function checkMatricula(matricula) {
  const reg = new RegExp(/[E]{1}\-\d{4}\-((([B-D]|[F-H]|[J-N]|[P-T]|[V-Z])){3})/g)
  return reg.test(matricula);
}

function generarNodesOpcions() {
  return models.map(model => {
    const option = document.createElement('option');
    option.value = model.nom;
    option.textContent = model.nom;
    return option;
  })
}


function matriculaExisteix(matricula) {
  return cotxes.some(x => x.matricula === matricula)
}

function generarMatricula(matricula) {
  let [ pais, codi, lletres] = matricula.split('-');
  codi = +codi + 1 > 9999 ? 0000 : +codi + 1;
  lletres = novesLletres(lletres);
  return pais + '-' + codi + '-' + lletres
}

function novesLletres(lletres) {
  const valides = Array.from("BCDFGHJKLMNOPQRSTVWXYZ");
  let array = Array.from(lletres).map(x => x.toUpperCase());
  return array.map(lletra => {
    let index = valides.findIndex(x => x == lletra);
    return index == valides.length ? valides[0] : valides[index+1];   
  }).join('');
}

function generarMatricula(matricula) {
  let [ pais, codi, lletres] = matricula.split('-');
  lletres = +codi + 1 > '9999' ? novesLletres(lletres) : lletres;
  codi = +codi + 1 > '9999' ? '0000' : inflarCodi(+codi + 1);
  let nuevaMatricula = pais + '-' + codi + '-' + lletres;
  return matriculaExisteix(nuevaMatricula) ? generarMatricula(nuevaMatricula) : nuevaMatricula;
}

function novesLletres(lletres) {

  // Es el unico caso, volvemos a empezar
  if (lletres == 'ZZZ'){
    return 'BBB';
  }
  
  const valides = Array.from("BCDFGHJKLMNOPQRSTVWXYZ");
  let arrayLletres = Array.from(lletres).map(x => x.toUpperCase()).reverse();
 
  for(let x = 0; x < arrayLletres.length - 1; x++){
    let index = valides.findIndex(l => l == arrayLletres[x]);

    if (index < valides.length - 1){
      arrayLletres[x] = valides[index + 1]
      return arrayLletres.reverse().join('')
    }
   
  }
}

function inflarCodi(codi) {
  codi = codi.toString()
  let zeros = 4 - codi.length;
  
  for(let i = 0; i < zeros; i++) {
    codi = '0' + codi
  }
  
  return codi;
}