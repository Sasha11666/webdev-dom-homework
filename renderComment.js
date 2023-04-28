
 export const renderFunction = (data, getComments, element) => {
  const commentsHTML = data.map((comment, index) => {
    return getComments(comment, index)
  })
  .join("");
  element.innerHTML = commentsHTML;
}
