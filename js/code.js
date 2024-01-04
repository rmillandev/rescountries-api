//Variables
const body = document.body,
      regiones = document.querySelector(".regions"),
      inputSearch = document.querySelector(".input-search"),
      btnScrollTop = document.querySelector(".scroll-top"),
      contenedorTarjetas = document.querySelector(".card__grid"),
      contenedorInformacionPais = document.querySelector(".information-country"),
      template = document.getElementById("template").content,
      template2 = document.getElementById("template2").content,
      fragmento = document.createDocumentFragment(),
      fragmento2 = document.createDocumentFragment()


// Funciones
const datosTarjetas = (datos) => {
    //Se le pasa a la funcion los datos que se van a leer, en este caso seria el JSON de la respuesta de la API.
    datos.forEach((elemento) => {
        // En un ciclo ForEach se recorren estos datos y con mi variable template voy agregando los datos a su respectiva etiqueta que esta en el html.
        template.querySelector(".bandera").src = `${elemento.flags.png}`
        template.querySelector(".bandera").alt = `${elemento.name.common}`
        template.querySelector(".bandera").dataset.code = `${elemento.cca2}`
        template.querySelector(".pais").textContent = `${elemento.name.common}`
        template.querySelector(".res-poblacion").textContent = `${elemento.population.toLocaleString()}`
        template.querySelector(".res-region").textContent = `${elemento.region}`
        template.querySelector(".res-capital").textContent = `${elemento.capital}`

        // Al agregar los elementos que se necesitan se importa el template para poder agregarselo al fragmento, es importante que al importarlo, como segundo parametro del metodo importNode se coloque true, para que asi se pueda traer la informacion agregada.
        let clone = document.importNode(template, true)
        fragmento.appendChild(clone)
    })

    contenedorTarjetas.innerHTML = ""
    // Se agrega el fragmento al contenedor donde se mostraran.
    contenedorTarjetas.appendChild(fragmento)
}

const datosPais = (datos) => {
    //Se le pasa a la funcion los datos que se van a leer, en este caso seria el JSON de la respuesta de la API.
    console.log(datos)
    datos.forEach((elemento) => {  
        // En un ciclo ForEach se recorren estos datos y con mi variable template voy agregando los datos a su respectiva etiqueta que esta en el html.

        const nativeName = Object.values(elemento.name.nativeName)[0].official,
              currencies = Object.values(elemento.currencies)[0].name,
              language = Object.values(elemento.languages)
        // Lo que contienen las variables lo obtengo del JSON de la respuesta de la API.

        template2.querySelector(".country__flag img").src = `${elemento.flags.png}`
        template2.querySelector(".country__flag img").alt = `${elemento.flags.alt}`
        template2.querySelector(".country__title").textContent = `${elemento.name.common}`
        template2.querySelector(".res-native-name").textContent = `${nativeName}`
        template2.querySelector(".res-population").textContent = `${elemento.population.toLocaleString()}`
        template2.querySelector(".res-region").textContent = `${elemento.region}`
        template2.querySelector(".res-subregion").textContent = `${elemento.subregion}`
        template2.querySelector(".res-capital").textContent = `${elemento.capital[0]}`
        template2.querySelector(".res-domain").textContent = `${elemento.tld[0]}`
        template2.querySelector(".res-currencies").textContent = `${currencies}`
        template2.querySelector(".res-languages").textContent = `${language}`

        let borderCountries = elemento.borders
        template2.querySelector(".country__box-border div").innerHTML = ""

        if(borderCountries){
            borderCountries.forEach((border) => {
                template2.querySelector(".country__box-border div").innerHTML += `
                <button class="border-country">${border}</button>
            `
            })
        }else{
            template2.querySelector(".country__box-border div").innerHTML += `
                <p>N/A</p>
            `
        }
        // Si el pais que se seleccione no tiene fronteras con ningun pais, entonces se agregara una etiqueta p con N/A que indicara que no tiene fronteras
        

        // Al agregar los elementos que se necesitan se importa el template para poder agregarselo al fragmento, es importante que al importarlo, como segundo parametro del metodo importNode se coloque true, para que asi se pueda traer la informacion agregada.
        let clone = document.importNode(template2, true)
        fragmento2.appendChild(clone)
    })
    contenedorInformacionPais.innerHTML = ""

    contenedorInformacionPais.appendChild(fragmento2)

}

const obtenerPaises = async () => {
    try {

        contenedorTarjetas.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Cargando...">`

        let respuesta = await fetch(`https://restcountries.com/v3.1/all`),
            json = await respuesta.json()
        // llamada y respuesta de la API
        

        if(!respuesta.ok) throw {status: respuesta.status, statusText: respuesta.statusText}

        datosTarjetas(json)
        
    } catch (error) {
        let mensaje = error.statusText || "Ocurrio un error, por favor intente mas tarde."
        console.error(`Error ${error.status}: ${mensaje}`)
        contenedorTarjetas.innerHTML = `<b>Error${error.status}: ${mensaje}</b>`
    }
}

//Eventos
document.addEventListener("DOMContentLoaded", () => {
    obtenerPaises()

    let getMode = localStorage.getItem("darkModeCountry")

    if(getMode && getMode === "dark") body.classList.toggle("dark")
})

window.addEventListener("scroll", () => {
    let scrollTop = window.scrollY

    if(scrollTop > 500){
        btnScrollTop.classList.remove("hidden")
    }else{
        btnScrollTop.classList.add("hidden")
    }
})

// Para no hacer demasiados eventos "click", hago delegacion de eventos y mediante condicionales se elige el elemento con su respectiva clase html al que se ejecutara el evento "click"
document.addEventListener("click", async (e) => {
    if(e.target.matches(".box__filter") || e.target.matches(".box__filter p") || e.target.matches(".box__filter i")) regiones.classList.toggle("show")
    
    if(e.target.matches(".filter-region")){
        try{
            contenedorTarjetas.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Cargando...">`

            let respuesta = await fetch(`https://restcountries.com/v3.1/region/${e.target.textContent.toLowerCase()}`),
                json = await respuesta.json()
            // llamada y respuesta de la API con un endpoint donde se filtran por region los paises


            if(!respuesta.ok) throw {status: respuesta.status, statusText: respuesta.statusText}
            
            datosTarjetas(json)
            
           
        } catch(error){
            let mensaje = error.statusText || "Ocurrio un error, por favor intente mas tarde."
            console.error(`Error ${error.status}: ${mensaje}`)
            contenedorTarjetas.innerHTML = `<b>Error${error.status}: ${mensaje}</b>`
        }
    }

    if(e.target.matches(".filter-all")) obtenerPaises()
    
    if(e.target.matches(".bandera")){
        btnScrollTop.classList.add("hidden")
        inputSearch.value = ""
        document.body.classList.toggle("active")
        contenedorInformacionPais.classList.toggle("show")
        try {
            contenedorInformacionPais.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Cargando...">`

            let respuesta = await fetch(`https://restcountries.com/v3.1/alpha/${e.target.dataset.code}`),
                json = await respuesta.json()

            if(!respuesta.ok) throw {status: respuesta.status, statusText: respuesta.statusText}
            
            datosPais(json)
            
        } catch (error) {
            let mensaje = error.statusText || "Ocurrio un error, por favor intente mas tarde."
            console.error(`Error ${error.status}: ${mensaje}`)
            contenedorInformacionPais.innerHTML = `<b>Error${error.status}: ${mensaje}</b>`
            setTimeout(() => location.reload() ,1000)
        }
    }

    if(e.target.matches(".btnBack") || e.target.matches(".btnBack i")){
        document.body.classList.toggle("active")
        contenedorInformacionPais.classList.toggle("show")
    }

    if(e.target.matches(".border-country")) {
        try {
            contenedorInformacionPais.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Cargando...">`

            let respuesta = await fetch(`https://restcountries.com/v3.1/alpha/${e.target.textContent}`),
                json = await respuesta.json()

            if(!respuesta.ok) throw {status: respuesta.status, statusText: respuesta.statusText}
            
            datosPais(json)
            
        } catch (error) {
            let mensaje = error.statusText || "Ocurrio un error, por favor intente mas tarde."
            console.error(`Error ${error.status}: ${mensaje}`)
            contenedorInformacionPais.innerHTML = `<b>Error${error.status}: ${mensaje}</b>`
        }
    }

    if(e.target.matches(".header__box-mode i") || e.target.matches(".header__box-mode span")){
        body.classList.toggle("dark")

        if(!body.classList.contains("dark")) return localStorage.setItem("darkModeCountry","light")

        return localStorage.setItem("darkModeCountry","dark")
    }

    if(e.target.matches(".scroll-top") || e.target.matches(".scroll-top i")){
        window.scrollTo({
            behavior: "smooth",
            top: 0
        })
    }
})

inputSearch.addEventListener("keyup", (e) => {
    if(e.key === "Escape") inputSearch.value = ""

    const card = document.querySelectorAll(".card")
    
    // Filtrado de paises mediante el input
    card.forEach(el => {
        let nombrePais = el.childNodes[4].previousSibling.innerHTML

        nombrePais.toLowerCase().includes(inputSearch.value.toLowerCase()) ? el.classList.remove("filter") : el.classList.add("filter")
    })
})






