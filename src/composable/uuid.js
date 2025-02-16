import useCryptoJs from "@/composable/aesUtils.js";
import { encryptStorage } from "@/utils/EncryptStorage";
import { v4 as uuidv4 } from "uuid";

const DeviceId = encryptStorage.getItem('DeviceId')
if (!DeviceId) {
  encryptStorage.setItem("DeviceId", uuidv4());
}