/**
 * Classe de cotxe amb les propietats matrícula i model. Model és una altra classe. Possam les classes
 * amb la primera lletra majúscula per convenció de format de codi.
 */
class Cotxe {
    constructor(matricula, model) {
        this.matricula = matricula;
        this.model = model;
    }

    /**
     *Amb aquesta funció generam els cotxes que véim a la llista de cotxes donats
     * d'alta
     * @returns {Element}
     */
    getNode() {
        let string = '';
        string += `<div class="ui card">`;
        string += `<div class="content">`;
        string += `<a class="right floated meta">`;
        string += `<i class="remove icon"></i>Remove`;
        string += `</a>`;
        string += `<span class="header">${this.matricula}</span>`;
        string += `<div class="meta">`;
        string += `<b>Model:</b><span>${this.model.nom}</span>`;
        string += `</div>`;
        string += `</div>`;
        string += `<div class="image"><img src="${this.model.image}"></div>`;
        string += `<div class="content">`;
        string += `<span>CALENDAR.</span>`;
        string += `</div>`;
        string += `</div>`;
        let body = new DOMParser().parseFromString(string, 'text/html');
        let icon = body.querySelector('.right.floated.meta');
        let node = body.querySelector('div');
        /**
         * Donam un event al botó d'eliminar per eliminar el cotxe de la llista de cotxes
         * donats d'alta
         */
        icon.addEventListener('click', () => {
            node.remove();
            let index = cotxes.findIndex(c => c.matricula == this.matricula);
            cotxes.splice(index, 1);
        });
        return node
    };
}
/**
 * Classe de model que té com a propietats nom i imatge. La imatge ha de ser una URL.
 */
class Model {
    constructor(nom, image) {
        this.nom = nom;
        this.image = image;
    }
}
/**
 * Array de cotxes creats
 * @type {Array}
 */
cotxes = [];
/**
 * Array de models de cotxes
 * @type {[*]}
 */
models = [
    new Model('tesla', 'https://tctechcrunch2011.files.wordpress.com/2015/08/tesla_model_s.jpg?w=738'),
    new Model('lamborghini', 'https://www.lamborghini.com/es-en/sites/es-en/files/DAM/lamborghini/share%20img/huracan-coupe-facebook-og.jpg'),
];
/**
 *Quan carregam una finestra cridam a la funció bindings
 */
window.onload = () => {
    bindings();
};
/**
 * Aquesta funció el que fa és segmentar cada finestra de la pàgina per després poder interactuar
 * millor amb aquesta, així no haurem de cridar al document sencer quan volguem interactuar amb es
 * DOM, només a la part que volguem
 */
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

    // Menu de la llista de cotxes, li donam un event per quan cliquin on el botó de la pestanya
    btnLlistatCotxes.addEventListener('click', (e) => {
        e.preventDefault(); // No expandeix l'event. No recarga la pàgina
        amagaVistes();
        llevarActiusBotons();
        btnLlistatCotxes.classList.add('active');
        vistaLlistatCotxes.classList.remove('hidden');
        /**
         * generam la llista de cotxes disponibles. Si no tenim cap cotxe disponible mostram el
         * texte "no hi ha cap cotxe registrat"
         * @type {Element}
         */
        const board = document.querySelector('.ui.four.cards');
        board.innerHTML = '';
        if (cotxes.length) {
            cotxes.forEach(c => board.appendChild(c.getNode()));
        } else {
            const h1 = document.createElement('h1');
            h1.className = 'ui header';
            h1.textContent = 'No hi ha cap cotxe registrat';
            board.appendChild(h1)
        }

    });
    /**
     * Event del botó de la pestanya de donar d'alta els cotxes
     */
    btnAltaCotxe.addEventListener('click', (e) => {
        e.preventDefault(); // No expandeix l'event. No recarga la pàgina
        amagaVistes();
        llevarActiusBotons();
        btnAltaCotxe.classList.add('active');
        vistaAltaCotxe.classList.remove('hidden');
        /**
         * Cream un select amb els models disponibles com opcions
         */
        let nodes = generarNodesOpcionsModel();
        let select = vistaAltaCotxe.querySelector('select');
        select.innerHTML = '';
        nodes.forEach(n => select.appendChild(n))
    });
    /**
     * Donam l'event d'enviar al botó de submit del formulari de donar d'alta un cotxe.
     * Quan pitgem sobre aquest botó cridam al mètode generarModel amb nomModel i URLModel
     * com paràmetres
     */
    btnNouModel.addEventListener('click', (e) => {
        e.preventDefault(); // No expandeix l'event. No recarga la pàgina
        amagaVistes();
        llevarActiusBotons();
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

    });
    /**
     * Donam un event de click al botó de la pestanya de donar de baixa un model. Quan
     * l'event s'activa generam un select amb els models disponibles com opcions
     */
    btnBaixaModel.addEventListener('click', (e) => {
        e.preventDefault(); // No expandeix l'event. No recarga la pàgina
        amagaVistes();
        llevarActiusBotons();
        btnBaixaModel.classList.add('active');
        vistaBaixaModel.classList.remove('hidden');

        let nodes = generarNodesOpcionsModel();
        let select = vistaBaixaModel.querySelector('select');
        select.innerHTML = '';
        nodes.forEach(n => select.appendChild(n))


    });
    /**
     * Donam un event al botó de submit de la pestanya de donar de baixa un model. Quan
     * s'activa l'event de click cridam al mètode eliminarModel amb el model elegit com
     * paràmetre.
     * @type {Element}
     */
    let btnEnviarBaixamodel = vistaBaixaModel.querySelector('[type="submit"');
    btnEnviarBaixamodel.addEventListener('click', (e) => {
        e.preventDefault();
        let field = vistaBaixaModel.querySelector('.field');
        //llevam s'error
        field.classList.remove('error');
        let modelElegit = vistaBaixaModel.querySelector('select').value;
        eliminarModel(modelElegit);
    });


    /**
     * Donam un event al botó d'enviar l'alta dels cotxes.
     * @type {Element}
     */
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

        /**
         * Quan la matrícula no té el format requerit, o ja existeix una matrícula igual,
         * tornam error de que no s'han complit les condicions de la matrícula
         */
        if (!checkMatricula(matricula) || existeixMatricula(matricula)) {
            field.classList.add('error');
            return;
        }
        /**
         * Aquesta condició es compleix quan has seleccionat l'opció de crear més d'un cotxe
         * en es formulari. Per prevenir entrades malicioses de l'usuari fèim les següents
         * comprovacions:
         */
        if (serieVehicles) {
            numVehicles = isNaN(numVehicles) ? 2 : +numVehicles; // si no és un nombre deixam un 2, sino el casteam a nombre
            numVehicles = Number.isInteger(numVehicles) ? numVehicles : Number.parseInt(numVehicles); // Si és un enter el passam, sino el transformam en enter
            numVehicles = numVehicles > 20 ? 20 : numVehicles; // Si és major a 20 el deixam com 20
            numVehicles = numVehicles < 2 ? 2 : numVehicles; // Si és menor de 2 el deixam com un 2
            /**
             * Cream un objecte model que coincidi amb el nombre de model que tinguem disponible dins de la llista
             * de models.
             * @type {*}
             */
            let objModel = models.find(m => m.nom === model);
            /**
             * Fèim un primer push d'un cotxe perquè sino ens crearà un cotxe amb la matrícula següent de la que ens
             * hagin passat (evitam que si ens passen E-1234-BBB el programa no se la bota)
             */
            cotxes.push(new Cotxe(matricula, objModel));
            /**
             * Generam els cotxes i donam un alert, restam un a numVehicles perquè ja hem generat un vehicle abans
             */
            for (let i = 0; i < numVehicles - 1; i++) {
                cotxes.push(new Cotxe(generarMatricula(matricula), objModel));
            }
            alert('Afegits ' + numVehicles + ' cotxes nous.')

        }
        /**
         * Si no hem seleccionat l'opció de crear molts cotxes només cream un cotxe
         */
        else {
            let objModel = models.find(m => m.nom === model);
            cotxes.push(new Cotxe(matricula, objModel));
            alert('Nou cotxe afegit, model: ' + model + ", matrícula: " + matricula)
        }

    });

    // Amaga i mostra el formulari de crear més d'un cotxe a la pestanya donar d'alta un cotxe
    let checkboxAltaCotxe = vistaAltaCotxe.querySelector('input[type="checkbox"');
    checkboxAltaCotxe.addEventListener('change', () => {
        vistaAltaCotxe.querySelectorAll('.field')[3].classList.toggle('hidden');
    });

    // Amaga totes les vistes de les pestanyes
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

    /**
     * Llevam la propietat active dels botons de les pestanyes
     */
    function llevarActiusBotons() {
        btnLlistatCotxes.classList.remove('active');
        btnAltaCotxe.classList.remove('active');
        btnNouModel.classList.remove('active');
        btnBaixaModel.classList.remove('active')
    }

}

/**
 * Comprovam que la matrícula sigui correcta
 * @param {string} matricula
 */
function checkMatricula(matricula) {
    const reg = new RegExp(/[E]{1}\-\d{4}\-((([B-D]|[F-H]|[J-N]|[P-T]|[V-Z])){3})/g);
    return reg.test(matricula);
}

/**
 * Generam les opcions en funcions dels models que tenim disponibles.
 * <option value='modelo.nom'>Model.nom<option>
 */
function generarNodesOpcionsModel() {
    return models.map(model => {
        const option = document.createElement('option');
        option.value = model.nom;
        option.textContent = model.nom;
        return option;
    })
}

/**
 * Comprovam que la matrícula no existeix
 * @param {string} matricula
 */
function existeixMatricula(matricula) {
    return cotxes.some(x => x.matricula === matricula)
}

/**
 * Generam la matrícula consecutiva i verificam que no existeix per evitar entrades malicioses de l'usuari
 * @param {string} matricula
 */
function generarMatricula(matricula) {
    let [pais, codi, lletres] = matricula.split('-');
    lletres = +codi + 1 > '9999' ? nuevaslletres(lletres) : lletres;
    codi = +codi + 1 > '9999' ? '0000' : rellenarZeros(+codi + 1);
    let matriculaNova = pais + '-' + codi + '-' + lletres;
    return existeixMatricula(matriculaNova) ? generarMatricula(matriculaNova) : matriculaNova;
}

/**
 * Genera les lletres de la matrícula i les va iterant quan volem canviar la lletra.
 * Si és la última matrícula tornam a començar (E-9999-ZZZ -> E-0000-BBB)
 * @param {string} lletres
 */
function nuevaslletres(lletres) {

    // Si és l'ultima matrícula tornam a començar
    if (lletres == 'ZZZ') {
        return 'BBB';
    }

    const valides = Array.from("BCDFGHJKLMNOPQRSTVWXYZ");
    let arraylletres = Array.from(lletres).map(x => x.toUpperCase()).reverse();

    for (let x = 0; x < arraylletres.length - 1; x++) {
        let index = valides.findIndex(l => l == arraylletres[x]);

        if (index < valides.length - 1) {
            arraylletres[x] = valides[index + 1];
            return arraylletres.reverse().join('')
        }

    }
}

/**
 * En base al número de la matrícula el rellenam de zeros
 * @param {number} codi
 */
function rellenarZeros(codi) {
    codi = codi.toString();
    let zeros = 4 - codi.length;

    for (let i = 0; i < zeros; i++) {
        codi = '0' + codi
    }

    return codi;
}
/**
 * comprovam que el que ens envien per formulari és una URL d'una imatge .png o .jpg
 * @param imatgeModel
 * @returns {boolean}
 */
function checkImatgeModel(imatgeModel) {
    const reg = new RegExp(/(https?:\/\/.*\.(?:png|jpg))/i);
    return reg.test(imatgeModel.value);
}
/**
 * comprovam que el model que ens envien per formulari és un model vàlid dels models que tenim disponibles
 * @param nomModel
 * @returns {boolean}
 */
function checkModel(nomModel) {
    return models.some(model => model.nom.toLowerCase() === nomModel.value.toLowerCase())
}
/**
 * Generam el model
 * @param nomModel
 * @param imatgeModel
 */
function generarModel(nomModel, imatgeModel) {
    if (!checkModel(nomModel) && checkImatgeModel(imatgeModel)) {
        models.push(new Model(nomModel.value, imatgeModel.value));
        alert("s'ha creat el model " + nomModel.value);
    } else {
        alert("ja existeix aquest model, inserta un model nou.");
        pass;
    }
}
/**
 * Eliminam el model que ens envien per formulari
 * @param modelElegit
 */
function eliminarModel(modelElegit) {
    let index = models.findIndex(model => model.nom == modelElegit);
    models.splice(index, 1);
    alert("S'ha eliminat el model " + modelElegit);
}