import { ObjectType, OmitType } from '@nestjs/graphql'
import { UserWithGroupDto } from './user-with-group.dto'

@ObjectType({ description: 'UserDtoWithoutGroupsDto' })
export class UserDto extends OmitType(UserWithGroupDto, ['groups'] as const) {}
