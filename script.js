let isLeft = { value: false };
let isExpanse = { value: false };
var myButton = document.getElementById('submit');
var otherDay = document.getElementById('otherDay');
const specialDay = document.getElementById('specialDay');
const contentDateDivByHour = document.querySelector('.contentDateDivByHour');
const checkBox = document.getElementById("checkbox")

  main();

  function main(){
    myButton.addEventListener('click', function(event) {
      event.preventDefault();
    if(specialDay.classList == "leftActive"){
      specialDay.classList.remove('leftActive')
      isLeft = false
    }
    devellopement(otherDay,"active",weather,isExpanse)
    });
  }
  

  /**
   * fonction qui retourne les informations de la meteo
   */
  function weather() {
    //on selectionne la div otherday et on la vide
    const otherDay = document.getElementById("otherDay");
    otherDay.innerHTML = " "

    //on recupere le nom de la ville et on la place dans l'url du fetch pour avoir les info corespondantes
    var city = document.getElementById("localisation").value;
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=fr&units=metric&appid=928811eb9effc3558fc3b73f31614bf2`;
    window.fetch(apiURL)
    .then(res => {
      if(!res.ok){
        throw new Error('Network response was not ok');
      }
      return res.json()
    })
    .then(resJson => {

        //on recupere le nom de la ville et on la mets dans un h1
        const city = document.createElement("h1")
        city.classList.add('city')
        city.innerHTML = resJson.city.name;
        otherDay.appendChild(city)

        //on trie par date resJson
        const groupedData = resJson.list.reduce((acc, obj) => {
          const date = obj.dt_txt.split(' ')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(obj);
        
          return acc;
        }, {});

        //pour chaque entree dans groupData on met la date comme clef et on trie les infos que l'on veut renvoyer par heure et on cree nos div
        for (const [key, value] of Object.entries(groupedData)) {

          const date = dateFormat(key)
          const hour = value.map(x=>x.dt_txt.substring(11, 19))
          const temp = value.map(x => x.main.temp)
          const description = value.map(x => x.weather[0].description)
          const weatherIconCode = value.map(x => x.weather[0].icon)

          const dateAndContentDiv = document.createElement("div")
          otherDay.appendChild(dateAndContentDiv)
          dateAndContentDiv.classList.add("separate")

          const dateDiv = document.createElement("h2");
          dateDiv.classList.add(key)
          dateDiv.innerHTML = firstLetter(date)
          dateAndContentDiv.appendChild(dateDiv)

          const contentDateDiv = document.createElement("div");
          dateAndContentDiv.appendChild(contentDateDiv)
          contentDateDiv.classList.add("contentDateDiv")


          for (let i = 0; i < value.length; i++) {
            const contentDateDivByHour = document.createElement("div");
            contentDateDiv.appendChild(contentDateDivByHour)
            contentDateDivByHour.classList.add("contentDateDivByHour")

            contentDateDivByHour.addEventListener("click", function(event){
              devellopement(specialDay, 'leftActive', wetherDetail, isLeft, event);
            });
            const hourDiv = document.createElement("div");
            hourDiv.classList.add(hour[i])
            let formattedTime = hour[i].split(":").slice(0, 2).join("H");
            hourDiv.innerText = formattedTime;
            contentDateDivByHour.appendChild(hourDiv);

            const tempDiv = document.createElement("div");
            tempDiv.innerText = `${Math.round(temp[i])} C°`;
            contentDateDivByHour.appendChild(tempDiv);

            const iconDiv = document.createElement("div");
            iconDiv.classList.add("icons")
            const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode[i]}.png`
            iconDiv.style.backgroundImage = `url('${weatherIconURL}')`
            contentDateDivByHour.appendChild(iconDiv);

            const descDiv = document.createElement("div");
            descDiv.innerText = firstLetter(description[i])
            contentDateDivByHour.appendChild(descDiv);

          }
        } 
    })
    .catch(error => {

      //en cos d'erreur on renvoie une img et une phrase d'erreur
      const errorImgDiv = document.createElement("img");
      errorImgDiv.src = "asset/errorImg.png"
      errorImgDiv.classList.add("errorImgDiv")
      otherDay.appendChild(errorImgDiv)

      const errorDiv = document.createElement("h2");
      errorDiv.innerText = "Localisation inconnu";
      errorDiv.classList.add("errorDiv")
      otherDay.appendChild(errorDiv)
    })
  }


  /**
   * Fonction qui affiche les details meteo de l'heure selectionner 
   * @param {*} event 
   */
  function wetherDetail(event) {
    const separateElem = event.target.closest('.separate');
    const h2Elem = separateElem.querySelector('h2').classList;
    const clickedDiv = event.target.closest(".contentDateDivByHour");
    const hourSelect = clickedDiv.querySelector('div:first-child').classList
    const x = h2Elem.value +" "+ hourSelect.value

    const city = document.getElementById("localisation").value;
    const apiURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&lang=fr&units=metric&appid=928811eb9effc3558fc3b73f31614bf2";
    window.fetch(apiURL)
    .then(res => res.json())
    .then(resJson => {

      //on filtre notre objet par date et heure
      const filteredData = resJson.list.filter(obj => obj.dt_txt === x);

      const weatherIconCode = filteredData[0].weather[0].icon
      const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode}.png`

      //on selectionne les div
      const dateDiv = document.querySelector('.date');
      const hourDiv = document.querySelector('.hour');
      const iconDiv = document.querySelector('.icon');
      const humidityDiv = document.querySelector('.humidity');
      const tempDiv = document.querySelector('.temp');
      const tempMinDiv = document.querySelector('.tempMin');
      const tempMaxDiv = document.querySelector('.tempMax');
      const pressureDiv = document.querySelector('.pressure');
      const descriptionDiv = document.querySelector('.description');
      const windDegDiv = document.querySelector('.windDeg');
      const windGustDiv = document.querySelector('.windGust');
      const windSpeedDiv = document.querySelector('.windSpeed');

      // remplir chaque div avec du contenu
      dateDiv.innerHTML = firstLetter(dateFormat(filteredData[0].dt_txt.split(' ')[0]));
      hourDiv.innerHTML = (filteredData[0].dt_txt.split(' ')[1]).split(":").slice(0, 2).join("H");
      iconDiv.style.backgroundImage  = `url('${weatherIconURL}')`;
      humidityDiv.innerHTML = "Humidité: "+filteredData[0].main.humidity+" %";
      tempDiv.innerHTML = "Temp: "+Math.round(filteredData[0].main.temp)+" C°";
      tempMinDiv.innerHTML = "TempMax: "+Math.round(filteredData[0].main.temp_min)+" C°";
      tempMaxDiv.innerHTML = "TempMin: "+Math.round(filteredData[0].main.temp_max)+" C°";
      pressureDiv.innerHTML = "Pression: "+filteredData[0].main.pressure+" hPa";
      descriptionDiv.innerHTML = firstLetter(filteredData[0].weather[0].description);
      windDegDiv.innerHTML = "Direction vent: "+filteredData[0].wind.deg+" °";
      windGustDiv.innerHTML = "Rafale: "+filteredData[0].wind.gust+" m/s";
      windSpeedDiv.innerHTML = "Vit vent: "+filteredData[0].wind.speed+" m/s";

    });
  }


  /**
   * Fonction qui transforme la date
   * @param {*} date 
   * @returns 
   */
  function dateFormat(date){
    var maDate = new Date(date);
    var joursSemaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    var mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var jourSemaine = joursSemaine[maDate.getDay()];
    var jourMois = maDate.getDate();
    var moisNom = mois[maDate.getMonth()];
    var dateFormatee = jourSemaine + " " + jourMois + " " + moisNom + " " + maDate.getFullYear();
    return dateFormatee
  }


  /**
   * Fonction qui mets la premiere lettre en majuscule
   * @param {*} sentence 
   * @returns 
   */
  function firstLetter(sentence){
    const firstLettre = sentence.charAt(0).toUpperCase()
    const restWord = sentence.slice(1).toLowerCase()
    return firstLettre+restWord;
  }

  /**
   * Fonction qui gere la fermeture de la modal
   */
  checkBox.addEventListener("click",() => {
    if(checkBox.checked){
      specialDay.classList.remove('leftActive');
      checkBox.checked = false
      isLeft = false
    }
  })  
  
  /**
   * Fonction pour gerer l'animation
   * @param {*} htmlElement l'element sur lequel l'animation va s'effectuer
   * @param {*} htmlClass la class que l'on veut ajouter et enlever
   * @param {*} funct la fonction qui doit etre delay
   * @param {*} bool 
   * @param {*} event 
   */
  function devellopement(htmlElement,htmlClass,funct,bool, event = null){
    if(!bool.value){
      if(htmlElement.classList == htmlClass ){
        htmlElement.classList.remove(htmlClass);
        setTimeout(() => {
          funct(event)
          htmlElement.classList.add(htmlClass);
        }, 2100);
      }else{
        funct(event)
        htmlElement.classList.add(htmlClass);
      }
      setBoolean(bool, true);
    }else{
      htmlElement.classList.remove(htmlClass);
      setTimeout(() => {
        funct(event)
        htmlElement.classList.add(htmlClass);
      }, 2100);
      setBoolean(bool, false);
    }
  }

  /**
   * Fonction pour recuperer les valeur de l'obj
   * @param {*} obj 
   * @param {*} value 
   */
  function setBoolean(obj, value) {
    obj.value = value;
  }
