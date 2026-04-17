import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') 
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  @Post() 
  async criar(@Body() data: CreateUserDto) {
    return await this.usersService.criarUsuario(data);
  }

  @Get(':email')
  async buscar(@Param('email') email: string) {
    return await this.usersService.buscarUsuario(email);
  }
  
  @Get()
  async buscarTodos() {
    return await this.usersService.todosUsuarios();
  }

  @Patch(':email')
  async atualizar(
    @Param('email') email: string,
    @Body() data: {
    nome?: string;
    celular?: string;
    senha?: string;
    }
  ) {
    return await this.usersService.atualizarUsuario(email, data);
  }

  @Delete(':email')
  async deleta(@Param('email') email: string) {
    return await this.usersService.deletarUsuario(email);
  }
}