const buildMessageHTML = (msg) => {
  return `<li>
    <div class="user-image">
      <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${new Date(msg.date).toLocaleString()}</span></div>
      <div class="message-text">${msg.text}</div>
    </div>
  </li>`;
};

export default buildMessageHTML;
