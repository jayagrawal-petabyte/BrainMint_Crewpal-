import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject('PG_CONNECTION') private readonly pool: Pool,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: any) {
    const result = await this.pool.query(
      'SELECT id, email, role_id, organization_id, is_active FROM users WHERE id = $1',
      [payload.sub],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException();
    }

    const user = result.rows[0];

    if (!user.is_active) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      organization_id: user.organization_id,
    };
  }
}
