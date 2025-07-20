export default {
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'none',
  semi: true,
  printWidth: 100,
  arrowParens: 'avoid',
  // Добавляем явное указание форматируемых файлов
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel'
      }
    }
  ]
};
