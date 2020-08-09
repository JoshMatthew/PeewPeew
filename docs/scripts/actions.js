window.onload = function () {
  const startBtn = document.querySelector('#start-btn')
  const restartBtn = document.querySelector('#restart-btn')
  const optionsBtn = document.querySelector('#options-btn')
  const container = document.querySelector('.container')
  const restartModal = document.querySelector('.restart-modal')
  const canvas = document.querySelector('#cnv')
  const options = document.querySelector('.options')
  const menu = document.querySelector('.menu')
  const back = document.querySelector('#back')
  const exitBtn = document.querySelector('#exit-btn')
  const backAbout = document.querySelector('#backAbout')
  const save = document.querySelector('#save')
  const controls = document.querySelector('#controls')
  const about = document.querySelector('.about')
  const aboutBtn = document.querySelector('#about-btn')
  const claimHre = document.querySelector('#claim-hre')

  let userPreferences = window.localStorage

  const params = new URLSearchParams(window.location.search) // gets the acc id of the metamask user
  if (params.has('acc')) {
    window.localStorage.setItem('acc_id', params.get('acc')) // sets the id to the localstorage
  }

  if (userPreferences.getItem('controls') === null || userPreferences.getItem('controls') === undefined || userPreferences.getItem('controls') === '') {
    userPreferences.setItem('controls', 'mouse')
    controls.value = userPreferences.getItem('controls')
  } else {
    controls.value = userPreferences.getItem('controls')
  }


  startBtn.addEventListener('click', () => { // Starts the game
    canvas.classList.toggle('hide')
    container.classList.toggle('hide')
    toggleDetails()
    playGame()
  })

  restartBtn.addEventListener('click', () => { // Restarts the game
    restartModal.classList.toggle('hide')
    playGame()
  })


  optionsBtn.addEventListener('click', () => { // Open options
    options.classList.toggle('hide')
    menu.classList.toggle('hide')
  })

  back.addEventListener('click', () => { // Go back to home screen
    options.classList.toggle('hide')
    menu.classList.toggle('hide')
  })

  exitBtn.addEventListener('click', () => { // Go back to home screen
    restartModal.classList.toggle('hide')
    container.classList.toggle('hide')
    canvas.classList.toggle('hide')
    toggleDetails()
  })

  backAbout.addEventListener('click', () => { // Go back to home screen
    about.classList.toggle('hide')
    menu.classList.toggle('hide')
  })

  save.addEventListener('click', () => {
    userPreferences.setItem('controls', controls.value)
    this.location.reload()
  })

  aboutBtn.addEventListener('click', () => {
    about.classList.toggle('hide')
    menu.classList.toggle('hide')
  })

  claimHre.addEventListener('click', () => { // Claims the score and send it to the database
    window.alert("Wait for it to load.")
    const points = window.localStorage.getItem('player_score')
    const acc_id = window.localStorage.getItem('acc_id')

    postData('https://hereumapi.herokuapp.com/peewpeew/points', { acc_id, points })
      .then(data => {
        window.alert("Points submitted!")
        exitBtn.click()
      });
  })


  async function postData(url = '', data = {}) { // Post data handler
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
}

// These functions are outside because we can't declare functions inside another function ;)
const restartModal = document.querySelector('.restart-modal')
const gameDetails = document.querySelector('.game-details')

function toggleModal() { // Shows the restart modal or hide it
  restartModal.classList.toggle('hide')
}

function toggleDetails() { // Shows the ingame details such as life, ammo and clips remaining
  gameDetails.classList.toggle('hide')
}