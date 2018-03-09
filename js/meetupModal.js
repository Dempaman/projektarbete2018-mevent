// Initialize a new plugin instance for one element or NodeList of elements.

function initSliderAndMoreShit() {

  displayAgeInterval('0,100');

  getLocationInfo();
  var ageSlider;
  if(!document.getElementById('ageSlider')){
    printMessage('warn', 'Slider already exists.');
  } else {
    ageSlider = new rSlider({
            target: '#ageSlider',
            values: {min: 0, max: 100},
            step: 1,
            range: true,
            tooltip: false,
            scale: false,
            labels: false,
            onChange: displayAgeInterval
        });
  }

      let closeBtn = document.getElementById('menuDiv');
      let modalWrapper = document.getElementById('modalWrapper');
      let meetupWrapper = document.getElementById('meetupWrapper');
      if(closeBtn){
        closeBtn.addEventListener('click', function(event){
          console.log('Target:', event.target);
          console.log('Closed skapa meetup');
          //ageSlider.destroy();
          modalWrapper.className = 'hidden';
          meetupWrapper.className = 'show';
        });
      } else {
        console.log('no btn');
      }

/* Functions that require the DOM to be laoded */
function displayAgeInterval(values){
        let displayDiv = document.getElementById('ageIntervalDisplayer');
        let valueArray = getValues(values);
        let val1 = valueArray[0], val2 = valueArray[1];

        displayDiv.innerHTML = `<div val1="${val1}" val2="${val2}">${val1} år</div><div>${val2} år</div>`

        displayDiv.children[0].addEventListener('click', function(event){
          makeInput(event.target, values, val1, 'start');
        });
        displayDiv.children[1].addEventListener('click', function(event){
          makeInput(event.target, values, val2, 'end');
        });
      }

function makeInput(target, oldValues, val, pos){
        let ageInput = document.createElement('input');
        console.log(pos);
        ageInput.className = 'ageInput';
        ageInput.setAttribute('type', 'text');
        ageInput.setAttribute('placeholder',val);
        target.innerText = '';
        //target.innerHTML = '<input class="ageInput" type="text" ';

        // append the input.
        target.appendChild(ageInput);
        // Focus the input
        ageInput.focus();

        // Add eventListener for when the input gets blurred.
        ageInput.addEventListener('blur', function(event){
          setAgeInterval(event, oldValues, pos, ageSlider);
        });
        // Add eventListener for enter.
        ageInput.addEventListener('keypress', function(event){
          if(event.keyCode == 13){
            setAgeInterval(event, oldValues, pos, ageSlider);
          }
        });
      }

// EventListener för att lägga till ett meetup
initCreateMeetupListeners(ageSlider);

function setAgeInterval(event, oldValues, pos, ageSlider){
  let val1 = oldValues.split(',')[0];
  let val2 = oldValues.split(',')[1];
  console.log(oldValues);
    // Kolla position
    if(pos == 'start'){
      val1 = Number.parseInt(event.target.value);
      ageSlider.setValues(val1,val2);
    } else {
      val2 = Number.parseInt(event.target.value);
      ageSlider.setValues(val1,val2);
    }
    displayAgeInterval(val1 + ',' + val2);
  };

  //Add eventlistener for the info Inputbox
  let inputBox = document.getElementsByTagName('textarea')[0];
  let charCount = document.getElementsByClassName('characterCounter')[0];
  let charCountOutput = charCount.children[0];
  inputBox.addEventListener('keydown', function(e){

      if(inputBox.value.length >= 900){
        if(e.keyCode != 8 && e.keyCode != 46){
          e.preventDefault();
          printMessage('warn', 'Du har nu nått maximalt antal tecken som får plats i beskrivningen.');
        }
      }
      charCountOutput.innerText = inputBox.value.length + ' /900';

  });
  inputBox.addEventListener('keypress', function(e){
    if(inputBox.value.length >= 900){
      if(e.keyCode != 8 && e.keyCode != 46){
        e.preventDefault();
        printMessage('warn', 'Du har nu nått maximalt antal tecken som får plats i beskrivningen.');
      }
    }
      charCountOutput.innerText = inputBox.value.length + ' /900';
    });
}
let once = true;
function initCreateMeetupListeners(ageSlider){
  let createBtn = document.getElementById('createMeetupButton');
  if(once){
    once = false;
    createBtn.addEventListener('click', function(event){
      /* Börja med att hämta alla variabler */
      let eventid = getLocationInfo()[0];
      let name = document.getElementById('nameInput').value;
      let address = document.getElementById('addressInput').value;
      let placeName = document.getElementById('placeNameInput').value;
      let time = document.getElementById('timeInput').value;

      // Koordinater
      let latitude = document.getElementById('map').getAttribute('lat').substring(0,9);
      let longitude = document.getElementById('map').getAttribute('lng').substring(0,9);

      // ageInterval
      let ageInterval = ageSlider.getValue().split(',');

      // Antal platser
      let spots = document.getElementById('spotsInput').value;

      // Information
      let information = document.getElementsByTagName('textarea')[0].value;

      // Skaparens användarID som vi får genom autentiseringen!
      if(localStorage.getItem('loggedInUser')){


        let localUser = JSON.parse(localStorage.getItem('loggedInUser'));

        let creator = {
            uniqueID: localUser.uniqueID,
            fullname: localUser.fullname,
            mail: localUser.mail,
            avatarURL: localUser.avatarURL
        };

        console.log(creator);

        console.log('CREATOR LOGGED IN ATM: ', creator);
        // Medlemmar - Lägger skaparen av meetupet som medlem direkt i en LISTA.
        let members = {creator};

        // Admins - Lägger skaparen av meetupet som admin direkt i en LISTA.
        let admins = [creator.uniqueID];

        if(name.length > 6 && name.length < 36){
            if(placeName.length > 4 && placeName.length < 18){
                if(placeName.length > 4 && placeName.length < 18){
                    if(!isNaN(spots)){
                      // Skapa meetupet.
                      let meetup = new MeetupClass(eventid, name, address, placeName, latitude, longitude, time, spots, ageInterval, information, creator, members, admins);

                      meetup.push();
                      meetup.updateCount();
                      //ageSlider.destroy();
                      console.log('Meetup: ',meetup);

                      //visa navigation och menu.... igen!!.
                        document.getElementById('navigation').className = 'show';
                        document.getElementById('menuToggle').className = 'show';


                      // Empty the fields
                        document.getElementById('nameInput').value = '';
                        document.getElementById('addressInput').value = '';
                        document.getElementById('timeInput').value = '';
                        document.getElementById('spotsInput').value = '';
                        document.getElementById('placeNameInput').value = '';

                      // Visa alla meetups igen!
                        document.getElementById('modalWrapper').className = 'hidden';
                        document.getElementById('meetupWrapper').className = 'show';

                        setTimeout(function(){
                          // Interesting ? https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                          let htmlScroll = document.getElementsByTagName('html')[0];

                          console.log('Html scroll!!');
                          let newMeetup = document.getElementById('meetupWrapper').lastChild;
                          htmlScroll.className += ' smooth-scroll';
                          htmlScroll.scrollTop = htmlScroll.scrollHeight - newMeetup.scrollHeight;

                          console.log(htmlScroll.scrollHeight);

                          console.log('Height is:', htmlScroll.scrollHeight - newMeetup.scrollHeight);
                        },300);
                    } else {
                     printMessage('error', 'Du måste ange antal platser')
                    }
                } else {
                 printMessage('error', 'Platsnamn är för kort eller för långt')
                }
            } else {
              printMessage('error', 'Platsnamn är för kort eller för långt')
            }
        } else {
          printMessage('error', 'Namnet är för kort eller för långt', 6000, 400)
        }
      } else {
        modalWrapper.className = 'hidden'
        toggleLoginModal();
        console.log('No user logged in!!!');
      }
    });
  } else {
    if(document.getElementById('ageSlider')){
      ageSlider.destroy();
    }
    printMessage('error','I AM NOT ADDING ANOTHER EVENTLISTENER!!! OVER MY DEAD BODY');
  }

  // Vad gör vi när man trycker på skapa meetup. (eventid, name, address, latitude, longitude, time, spots, ageInterval, information, creator, members, admins)

}

function getLocationInfo(){
    let href = window.location.href, stopcode = false;

      if(href.includes('?event')){
        href = href.split('?')[1];

        href = href.split('&');

      } else {
        console.warn('This page should only be reached with a event specified in the address field.');
        console.log('Om man ändå hamnar här kan vi redirecta till alla event / lägga en sökruta här');
        //window.location.href = 'events.html';
        stopcode = true;
      }


    let eventID = 0, meetupID = 0;

    // Innehåller platsen för många antal setters?
    if(!stopcode){
      if(href.length > 2 || href.length <= 0){
        console.warn('Invalid href!');
      } else {
          for(let loc of href){
            // Loopa igenom adressen!
            if(loc.includes('event')){

              // Om det är eventdelen av adressen ta fram eventID:et!
              eventID = loc.split('=')[1];
            } else {
              // Annars tar vi fram meetupID:et!
              meetupID = loc.split('=')[1];
            }
          }
      }
      return [eventID, meetupID];
    } else {
      return false;
    }
  }

function getValues(values){
  console.log('VALUES BEFORE SPLIT: ', values);
  return values.split(',');
}

function toggleCreateMeetupModal(){

  let modalWrapper = document.getElementById('modalWrapper');
  let meetupWrapper = document.getElementById('meetupWrapper');
  let menuToggleBtn = document.getElementById('menuToggle');
  let footer = document.getElementsByTagName('footer')[0];

  // ModalWrapper är gömd från början. Om den är hidden visar vi den.
  if(modalWrapper.className == 'hidden'){
    modalWrapper.className = ''; // Visa modalen för att skapa meetup
    meetupWrapper.className = 'hidden'; // Dölj
    menuToggleBtn.className = 'hidden'; // Dölj
    footer.className = 'hidden'; // Dölj

  } else {
    modalWrapper.className = 'hidden';
    meetupWrapper.className = '';
    menuToggleBtn.className = '';
    footer.className = '';
  }

  //Check if user is logged in and set btn correctly
  let btn = document.getElementById('createMeetupButton')

  if(localStorage.getItem('loggedInUser')){
    btn.innerText = 'Skapa Meetup';
    btn.className = 'createMeetupBtn purple';
  } else {
    btn.innerText = 'Logga In';
    btn.className = 'createMeetupBtn logInBtn leaveMeetupBtn';
  }
}
