import { InputType } from '@nestjs/graphql'
import { type GrantTypeDto } from './grant-type.dto'

@InputType({ description: 'TokenRequestDto' })
export class TokenRequestDto {
  grantType: GrantTypeDto
  refreshToken?: string
  authorizationCode?: string
  constructor(data: TokenRequestDto) {
    Object.assign(this, data)
  }
}
