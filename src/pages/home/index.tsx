import { HandPalm, Play } from 'phosphor-react'
// react-hook-form é uma biblioteca para validacao de formularios do react, que possui algumas funcionalidades mas que trab em conjunto com outras, que no caso deste sistema usa a biblioteca zod
import { useForm } from 'react-hook-form'
// zodResolver é uma função importada do @hookform/resolvers/zod que serve para integrar o react-hook-form com a bilioteca zod
import { zodResolver } from '@hookform/resolvers/zod'
// zod é a biblioteca de integracao com o react-hook-form. para chamar deve se usar o * para importar tudo pois ela não esporta suas funçoes por defaut.
import * as zod from 'zod'
// Aqui estamos importando os componentes de estilo do arquivo styles.ts que estilizam as tags que usamos neste componente.
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'

// A const abaixo cria um objeto de validacao com o zod para validar os campos dos formulário.

// Esta interface do typeScript define o tipo dos dados a serem usados no estado criado abaixo "cycles"
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  // Este estado guarda os ciclos das tarefas e horários
  const [cycles, setCycles] = useState<Cycle[]>([])
  // este estado serve para guardar qual dos ciclos do estado anterior ta ativo, pois esta informação sera usada para demonstrar em tela o estado dos ciclos
  const [activeCycleId, setactiveCycleId] = useState<string | null>(null)

  // Esta const procura no conjunto de ciclos qual tem o ID  igual ao ciclo ativo, definido pelo estado "activeCycleId", entao considera este como ativo e então aplicar alguma operação neste determinado elemento do conjunto de ciclos.
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Esta função é para ser usada para gerenciar o que ocorre quando o usuário submete os dados do formulário. é chamada no onSubmit do form.
  function handleCreateNewCycle(data: NewCycleFormData) {
    // A const abaixo serve para que a cada clique de ciclo seja gerado um id, que no caso ta sendo utilizado pegando a data no exato momento do ciclo
    const id = String(new Date().getTime())
    // Esta const armazena o ciclo novo tendo como dados o id (retirado da const acima) e os outros que são obtidos das inputs do form.
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    // Esta função é padrão do useState do react e serve para modificar o estado da const cycle citada acima
    setCycles((state) => [...cycles, newCycle])
    // Esta função seta que o ciclo criado acima passa a ser o clico ativo
    setactiveCycleId(id)
    // Como ta sendo criado um novo ciclo, apagamos o tempo que o ciclo anterior tinha de existencia, pois se não fizemos o ciclo atual pega o valor vigente, no caso o ciclo anterior
    setamountSecondPassed(0)
    // Esta função é nativa do useForm e reseta o formuário ao final de todo processo de clique para que o mesmo fique pronto para receber novo ciclo
    reset()
  }
  // Esta função é um parametro opcional do handleSubmit do useForm e serve para que em caso de erro algo seja executado.
  function handleCreateNewCycleError() {
    console.log(Error)
  }
  // Esta função lida com a ação de clicar no botao de interrpomper, fazendo neste caso com que seja identificado no estado cycle qual esta ativo e adicionando ao mesmo a informação interruptedDate que não é obrigatória e só é adicionada se o usuário interromper algum ciclo ativo.
  function handleInterruptCycle() {
    // a função chama o setCycles e como quremos apenas adicionar uma infomração no ciclo existente (ou seja a atualização do ciclo depende do estado anterior dele), entao fazemos o setCycles chamando o estado atual e dentro dele aplicando a função. Na função setCycles por sua vez fazemos um map para procurar qual ciclo esta ativo e ao achar adicionamos no elemento a informação interruptedDate com a hora atual do clique. por fim marcamos que não há nenhum ciclo ativo para que um outro ciclopossa assumir o status de active.
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setactiveCycleId(null)
  }

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

  const task = watch('task')
  // Esta const pega o que ta sendo assitido no watch acima (se tem ou nao algo escrito na input task) para determinar se o botão fica ou não ativado. ta sendo usada la embaixo na propriedade disabled do botão.
  const inSubmitDisabled = !task

  return (
    <HomeContainer>
      {/* Abaixo ao fazer o submit do form está sendo chamada a função do React Hook Form que precisa de um parâmetro que é uma função, podendo tb receber outro parâmetro no caso de erro que tambem é uma função, mas neste caso não precisa tipas, pois a função apenas retorna um erro, não retorna dados.    */}
      <form
        // No onsubmit abaixo ta sendo usada uma função do useForm "handleSubmit" para lidar com as ações ao submeter o form
        onSubmit={handleSubmit(handleCreateNewCycle, handleCreateNewCycleError)}
      >
        <NewCycleForm />
        <Countdown />
        {/* Aqui embaixo estamos vendo se há ou não um ciclo ativo e caso tenha estamos mudando ocultando o botão StartCountdownButton e mostrando o botão StopCountdownButton e neste caso ao clicarmos no botão estamos executando a função handleInterruptCycle */}
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={inSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
