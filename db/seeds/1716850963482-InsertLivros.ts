import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertLivrosSeed1716850963482 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "livros" (id, titulo, subtitulo, "numeroPaginas", isbn, editora, "anoLancamento", "logoUrl", preco) VALUES
            (uuid_generate_v4(), 'O Senhor dos Anéis', 'A Sociedade do Anel', 576, '9788578270698', 'Martins Fontes', 2009, 'https://example.com/logo1.jpg', 60),
            (uuid_generate_v4(), 'Harry Potter e a Pedra Filosofal', NULL, 208, '9788532530789', 'Rocco', 2000, 'https://example.com/logo2.jpg', 40),
            (uuid_generate_v4(), 'O Código Da Vinci', NULL, 480, '9788576653721', 'Sextante', 2004, 'https://example.com/logo3.jpg', 50),
            (uuid_generate_v4(), 'A Game of Thrones', NULL, 694, '9780553573404', 'Bantam', 1997, 'https://example.com/logo4.jpg', 55),
            (uuid_generate_v4(), 'The Catcher in the Rye', NULL, 214, '9780316769488', 'Little, Brown and Company', 1951, 'https://example.com/logo5.jpg', 30)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DELETE FROM "livros" WHERE isbn IN (
                '9788578270698',
                '9788532530789',
                '9788576653721',
                '9780553573404',
                '9780316769488'
            )
        `);
    }
}

