export function getWordIndex(node) {
  let index = 0;
  const childNodes = [...node.parentNode.childNodes];
  for (let i = 0; i < childNodes.findIndex((n) => n === node); i++) {
    index += childNodes[i].textContent.length;
  }
  return index;
}
