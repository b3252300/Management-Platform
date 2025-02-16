import { EncryptStorage } from "encrypt-storage";

// localStorage 加密
export const encryptStorage = new EncryptStorage("secret-key-value", {
  prefix: 'LandSeed.ErasVue3',
  stateManagementUse: true,
});
