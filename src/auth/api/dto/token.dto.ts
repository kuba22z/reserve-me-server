import { ObjectType } from '@nestjs/graphql'
import { CognitoTokenResponseDto } from './cognito/cognito-token-response.dto'
import { type CognitoGroupDto } from './cognito-groups.dto'

@ObjectType({ description: 'TokenDto' })
export class TokenDto {
  public accessToken: string
  public refreshToken?: string
  public expiresIn: number
  public tokenType: string
  public idToken: string
  public groups: CognitoGroupDto[]
  constructor(data: CognitoTokenResponseDto) {
    Object.assign(this, data)
  }
}
