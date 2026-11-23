import { reactive, ref } from 'vue'
import { getErrorMessage, getValidationErrors } from '../lib/http'

export const useApiForm = (initialValues, submitAction) => {
  const form = reactive({ ...initialValues })
  const errors = ref({})
  const message = ref('')
  const submitting = ref(false)

  const submit = async () => {
    errors.value = {}
    message.value = ''
    submitting.value = true

    try {
      const response = await submitAction(form)
      message.value = response.message
      Object.assign(form, initialValues)
      return response
    } catch (error) {
      errors.value = getValidationErrors(error)
      message.value = getErrorMessage(error)
      return null
    } finally {
      submitting.value = false
    }
  }

  return { form, errors, message, submitting, submit }
}
