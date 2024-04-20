import { ObjectType } from '@nestjs/graphql'
import { CognitoTokenResponseDto } from './cognito/cognito-token-response.dto'

@ObjectType({ description: 'TokenDto' })
export class TokenDto {
  public access_token: string
  public refresh_token: string
  public expires_in: number
  public token_type: string
  constructor(data: CognitoTokenResponseDto) {
    Object.assign(this, data)
  }
}
