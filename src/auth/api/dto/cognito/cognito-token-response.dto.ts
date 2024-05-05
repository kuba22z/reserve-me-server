export class CognitoTokenResponseDto {
  public id_token: string
  public access_token: string
  public refresh_token?: string
  public expires_in: number
  public token_type: string
  constructor(data: CognitoTokenResponseDto) {
    Object.assign(this, data)
  }
}
