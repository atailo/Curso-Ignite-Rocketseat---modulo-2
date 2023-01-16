import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../..'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondPassed,
    setSecondPassed,
  } = useContext(CyclesContext)

  // A const abaixo pegam o valor inserido na input minutesAmount e converte em segundos, para ficar mais facil de manipular
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // o hook do react abaixo, useEffect, funciona para que possamos a cada alteracao do status do activeCycle executar alguma outra ação. Neste caso estamos determinando que se tiver um ciclo ativo a cada 1s a função setInterval seja executada e dentro dela seja calculado a diferenca em segundo ente o momento atual e o horario que o ciclo começou e o o resultado seja passado pro setAmountSecondPassed para dizer quantos segundos se passaram desde o início do ciclo, para que por ultimo este valor seja usado para saber quantos segundos se passou desde a criacao do ciclo e isso seja diminuido na const currentSeconds;

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        // nesta parte estamos vendo se a variável acima, secondsDifference, é maior ou igual ao total de segundo que foi estipulado pro ciclo, caso seja percorremos o estado cycle e adicionamos ao ciclo ativo o campo finishedDate.
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setSecondPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondPassed,
  ])

  // A const abaixo pega o valor da const totalSeconds criada acima e diminui do valor da const amountSecondPassed, proximo da linha  47, para determinar qual o segundo atual que falta para o time.
  const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0
  // Como o valor que falta atualmente está na variavel acima no formato de segundo, para exibir em tela precisamos quebrar em dois blocos: minutos e segundos, sendo feito primeiro a divisao por 60 para saber quantos minutos cheios cabem dentro do valor e em seguida calculase o resto da divisão e aplica nos segundos
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  // Aqui embaixo  os valores das constantes em cima que serão exibidas em tela são convertidas em string e passam por um método que determina que esta string sempre precisa ter "N" caracteres e se não tiver ela é completada, no começo por um caracteres determinado, que no caso foi o caracte 0, pois assim sempre haverá 2 caractesres sendo exibidos em tela mesmo que no caso o valores dos minutos ou segundos sejam menor que 10 e consequentemente possuam apeas 1 caractere
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // Este useEffect observa se tem ciclo ativo e entao caso tenha ele mudar o titulo da pagina e o favicon para mostrar o tempo que falta no ciclo no titulo da pagina.
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
      const teste = document.getElementById('favicon')
      teste?.setAttribute('href', 'src/assets/alarm.png')
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      {/* aqui embaixo usamos o metodo de pegar apenas um elemento do caracter, pois uma string aceita iiso, semelhante ao pegarmos apenas um elemento de um array */}
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
