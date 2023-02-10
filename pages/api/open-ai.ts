// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream } from "@/utils/OpenAIStream";
import type { NextApiRequest } from "next";

enum LanguagesEnum {
  es = "es",
  en = "en",
}

export type BodyGetOpenAiResult = {
  toneType: string;
  copyToEdit: string;
  profession: string;
  selectedLanguage: LanguagesEnum;
};

export const config = {
  runtime: "edge",
};

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type MyCustomRequest = Override<
  NextApiRequest,
  { body: BodyGetOpenAiResult }
>;

const getPromt = (body: BodyGetOpenAiResult) => {
  const { toneType, copyToEdit, profession, selectedLanguage } = body;
  switch (selectedLanguage) {
    case LanguagesEnum.es:
      return `Contesta en español: imagina que escribes para ${profession}, parafrasea el siguiente texto, corrige la ortografía y redacción. Usa un tono ${toneType}: ${copyToEdit}`;
    case LanguagesEnum.en:
      return `Imagine that you are writing for ${profession},Paraphrase the following text, correct the spelling and grammar, and use a ${toneType}: ${copyToEdit}`;
  }
};
//

const handler = async (req: Request): Promise<Response> => {
  const body = (await req.json()) as BodyGetOpenAiResult;

  const prompt = getPromt(body);

  console.log(body, prompt);

  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: body.selectedLanguage === LanguagesEnum.es ? 0.85 : 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
