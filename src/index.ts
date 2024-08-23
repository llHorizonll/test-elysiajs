import { Elysia, t } from "elysia";
import Bun from "bun";
import CryptoJS from "crypto-js";

declare module "bun" {
  interface Env {
    KEY: string;
    IV: string;
  }
}

const encryptFnc = (value: string) => {
  const key = CryptoJS.enc.Utf8.parse(Bun.env.KEY);
  const iv = CryptoJS.enc.Utf8.parse(Bun.env.IV);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

const decryptFnc = (value: string) => {
  const key = CryptoJS.enc.Utf8.parse(Bun.env.KEY);
  const iv = CryptoJS.enc.Utf8.parse(Bun.env.IV);
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 128 / 8,
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};

const port = process.env.PORT || 3000;
const app = new Elysia().get("/", () => "Hello Elysia")
  .post(
    "/",
    ({ body }) => {
      const r = decryptFnc(body.data);
      return r;
    },
    {
      body: t.Object({
        data: t.String(),
      }),
    }
  ).listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
