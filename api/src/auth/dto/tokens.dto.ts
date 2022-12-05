interface AccessTokenPayload {
  email: string;
  id: number;
  iat: number;
  exp: number;
}

interface RefreshTokenPayload {
  id: number;
  uuid: string;
  iat: number;
  exp: number;
}
