import { Injectable } from '@nestjs/common'
import { type CognitoTokenResponseDto } from '../api/dto/cognito/cognito-token-response.dto'
import { type TokenDto } from '../api/dto/token.dto'

@Injectable()
export class AuthMapper {
  public toDto(cognitoTokenResponseDto: CognitoTokenResponseDto): TokenDto {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id_token, ...tokenDto } = cognitoTokenResponseDto
    return tokenDto
  }
}
