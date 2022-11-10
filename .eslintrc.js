module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // extends: 'airbnb',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always', { omitLastInOneLineBlock: false }],
    'semi-style': ['error', 'last'],
    'no-extra-semi': ['error'],
    'semi-spacing': ['error', { before: false, after: true }],
    'no-unused-vars': 'off',
    'arrow-body-style': 'off',
  },
  globals: {
    listaPacientes: true,
    listaTurnos: true,
    listaProfesionales: true,
    Turnos: true,
    Pacientes: true,
    especialidades: true,
    especialidadProfesionales: true,
    luxon: true,
  },
};
