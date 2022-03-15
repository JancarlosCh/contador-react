/**
    El serviceworker se utiliza para poner en caché las rutas de nuestro sitio web
    con tal de que la carga del sitio se reduzca y podamos crear una progesive web application
*/

//Creamos un array que almacene todas las rutas que queremos poner en caché
const CACHE_ELEMENTS = [
  "./",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "./styles.css",
  "./components/Contador.js"
]

//Creamos el nombre de nuestro caché
const CACHE_NAME = "v1_cache_contador_react"

/** 
    Para que agregar nuestros elementos al caché debemos poner a la escucha el evento install:

    .addEventListener("nombre del evento", (event) => {Código a ejecutar cuando suceda el evento})
    
    .waitUntil(código que deseo ejecutar) -> Esperar a que suceda algo, en este caso sería ell evento

    caches -> Es un objeto el navegador que permite usar la memoria caché del Dispositivo

    .open(nombre del caché) -> abre el caché de nombre x

    .then((cache) => {} -> Es una promesa devuelta por el método open con la que podremos manipular el objeto cache abierto

    cache.addAll(elementos a almacenar en caché) -> Agrega todos los elementos "rutas" que le pasemos al caché

    .skipWaiting() -> Actualiza el caché automaticamente si hay una nueva versión
*/
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(CACHE_ELEMENTS).then((value) => {
        self.skipWaiting()
      }).catch(console.log)
    })
  )
})

/** 
    Para eliminar del caché storage una versión antigua del caché debemos poner a la escucha el evento activate:
    .addEventListener("activate", (event) => {Código a ejecutar cuando suceda el evento})

    .waitUntil(código que deseo ejecutar) -> Esperar a que suceda algo, en este caso sería ell evento

    caches -> Es un objeto el navegador que permite usar la memoria caché del Dispositivo

    .keys() -> Es un método que nos devolverá todas las claves de todas las del caché almacenadas

    (cacheNames) => {} -> Para capturar los nombres del cachés

    Promise.all() ->  devuelve una promesa que termina correctamente cuando todas las promesas en el argumento iterable han sido concluídas con éxito, o bien rechaza la petición con el motivo pasado por la primera promesa que es rechazada.

    .map(cacheName => {}) -> Recorre cada uno de los cachés

    cacheWhiteList.indexOf(cacheName) === -1 -> verifica si la versión del caché no es la que se encuentra en cacheWhiteList

    caches.delete(cacheName) -> elimina el caché antiguo

    () => self.clients.claim() -> Utiliza el caché para cargar la página en vez de hacer peticiones nuevas
*/

self.addEventListener("activate", (event) => {
  //Se crea una copia la versión del caché anterior
  const cacheWhiteList = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log(cacheNames)
      return Promise.all(cacheNames.map(cacheName => {
        console.log(cacheName)
        return cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
      }))
    }).then(() => self.clients.claim())
  )
})

/** 
    Fetch buscará una nueva versión de nuestros archivos en caché y retornará los datos, en caso que deba colocar en caché una nuevos datos, hará una nueva petición a internet y los almacenará en caché para posteriormente retornarlos al sitio web para ser consumidos
*/

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ? response : fetch(event.request)
    })
  )
})
