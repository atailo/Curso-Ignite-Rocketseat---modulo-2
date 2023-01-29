import { createContext, ReactNode, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondPassed: (seconds: number) => void
  creteNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface CyclesContextProviderPros {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderPros) {
  // Este estado guarda os ciclos das tarefas e horários
  const [cycles, setCycles] = useState<Cycle[]>([])
  // este estado serve para guardar qual dos ciclos do estado anterior ta ativo, pois esta informação sera usada para demonstrar em tela o estado dos ciclos
  const [activeCycleId, setactiveCycleId] = useState<string | null>(null)

  const [amountSecondPassed, setAmountSecondPassed] = useState(0)
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
  function creteNewCycle(data: CreateCycleData) {
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
  }

  // Esta função lida com a ação de clicar no botao de interrpomper, fazendo neste caso com que seja identificado no estado cycle qual esta ativo e adicionando ao mesmo a informação interruptedDate que não é obrigatória e só é adicionada se o usuário interromper algum ciclo ativo.
  function interruptCurrentCycle() {
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

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondPassed,
        setSecondPassed,
        creteNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
