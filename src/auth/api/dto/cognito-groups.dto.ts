import { registerEnumType } from '@nestjs/graphql'

export enum CognitoGroupDto {
  admin = 'admin',
  client = 'client',
  employee = 'employee',
}

registerEnumType(CognitoGroupDto, {
  name: 'CognitoGroupDto',
})
