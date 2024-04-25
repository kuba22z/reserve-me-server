import { Injectable } from '@nestjs/common'
import { type CognitoTokenResponseDto } from '../api/dto/cognito/cognito-token-response.dto'
import { type TokenDto } from '../api/dto/token.dto'
import { type AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider'
import * as assert from 'assert'

@Injectable()
export class AuthMapper {
  public toDto(cognitoTokenResponseDto: CognitoTokenResponseDto): TokenDto {
    return {
      idToken: cognitoTokenResponseDto.id_token,
      tokenType: cognitoTokenResponseDto.token_type,
      accessToken: cognitoTokenResponseDto.access_token,
      expiresIn: cognitoTokenResponseDto.expires_in,
      refreshToken: cognitoTokenResponseDto.refresh_token,
    }
  }

  public authenticationResultToDto(
    authenticationResultType: AuthenticationResultType
  ): TokenDto {
    assert(authenticationResultType.IdToken)
    assert(authenticationResultType.TokenType)
    assert(authenticationResultType.AccessToken)
    assert(authenticationResultType.RefreshToken)
    assert(authenticationResultType.ExpiresIn)
    return {
      idToken: authenticationResultType.IdToken,
      tokenType: authenticationResultType.TokenType,
      accessToken: authenticationResultType.AccessToken,
      expiresIn: authenticationResultType.ExpiresIn,
      refreshToken: authenticationResultType.RefreshToken,
    }
  }
}
