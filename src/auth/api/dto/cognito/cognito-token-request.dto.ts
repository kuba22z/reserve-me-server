export class CognitoTokenRequestDto {
  public grant_type: 'authorization_code'
  public client_id: string
  public code: string
  public redirect_uri: string

  constructor(data: CognitoTokenRequestDto) {
    Object.assign(this, data)
  }
}
