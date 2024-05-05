export class CognitoTokenRequestDto {
  public grant_type: 'authorization_code' | 'refresh_token'
  public client_id: string
  public code?: string
  public refresh_token?: string
  public redirect_uri: string

  constructor(data: CognitoTokenRequestDto) {
    Object.assign(this, data)
  }
}
