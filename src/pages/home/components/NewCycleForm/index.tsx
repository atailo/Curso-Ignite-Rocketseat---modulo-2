import { FormContainer, TaskInput, MinutesAmountInput } from './styles'
import * as zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'informe a tarefa !'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo deve ser de no máximo 60 minutos.'),
})

// Este tipo abaixo usa o objeto acima e extrai dele os tipos de cada campo, para que sejam usados como parametros no zodResolver abaixo.
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function NewCycleForm() {
  // A const abaixo usa o useForm passando como parâmetro para ela um resolver que usa o zodResolver para validar os campos. O tipo a ser usado pelo useForme é o NewCycleFormData, fazendo com o que o resolver já saiba o tipo de dados que esta validando. ex: abaixo estou validando os campos task e minutesAmount e ao passa o tipo NewCycleFormData o zod já sabe que task é string e minutesamount é número.
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  return (
    <FormContainer>
      {/* o atributo htmlfor serve para você apontar qual elemento do formulário a label se refere */}
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        list="task-suggestions"
        placeholder="d2igite a tarefa a ser feita"
        id="task"
        {...register('task')}
        disabled={!!activeCycle}
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
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
