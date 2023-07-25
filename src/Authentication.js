import { auth, requiredScopes } from 'express-oauth2-jwt-bearer'

const jwtCheck = auth({
  audience: 'https://prismarine.kashall.dev',
  issuerBaseURL: 'https://dev-h4ql4052.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


export default jwtCheck;
