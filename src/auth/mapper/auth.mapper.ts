import { Injectable } from '@nestjs/common'
import { type CognitoTokenResponseDto } from '../api/dto/cognito/cognito-token-response.dto'
import { type TokenDto } from '../api/dto/token.dto'

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
}
