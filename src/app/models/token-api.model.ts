export interface TokenApiModel {
  accessToken: string;
  refreshToken: string;
}

export interface RenewTokenResponse {
  statusCode: number;
  isSuccess: boolean;
  result: TokenApiModel;
}
