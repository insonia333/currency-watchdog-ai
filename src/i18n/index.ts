import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        edit: 'Editar',
      },
      auth: {
        login: 'Entrar',
        logout: 'Sair',
        email: 'E-mail',
        password: 'Senha',
        forgotPassword: 'Esqueceu a senha?',
      },
      errors: {
        required: 'Este campo é obrigatório',
        invalidEmail: 'E-mail inválido',
        networkError: 'Erro de conexão',
        serverError: 'Erro no servidor',
      },
    },
  },
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot password?',
      },
      errors: {
        required: 'This field is required',
        invalidEmail: 'Invalid email',
        networkError: 'Network error',
        serverError: 'Server error',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 