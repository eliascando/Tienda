const productosTable = document.getElementById('productosTable');
document.getElementById('agregar').addEventListener('click', agregarProducto);

document.getElementById('buscarProducto').addEventListener('input', function(event) {
  const filtroNombre = event.target.value;
  cargarProductos(filtroNombre);
});

let formatoMoneda = valor => {
  return valor.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

async function cargarProductos(filtroNombre = '') {
  try {
    const response = await fetch('https://localhost:7220/api/productos');
    const productos = await response.json();

    //console.log(productos);

    let rows = '';
    productos.reverse();
    productos.forEach(producto => {
      if (filtroNombre === '' || producto.descripcion.toLowerCase().includes(filtroNombre.toLowerCase())) {
        const row = `
          <tr>
            <td>${producto.id}</td>
            <td>${producto.descripcion}</td>
            <td>${formatoMoneda(producto.precio)}</td>
          </tr>
        `;
        rows += row;
      }
    });

    productosTable.innerHTML = `<table>${rows}</table>`;
  } catch (error) {
    console.error(error);
  }
}

cargarProductos();

async function agregarProducto(event) {
  event.preventDefault();
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;

  try {
    await fetch('https://localhost:7220/api/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ descripcion, precio })
    });
    await cargarProductos();
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
  } catch (error) {
    console.error(error);
  }
}