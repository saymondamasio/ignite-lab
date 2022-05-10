import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { expressjwt as jwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'node:util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const req = context.switchToHttp().getRequest();
    // const res = context.switchToHttp().getResponse();

    const { req, res } = GqlExecutionContext.create(context).getContext();

    console.log(`${this.AUTH0_DOMAIN}/.well-known/jwks.json`);

    const checkJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}/.well-known/jwks.json`,
        }),
        audience: this.AUTH0_AUDIENCE,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(req, res);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
