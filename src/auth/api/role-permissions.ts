import { CognitoGroupDto } from './dto/cognito-groups.dto'

export namespace RolePermission {
  export const getPermissions = (
    userGroups: readonly CognitoGroupDto[],
    domain: keyof AccessLevelByDomain
  ) => {
    return mergeObjectsByBoolean(
      userGroups.map((group) => rolePermissions[group][domain])
    )
  }

  const mergeObjectsByBoolean = <
    T extends ContainingTypes<AccessLevelByDomain>,
  >(
    array: T[]
  ): T => {
    // Initialize merged as an empty object with the type of T
    const merged = Object.create(null) as T

    for (const current of array) {
      Object.entries(current).forEach(([key, value]) => {
        // Use type assertion to ensure TypeScript understands the assignment
        ;(merged[key as keyof T] as boolean) = merged[key as keyof T] || value
      })
    }

    return merged
  }
}

interface MeetingPermissons {
  createOther: boolean
  updateOther: boolean
  deleteOther: boolean
}

interface AccessLevelByDomain {
  meeting: MeetingPermissons
}

type AccessLevelByRole = {
  [a in CognitoGroupDto]: AccessLevelByDomain
}

type ContainingTypes<T> = T[keyof T]

const rolePermissions: AccessLevelByRole = {
  [CognitoGroupDto.admin]: {
    meeting: {
      createOther: true,
      updateOther: true,
      deleteOther: true,
    },
  },
  [CognitoGroupDto.employee]: {
    meeting: {
      createOther: true,
      updateOther: true,
      deleteOther: true,
    },
  },
  [CognitoGroupDto.client]: {
    meeting: {
      createOther: false,
      updateOther: false,
      deleteOther: false,
    },
  },
}
