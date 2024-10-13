import { iconUrl, setStorage, states } from "./helpers.js";

const form = document.querySelector("form")
const list = document.querySelector("ul")

form.addEventListener("submit", handleSubmit)
list.addEventListener("click", handleClick)

let map;
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let coords = [];
let layerGroup = [];
let marker;

navigator.geolocation.getCurrentPosition(
   loadMap, console.log("Kullanıcı izni yok!")
)

function loadMap(e) {

   coords = [e.coords.latitude, e.coords.longitude]
   map = L.map('map').setView(coords, 13);

   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   layerGroup = L.layerGroup().addTo(map)

   // bulunulan noktanın işaretlenmesi için
   L.marker(coords).addTo(layerGroup).bindPopup("Hi. You are here").openPopup(); 

   renderNoteList(notes) 

   map.on('click', onMapClick);

}

function renderMarker(coords_, note = null) {   
   const ico = iconUrl[note.state]
   const myIcon = createIcon(ico, [60, 60])
   // bir noktayı işaretle
   L.marker(coords_, { icon: myIcon }).addTo(layerGroup).bindPopup(`${note.desc}`)   
}

function createIcon(path, size) {
   let icon = L.icon({
      iconUrl: path,
      iconSize: size,
   })
   return icon
}

// haritaya tıklanınca
function onMapClick(e) {   
   form.style.display = "flex"
   coords = [e.latlng.lat, e.latlng.lng]   
   marker.setLatLng(e.latlng)
}

// form gönderilince
function handleSubmit(e) {
   e.preventDefault()
   const desc = e.target[0].value
   const date = e.target[1].value
   const state = e.target[2].value

   // notes dizisine eleman ekleme
   notes.push({ id: new Date().getTime(), desc, date, state, coords })
   // localeStorage güncellenir
   setStorage(notes)
   renderNoteList(notes)
   form.style.display = "none"
   form.reset()
   coords = []
   
}

// notları listele
function renderNoteList(notes) {
   list.innerHTML = ""

   notes.map((note) => {
      const listItem = document.createElement("li")
      listItem.dataset.id = note.id
      listItem.innerHTML = `      
         <div>               
            <p>${note.desc}</p>
            <table>
               <tr>
                  <td>Tarih</td>
                  <td>: ${note.date}</td>
               </tr>
               <tr>
                  <td>Durum </td>
                  <td>: ${states[note.state]}</td>
               </tr>
            </table>
            <i class="bi bi-x" id="delete"></i>
            <i class="bi bi-airplane-fill" id="fly"></i>
         </div>      
      `
      // list.appendChild(listItem)
      list.insertAdjacentElement("afterbegin", listItem)

      renderMarker(note.coords, note)      

      marker = L.marker(coords).addTo(map);
   })

}

// silme tıklanınca
function handleClick(e){
   const id = e.target.parentElement.parentElement.dataset.id

   if (e.target.id === "delete"){
      notes = notes.filter(item => item.id != id)  
      setStorage(notes)    
      renderNoteList(notes)
   }else if (e.target.id === "fly"){
      const note = notes.find(item => item.id == id)
      map.flyTo(note.coords)
   }
}