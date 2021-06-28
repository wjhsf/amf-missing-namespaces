import * as amf from 'amf-client-js';
import path from 'path';

export async function loadModel(file: string): Promise<amf.model.document.Document> {
  amf.plugins.document.WebApi.register();
  await amf.Core.init();

  const env = amf.client.DefaultEnvironment.apply();
  const parser = new amf.Raml10Parser(env);
  const unresolved = await parser.parseFileAsync(`file://${path.resolve(file)}`);
  const resolver = new amf.Raml10Resolver();
  return resolver.resolve(unresolved, 'editing') as amf.model.document.Document;
}
