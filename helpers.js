export const setStorage = (data) => {
   // veriyi stringe çeviriyoruz
   const strData = JSON.stringify(data)
   // veriyi localestorage ye kaydediyoruz
   localStorage.setItem("notes", strData)
}

export const states = {
   home: "Ev",
   job: "İş",
   goto: "Gezilecek Yer",
   parking: "Park Yeri"
}

export const iconUrl = {
   home: "./images/home-location.png",
   job: "./images/job-location.png",
   goto: "./images/go-location.png",
   parking: "./images/car-location.png"
}