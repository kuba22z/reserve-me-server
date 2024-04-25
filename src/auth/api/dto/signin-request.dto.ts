export class SignInRequestDto {
  public username: string
  public password: string
  constructor(data: SignInRequestDto) {
    Object.assign(this, data)
  }
}
