//Verifica si el service worker es admitido por el navegador
if (navigator.serviceWorker) {
  //Si es admitido enconces registramos uno - >  .register("ruta donde estará")
  navigator.serviceWorker.register("./serviceWorker.js")
}