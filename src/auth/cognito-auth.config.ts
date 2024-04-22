import { InternalServerErrorException } from '@nestjs/common'

export class CognitoAuthConfig {
  static parseTokenUse = (tokenUse: string): 'id' | 'access' | null => {
    switch (tokenUse) {
      case 'id':
        return 'id'
      case 'access':
        return 'access'
      case null:
        return null
      default: {
        throw new InternalServerErrorException(
          [{ value: tokenUse }],
          'Environment variable COGNITO_TOKEN_USE has a forbidden value'
        )
      }
    }
  }

  public static readonly userPoolId: string = process.env.COGNITO_USER_POOL_ID!
  public static readonly clientId: string = process.env.COGNITO_CLIENT_ID!
  public static readonly clientSecret: string =
    process.env.COGNITO_CLIENT_SECRET!

  public static readonly tokenUse: 'id' | 'access' | null = this.parseTokenUse(
    process.env.COGNITO_TOKEN_USE!
  )

  public static readonly domain: string = process.env.COGNITO_DOMAIN!
  public static readonly profile: string = process.env.COGNITO_PROFILE!
}
