class Cotxe {
  constructor(matricula, model) {
    this.matricula = matricula;
    this.model = model;
    this.node = this.getNode();
  }

  getNode() {
    const string = `<div class="ui card"><div class="content"><a class="right floated meta"><i class="remove icon"></i>Remove</a><span class="header">${this.matricula}</span><div class="meta"><b>Model:</b><span>${this.model.nom}</span></div></div><div class="image"><img src="${this.model.image}"></div><div class="content"><span>CALENDAR.</span></div></div>`
    let body = new DOMParser().parseFromString(string, 'text/html');
    let icon = body.querySelector('.right.floated.meta')
    icon.addEventListener('click', () => {
      this.node.remove();
      let index = cotxes.findIndex(c => c.matricula == this.matricula);
      cotxes.splice(index, 1);
    })
    return body.querySelector('div');
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
    const nodes = cotxes.map(c => board.appendChild(c.node));
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


    if (!checkMatricula(matricula)) {
      field.classList.add('error')
      return;
    }

    if (serieVehicles) {
      // Multiples cotxes
      // max. 20 cotxes > 20 || no negativos -> 1
      // generarMatricula(matricula) +1 
      // for(x) -> new car ^^

    } else {
      let objModel = models.find(m => m.nom === model)
      cotxes.push(new Cotxe(matricula, objModel))
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
