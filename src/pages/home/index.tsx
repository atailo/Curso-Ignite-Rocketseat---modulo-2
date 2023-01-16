import { HandPalm, Play } from 'phosphor-react'
// react-hook-form é uma biblioteca para validacao de formularios do react, que possui algumas funcionalidades mas que trab em conjunto com outras, que no caso deste sistema usa a biblioteca zod
import { FormProvider, useForm } from 'react-hook-form'
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
import { createContext, useState } from 'react'
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

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondPassed: number
  setSecondPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'informe a tarefa !'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo deve ser de no máximo 60 minutos.'),
})

// Este tipo abaixo usa o objeto acima e extrai dele os tipos de cada campo, para que sejam usados como parametros no zodResolver abaixo.
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  // Este estado guarda os ciclos das tarefas e horários
  const [cycles, setCycles] = useState<Cycle[]>([])
  // este estado serve para guardar qual dos ciclos do estado anterior ta ativo, pois esta informação sera usada para demonstrar em tela o estado dos ciclos
  const [activeCycleId, setactiveCycleId] = useState<string | null>(null)

  const [amountSecondPassed, setAmountSecondPassed] = useState(0)

  // A const abaixo usa o useForm passando como parâmetro para ela um resolver que usa o zodResolver para validar os campos. O tipo a ser usado pelo useForme é o NewCycleFormData, fazendo com o que o resolver já saiba o tipo de dados que esta validando. ex: abaixo estou validando os campos task e minutesAmount e ao passa o tipo NewCycleFormData o zod já sabe que task é string e minutesamount é número.
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  // Esta const procura no conjunto de ciclos qual tem o ID  igual ao ciclo ativo, definido pelo estado "activeCycleId", entao considera este como ativo e então aplicar alguma operação neste determinado elemento do conjunto de ciclos.
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

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
    setAmountSecondPassed(0)
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
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondPassed,
            setSecondPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

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
