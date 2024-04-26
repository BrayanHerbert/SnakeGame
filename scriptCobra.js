const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const nome = prompt('Qual seu nome?')

const tempo = document.querySelector('.score--value')
const FinalTempo = document.querySelector('.final-tempo > span')
const menu = document.querySelector('.menu')
const botao = document.querySelector('.btn-jogar')

const audio = new Audio('audio.mp3')
const fundo = new Audio('fundo.mp3')
audio.volume = 0.3


const size = 30

const posicaoInicial = {x: 270, y: 240}

let cobra = [posicaoInicial]

const pontoTempo = () => {
    tempo.innerHTML = +tempo.innerHTML + 10
}

const numeroAleatorio = (max,min) => {
    return Math.round(Math.random() * (max - min) + min)
}
const posicaoAleatoria = () => {
    const numero = numeroAleatorio(0, canvas.width - size)
    return Math.round(numero / 30) * 30
}

const corAletoria = () => {
    const red = numeroAleatorio(0, 255)
    const green = numeroAleatorio(0, 255)
    const blue = numeroAleatorio(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const comida = {
    x: posicaoAleatoria(),
    y: posicaoAleatoria(),
    color: corAletoria(),
    corIgualAObackground: function(){
        if (this.color === rgb(58, 29, 0)){
            this.color = corAletoria()
        }
    }  
}


let direction, loopId

const desenhoComida = () => {
    const {x, y, color} = comida
    
    contexto.fillStyle = color
    contexto.shadowColor = color
    contexto.shadowBlur = 7
    contexto.fillRect( x, y, size, size )
    contexto.shadowBlur = 0
}

const desenhoCobra = () => {
    contexto.fillStyle = 'darkgreen'
    

    cobra.forEach((position, index) => {
        
        if(index == cobra.length - 1){
            contexto.fillStyle = '#1a0d00'
        }

        contexto.fillRect(position.x , position.y, size, size)
    })
}

const moveCobra = () =>{
    const cabeca = cobra[cobra.length - 1]
    if (!direction) return
    

    if (direction === 'right'){
        cobra.push({x: cabeca.x + size, y: cabeca.y})
    }
    if (direction === 'left'){
        cobra.push({x: cabeca.x - size , y: cabeca.y})
    }
    if (direction === 'down'){
        cobra.push({x: cabeca.x , y: cabeca.y + size})
    }
    if (direction === 'up'){
        cobra.push({x: cabeca.x , y: cabeca.y - size})
    }
    
    

    cobra.shift()
}

const desenhoGrid = () => {
   contexto.lineWidth = 1
   contexto.strokeStyle = '#2b1600'
   
    for (let i = 30; i < canvas.width; i += 30) {
        contexto.beginPath()
        contexto.lineTo(i, 0)
        contexto.lineTo(i, 600)
        contexto.stroke()
        //nova linha
        contexto.beginPath()
        contexto.lineTo(0, i)
        contexto.lineTo(600, i)
        contexto.stroke()
    }

  
}

const comeuAcomida = () => {
    const cabeca = cobra[ cobra.length - 1]

    if (cabeca.x == comida.x && cabeca.y == comida.y){
        cobra.push(cabeca)
        pontoTempo()
        audio.play()

        let x = posicaoAleatoria()
        let y = posicaoAleatoria()

    while (cobra.find((positionIgual) => positionIgual.x == x && positionIgual.y == y )){

       
        x = posicaoAleatoria()
        y = posicaoAleatoria()
    }

    comida.x = x
    comida.y = y
    comida.color = corAletoria()
    }
}

const colisao = () => {
    const cabeca = cobra[cobra.length - 1]
    const canvasLimete = canvas.width - size
    const verificarCorpo = cobra.length - 2
   
    const paredeColisao = cabeca.x < 0 || cabeca.x > canvasLimete || cabeca.y < 0 || cabeca.y > canvasLimete

    const colisaoCobra = cobra.find((position, index) => {
        return index < verificarCorpo && position.x == cabeca.x && position.y == cabeca.y
         
    })

    if (paredeColisao || colisaoCobra){
        derrota()
    }
}

const derrota = () => {
    direction = undefined
    
    menu.style.display = 'flex'
    FinalTempo.innerHTML = `${nome} sua pontuação foi ${tempo.innerHTML}`
   
    canvas.style.filter = "blur(2px)"
}

let velocidade = 250

const QualAvelocidade = () => {
    if (cobra.length > 5) velocidade = 200
    if (cobra.length > 10) velocidade = 150
    if (cobra.length > 15) velocidade = 100
    if (cobra.length > 20) velocidade = 70
    if (cobra.length > 35) velocidade = 50
    
}

const gameLoop = () =>{
    clearInterval(loopId) 

    contexto.clearRect(0, 0, 600, 600)
    fundo.play()
    desenhoGrid()  
    comeuAcomida()
    desenhoComida()
    moveCobra()
    desenhoCobra()
    colisao()
    QualAvelocidade()
    
    loopId = setInterval(() =>{
        gameLoop()
    }, velocidade)
}
gameLoop()

document.addEventListener('keydown', ({key}) => {
    
    if (key == 'ArrowRight' && direction !== 'left') direction = 'right'
   
    if (key == 'ArrowLeft' && direction !== 'right') direction = 'left'
    
    if (key == 'ArrowDown' && direction !== 'up') direction = 'down'
    
    if (key == 'ArrowUp' && direction !== 'down') direction = 'up'
})
botao.addEventListener('click', () => {
    tempo.innerHTML = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'

    cobra = [posicaoInicial]
})