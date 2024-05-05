import { registerEnumType } from '@nestjs/graphql'

export enum GrantTypeDto {
  authorization_code = 'authorization_code',
  refresh_token = 'refresh_token',
}

registerEnumType(GrantTypeDto, {
  name: 'GrantTypeDto',
})
