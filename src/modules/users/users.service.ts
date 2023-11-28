import { Point } from '@influxdata/influxdb-client'
import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userRepository: typeof User) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async getUser(id: number) {
    return await this.userRepository.findOne({ where: { id } })
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } })
  }

  // async findUserByEmailWithoutPassword(
  //   email: string,
  // ): Promise<Omit<UserDto, 'password'>> {
  //   return this.influxdbService.findOne('users', {
  //     where: { email },
  //     attributes: { exclude: ['password'] },
  //   })
  // }

  async createUser(dto) {
    dto.password = await this.hashPassword(dto.password)
    const user = await this.userRepository.create(dto)
    return user
  }

  // async updateUser(email: string, dto: UpdateUserDto): Promise<UpdateUserDto> {
  //   await this.userRepository.update(dto, { where: { email } })
  //   return dto
  // }

  // async deleteUser(email: string): Promise<boolean> {
  //   await this.userRepository.destroy({ where: { email } })
  //   return true
  // }
}
