window.onload = function () {
  const startBtn = document.querySelector('#start-btn')
  const optionsBtn = document.querySelector('#options-btn')
  const container = document.querySelector('.container')
  const canvas = document.querySelector('#cnv')
  const options = document.querySelector('.options')
  const menu = document.querySelector('.menu')
  const back = document.querySelector('#back')



  startBtn.addEventListener('click', () => {
    canvas.classList.toggle('hide')
    container.classList.toggle('hide')
    playGame()
  })


  optionsBtn.addEventListener('click', () => {
    options.classList.toggle('hide')
    menu.classList.toggle('hide')
  })

  back.addEventListener('click', () => {
    options.classList.toggle('hide')
    menu.classList.toggle('hide')
  })
}