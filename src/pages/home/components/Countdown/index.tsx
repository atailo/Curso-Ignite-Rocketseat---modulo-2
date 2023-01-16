import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {

  const [amountSecondPassed, setamountSecondPassed] = useState(0)

  // A const abaixo pegam o valor inserido na input minutesAmount e converte em segundos, para ficar mais facil de manipular
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

   // o hook do react abaixo, useEffect, funciona para que possamos a cada alteracao do status do activeCycle executar alguma outra ação. Neste caso estamos determinando que se tiver um ciclo ativo a cada 1s a função setInterval seja executada e dentro dela seja calculado a diferenca em segundo ente o momento atual e o horario que o ciclo começou e o o resultado seja passado pro setamountSecondPassed para dizer quantos segundos se passaram desde o início do ciclo, para que por ultimo este valor seja usado para saber quantos segundos se passou desde a criacao do ciclo e isso seja diminuido na const currentSeconds;

  
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
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setamountSecondPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setamountSecondPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

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
