import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, UserCreateData } from '../../../domain/entities/User';
import { UserModel } from '../models/UserModel';
import { InternalServerError } from '../../../domain/errors/DomainErrors';

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email }).select('+password').lean();
      if (!user) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw new InternalServerError('Error al buscar usuario');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).lean();
      if (!user) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw new InternalServerError('Error al buscar usuario');
    }
  }

  async create(userData: UserCreateData): Promise<User> {
    try {
      const newUser = await UserModel.create(userData);
      const user = await UserModel.findById(newUser._id).select('+password').lean();

      if (!user) {
        throw new InternalServerError('Error al crear usuario');
      }

      return {
        id: user._id.toString(),
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(id, userData, {
        new: true,
      }).lean();

      if (!updatedUser) return null;

      return {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        password: updatedUser.password,
        name: updatedUser.name,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new InternalServerError('Error al actualizar usuario');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new InternalServerError('Error al eliminar usuario');
    }
  }
}
