const startBtn = document.querySelector('#start-btn')
const container = document.querySelector('.container')
const canvas = document.querySelector('#cnv')



startBtn.addEventListener('click', () => {
  canvas.classList.toggle('hide')
  container.classList.toggle('hide')
  playGame()
})