import { createApp } from 'vue';
import dialogIndex from '@/components/dialog/Dialog.vue';

let dialogInstance;

function initDialog() {
  if (!dialogInstance) {
    const DialogApp = createApp(dialogIndex);
    dialogInstance = DialogApp.mount(document.createElement('div'));
    document.body.appendChild(dialogInstance.$el);
  }
  return dialogInstance;
}

export function showDialog(options) {
  const instance = initDialog();
  instance.show(options);
}
