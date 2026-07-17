// Lazy chunk: the Vue-based chat widget and its stylesheet. ChatWidget
// imports this module after the page has loaded, keeping the chat runtime
// and the webhook request out of the critical rendering path.
import '@n8n/chat/style.css';
export { createChat } from '@n8n/chat';
