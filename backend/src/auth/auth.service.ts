import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Verifique se o caminho está correto
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dados: LoginDto) {
    // 1. Busca o usuário
    const usuario = await this.prisma.user.findUnique({
      where: { email: dados.email },
    });

    // 2. Compara a senha (por enquanto texto puro, depois usaremos bcrypt)
    if (!usuario || usuario.senha !== dados.senha) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Cria o conteúdo do Token
    const payload = { sub: usuario.id, email: usuario.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    };
  }
}