import * as speakeasy from 'speakeasy';

export default class SecretGenerator {
  generate(): any {
    const secret = speakeasy.generateSecret({ length: 32 });
    return secret;
  }
}
