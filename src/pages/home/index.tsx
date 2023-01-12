import { Play } from 'phosphor-react'
// react-hook-form é uma biblioteca para validacao de formularios do react, que possui algumas funcionalidades mas que trab em conjunto com outras, que no caso deste sistema usa a biblioteca zod
import { useForm } from 'react-hook-form'
// zodResolver é uma função importada do @hookform/resolvers/zod que serve para integrar o react-hook-form com a bilioteca zod
import { zodResolver } from '@hookform/resolvers/zod'
// zod é a biblioteca de integracao com o react-hook-form. para chamar deve se usar o * para importar tudo pois ela não esporta suas funçoes por defaut.
import * as zod from 'zod'
// Aqui estamos importando os componentes de estilo do arquivo styles.ts que estilizam as tags que usamos neste componente.
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useState } from 'react'

// A const abaixo cria um objeto de validacao com o zod para validar os campos dos formulário.

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'informe a tarefa !'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo deve ser de no máximo 60 minutos.'),
})

// Este tipo abaixo usa o objeto acima e extrai dele os tipos de cada campo, para que sejam usados como parametros no zodResolver abaixo.
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [] = useState()

  
  // A const abaixo usa o useForm passando como parâmetro para ela um resolver que usa o zodResolver para validar os campos. O tipo a ser usado pelo useForme é o NewCycleFormData, fazendo com o que o resolver já saiba o tipo de dados que esta validando. ex: abaixo estou validando os campos task e minutesAmount e ao passa o tipo NewCycleFormData o zod já sabe que task é string e minutesamount é número.
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  // Esta função é para ser usada para gerenciar o que ocorre quando o usuário submete os dados do formulário.
  function handleCreateNewCycle(data: NewCycleFormData) {
    console.log(data)
    reset()
  }
  function handleCreateNewCycleError() {
    console.log(Error)
  }

  const task = watch('task')
  const inSubmitDisabled = !task
  return (
    <HomeContainer>
      {/* Abaixo ao fazer o submit do form está sendo chamada a função do React Hook Form que precisa de um parâmetro que é uma função, podendo tb receber outro parâmetro no caso de erro que tambem é uma função, mas neste caso não precisa tipas, pois a função apenas retorna um erro, não retorna dados.    */}
      <form
        action=""
        onSubmit={handleSubmit(handleCreateNewCycle, handleCreateNewCycleError)}
      >
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em:</label>
          <TaskInput
            list="task-suggestions"
            placeholder="Digite a tarefa a ser feita"
            id="task"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Projeto 4"></option>
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            placeholder="0-60"
            type="number"
            id="minutesAmount"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={inSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
