require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { dbConnect } = require('../lib/db/connect');

// Importar o modelo de gênero
const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do gênero'],
    unique: true,
    trim: true,
    maxlength: [50, 'O nome não pode ter mais de 50 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe uma descrição para o gênero'],
    maxlength: [500, 'A descrição não pode ter mais de 500 caracteres']
  },
  icon: {
    type: String,
    required: [true, 'Por favor, selecione um ícone para o gênero'],
    default: 'FaBook'
  },
  color: {
    type: String,
    required: [true, 'Por favor, selecione uma cor para o gênero'],
    default: 'from-blue-500 to-blue-700'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Genre = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);

// Dados iniciais dos gêneros
const initialGenres = [
  { 
    name: 'FICÇÃO ESTRANGEIRA', 
    description: 'Obras de ficção de autores internacionais, incluindo romances, contos e novelas.',
    icon: 'FaBook',
    color: 'from-blue-500 to-blue-700'
  },
  { 
    name: 'LITERATURA TÉCNICA', 
    description: 'Livros técnicos, manuais, guias e obras de referência para diversas áreas do conhecimento.',
    icon: 'FaBookOpen',
    color: 'from-green-500 to-green-700'
  },
  { 
    name: 'HISTÓRIA DA LITERATURA', 
    description: 'Obras sobre a evolução da literatura, movimentos literários e análises históricas.',
    icon: 'FaHistory',
    color: 'from-purple-500 to-purple-700'
  },
  { 
    name: 'FICÇÃO BRASILEIRA', 
    description: 'Romances, contos e novelas de autores brasileiros, abrangendo diversos períodos e estilos.',
    icon: 'FaFeather',
    color: 'from-yellow-500 to-yellow-700'
  },
  { 
    name: 'POESIA', 
    description: 'Coletâneas de poemas, antologias e obras poéticas de diversos autores e épocas.',
    icon: 'FaFeather',
    color: 'from-pink-500 to-pink-700'
  },
  { 
    name: 'BIOGRAFIA', 
    description: 'Histórias de vida, autobiografias e relatos biográficos de personalidades diversas.',
    icon: 'FaUserAlt',
    color: 'from-red-500 to-red-700'
  },
  { 
    name: 'INFANTIL', 
    description: 'Livros voltados para o público infantil, incluindo contos, fábulas e histórias educativas.',
    icon: 'FaChild',
    color: 'from-indigo-500 to-indigo-700'
  },
  { 
    name: 'AUTOAJUDA', 
    description: 'Obras motivacionais, de desenvolvimento pessoal e crescimento individual.',
    icon: 'FaHeart',
    color: 'from-orange-500 to-orange-700'
  },
  { 
    name: 'HISTÓRIA', 
    description: 'Livros sobre eventos históricos, civilizações, períodos e personalidades que marcaram a história.',
    icon: 'FaGlobe',
    color: 'from-teal-500 to-teal-700'
  },
  { 
    name: 'CIÊNCIAS', 
    description: 'Obras sobre diversas áreas científicas, desde física e química até biologia e astronomia.',
    icon: 'FaFlask',
    color: 'from-cyan-500 to-cyan-700'
  },
];

async function seedGenres() {
  try {
    // Conectar ao banco de dados
    await dbConnect();
    console.log('Conectado ao MongoDB');

    // Limpar coleção existente
    await Genre.deleteMany({});
    console.log('Coleção de gêneros limpa');

    // Criar gêneros com slugs
    const genresWithSlugs = initialGenres.map(genre => ({
      ...genre,
      slug: genre.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
    }));

    // Inserir gêneros
    await Genre.insertMany(genresWithSlugs);
    console.log(`${initialGenres.length} gêneros inseridos com sucesso!`);

    // Listar gêneros inseridos
    const insertedGenres = await Genre.find({}).sort({ name: 1 });
    console.log('\nGêneros inseridos:');
    insertedGenres.forEach(genre => {
      console.log(`- ${genre.name} (${genre.slug})`);
    });

  } catch (error) {
    console.error('Erro ao popular gêneros:', error);
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

// Executar o script
seedGenres();