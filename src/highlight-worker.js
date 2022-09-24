import Prism from 'prismjs';

export const highlight = (foo) => {
  const matches = document.querySelectorAll('code');
  matches.forEach((match) => {
    const className = match.className || 'language-markup';
    const language = className.split('-')[1];
    /* eslint-disable no-param-reassign */
    // This code does not execute on rerender
    match.parentElement.className = match.className;

    match.innerHTML = Prism.highlight(match.innerText, Prism.languages[language], language);
    /* eslint-enable no-param-reassign */
  });
  return foo;
};
export const foo = () => 42;
