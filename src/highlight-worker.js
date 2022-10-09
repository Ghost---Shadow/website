import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';

export const highlight = () => {
  document.querySelectorAll('pre').forEach((match) => {
    // This line SOMETIMES does not execute on rerender
    /* eslint-disable no-param-reassign */
    match.className = 'language-markup';
  });

  const matches = document.querySelectorAll('code');
  matches.forEach((match) => {
    const className = match.className || 'language-markup';
    const language = className.split('-')[1];
    /* eslint-disable no-param-reassign */

    // This line SOMETIMES does not execute on rerender
    match.parentElement.className = match.className;

    match.innerHTML = Prism.highlight(match.innerText, Prism.languages[language], language);
    /* eslint-enable no-param-reassign */
  });
};
export const foo = () => 42;
