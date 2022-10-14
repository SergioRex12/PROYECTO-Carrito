const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritobtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners() {
    //Cuando agregas un curso al carrito
    listaCursos.addEventListener('click', agregarCurso);


    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //El motivo del descuento
    const dsc = document.querySelector('#carrito tbody');
    console.log(dsc)
    dsc.addEventListener("mousemove", e => {
        console.log(e.target.classList.contains("motivoDesc"))
        if (e.target.classList.contains("motivoDesc")) {
            const info = document.createElement("div");

            console.log(info)
        }
    });



    //Vaciar carrito 
    vaciarCarritobtn.addEventListener('click', () => {
        articulosCarrito = [];

        limpiarHTML();
    })
}

//Elimina un curso 
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoid = e.target.getAttribute('data-id');

        //Elimina
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoid)
        sincronizarStorage();
        carritoHTML();

    }
}


//Funciones
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Lee el contenido del html al que le dimos click
function leerDatosCurso(curso) {

    const precios = curso.querySelector('.precio').textContent.split('$');
    const precioDespues = precios[2];
    const precioAntes = precios[1];
    const descuento = 92.5;

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precioAntes: precioAntes,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        descuento: descuento,
        total: precioDespues,
        cantidad: 1
    }

    //Revisa si ya existe un elemento en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    console.log(existe)

    if (existe) {
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;

                //Calculamos el precio total
                const precio = parseInt(curso.precio.split("$")[1]);
                curso.total = curso.cantidad * precio;


                return curso; //Devuelve el objeto actualizado
            } else {
                //Ponemos el total en el precio del articulo
                const precio = parseInt(curso.precio.split("$")[1]);
                curso.total = precio;

                return curso; //Devuelve los objetos no duplicados
            }
        })

        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    sincronizarStorage();

    console.log(articulosCarrito);
    carritoHTML();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Muestra el carrito de compras
function carritoHTML() {
    //Limpiar html
    limpiarHTML();

    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        const { imagen, titulo, precioAntes, total, cantidad, descuento, id } = curso;



        row.innerHTML = `
                <td>
                    <img src = '${imagen}' width = 100>
                </td>

                <td> ${titulo} </td>
                <td> ${cantidad} </td>
                <td>$ ${precioAntes} </td>
                <td> ${descuento}%<dv class = 'motivoDesc'> (?)</dv>
                
                </h1>
                <td>$${total} </td>

                <td>
                    <a href = "#" class= "borrar-curso" data-id = "${id}"> X </a>
                </td>
            `;


        //Agrega al HTML
        contenedorCarrito.appendChild(row);
    })
}

function limpiarHTML() {
    //contenedorCarrito.innerHTML = '';

    while (contenedorCarrito.firstChild) {

        contenedorCarrito.removeChild(contenedorCarrito.firstChild);

    }
}