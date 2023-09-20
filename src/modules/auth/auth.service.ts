import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from '../users/interface/user.interface';
import { User } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    try {
      const user = await this.userService.findOneByEmail(username);
      if (!user) {
        return null;
      }

      const match = await this.comparePassword(pass, user.password);
      if (!match) {
        return null;
      }
      const { password, ...result } = user['dataValues'];
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  async login(user) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user) {
    try {
      const pass = await this.hashPassword(user.password);

      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });

      const { password, ...result } = newUser['dataValues'];

      const token = await this.generateToken(result);

      return { user: result, token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.EXPECTATION_FAILED);
    }
  }

  private async generateToken(user): Promise<string> {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
