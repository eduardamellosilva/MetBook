import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AutorEntity } from './autor.entity';
import { AutorDto } from './autor.dto';

@Injectable()
export class AutorService {
    constructor(
        @InjectRepository(AutorEntity)
        private autorRepository: Repository<AutorEntity>,
    ) {}

    async findAll(): Promise<AutorEntity[]> {
        return this.autorRepository.find();
    }

    async findById(id: string): Promise<AutorEntity> {
        const autor = await this.autorRepository.findOne({ where: { id } });
        if (!autor) {
            throw new NotFoundException(`Autor com o ID '${id}' não encontrado.`);
        }
        return autor;
    }

    async remove(id: string): Promise<{ id: string }> {
        const autor = await this.findById(id);
        await this.autorRepository.remove(autor);
        return { id };
    }

    async create(dto: AutorDto): Promise<AutorEntity> {
        this.validaAutor(dto);
        const novoAutor = this.autorRepository.create(dto);
        return this.autorRepository.save(novoAutor);
    }

    async update(autor: AutorDto): Promise<AutorEntity> {
        await this.findById(autor.id);
        this.validaAutor(autor);
        return this.autorRepository.save(autor);
    }

    async search(query: string): Promise<AutorEntity[]> {
        return this.autorRepository.find({ where: { nome: Like(`%${query}%`) } });
    }

    private validaAutor(autor: AutorEntity | AutorDto) {
        if (!autor.nome || autor.nome.length > 100) {
            throw new BadRequestException('O nome do autor deve ter até 100 caracteres.');
        }
        if (autor.biografia && autor.biografia.length > 1000) {
            throw new BadRequestException('A biografia do autor deve ter até 1000 caracteres.');
        }
        if (!autor.dataNascimento) {
            throw new BadRequestException('A data de nascimento do autor é obrigatória.');
        }
        const dataNascimento = new Date(autor.dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const mes = hoje.getMonth() - dataNascimento.getMonth();
        const dia = hoje.getDate() - dataNascimento.getDate();
        if (mes < 0 || (mes === 0 && dia < 0)) {
            idade--;
        }
        if (idade < 18) {
            throw new BadRequestException('O autor deve ter no mínimo 18 anos.');
        }
    }
}
