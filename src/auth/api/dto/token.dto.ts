import { ObjectType } from '@nestjs/graphql'
import { CognitoTokenResponseDto } from './cognito/cognito-token-response.dto'

@ObjectType({ description: 'TokenDto' })
export class TokenDto {
  public accessToken: string
  public refreshToken?: string
  public expiresIn: number
  public tokenType: string
  public idToken: string
  constructor(data: CognitoTokenResponseDto) {
    Object.assign(this, data)
  }
}
