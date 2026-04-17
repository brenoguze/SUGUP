import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async criarUsuario(dados: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        celular: dados.celular,
        senha: dados.senha
      }
    });
  }

  async buscarUsuario(email: string) {
    return await this.prisma.user.findUnique({
      where: {email}
    });
  }

  async todosUsuarios() {
    return await this.prisma.user.findMany();
  }

  async atualizarUsuario(email: string, data: {
    nome?: string;
    celular?: string;
    senha?: string;
  }){
    
    const user = await this.prisma.user.findUnique({
      where: {email}
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.")
    }
    return this.prisma.user.update({
      where: {email}, data
    })
  }

  async deletarUsuario(email: string){
    const user = await this.prisma.user.findUnique({
      where: {email}
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.")
    }
    return await this.prisma.user.delete({
      where: {email}
    })
  }
}