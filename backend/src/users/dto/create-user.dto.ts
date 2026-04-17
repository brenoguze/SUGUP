import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  nome: string;

  @IsEmail({}, { message: 'Por favor, envie um email válido.' })
  email: string;

  @IsString()
  celular: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string;
}