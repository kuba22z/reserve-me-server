import { registerEnumType } from '@nestjs/graphql'

export enum CognitoGroup {
  admin = 'admin',
  client = 'client',
  employee = 'employee',
}

registerEnumType(CognitoGroup, {
  name: 'CognitoGroups',
})
