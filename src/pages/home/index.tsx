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
import { useContext } from 'react'
import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import { CyclesContext } from '../../context/CyclesContext'

// A const abaixo cria um objeto de validacao com o zod para validar os campos dos formulário.

// Esta interface do typeScript define o tipo dos dados a serem usados no estado criado abaixo "cycles"

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
  const { creteNewCycle, interruptCurrentCycle, activeCycle } =
    useContext(CyclesContext)
  // A const abaixo usa o useForm passando como parâmetro para ela um resolver que usa o zodResolver para validar os campos. O tipo a ser usado pelo useForme é o NewCycleFormData, fazendo com o que o resolver já saiba o tipo de dados que esta validando. ex: abaixo estou validando os campos task e minutesAmount e ao passa o tipo NewCycleFormData o zod já sabe que task é string e minutesamount é número.
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    creteNewCycle(data)
    reset()
  }

  const task = watch('task')
  // Esta const pega o que ta sendo assitido no watch acima (se tem ou nao algo escrito na input task) para determinar se o botão fica ou não ativado. ta sendo usada la embaixo na propriedade disabled do botão.
  const inSubmitDisabled = !task

  return (
    <HomeContainer>
      {/* Abaixo ao fazer o submit do form está sendo chamada a função do React Hook Form que precisa de um parâmetro que é uma função, podendo tb receber outro parâmetro no caso de erro que tambem é uma função, mas neste caso não precisa tipas, pois a função apenas retorna um erro, não retorna dados.    */}
      <form
        // No onsubmit abaixo ta sendo usada uma função do useForm "handleSubmit" para lidar com as ações ao submeter o form
        onSubmit={handleSubmit(handleCreateNewCycle)}
      >
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {/* Aqui embaixo estamos vendo se há ou não um ciclo ativo e caso tenha estamos mudando ocultando o botão StartCountdownButton e mostrando o botão StopCountdownButton e neste caso ao clicarmos no botão estamos executando a função handleInterruptCycle */}
        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
