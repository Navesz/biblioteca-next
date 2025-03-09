const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Determinar a URI do MongoDB com base no ambiente
function getMongoDBURI() {
  // Verificar se estamos em um ambiente Docker
  const isDocker = process.env.DOCKER_ENV === 'true';
  
  // Se estamos em um ambiente Docker, usar o nome do serviço como host
  if (isDocker) {
    return process.env.MONGODB_URI || 'mongodb://mongodb:27017/biblioteca-iepmm';
  }
  
  // Em ambiente de desenvolvimento local
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca-iepmm';
}

const MONGODB_URI = getMongoDBURI();

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, defina a variável de ambiente MONGODB_URI dentro do arquivo .env.local'
  );
}

/**
 * Variável global para manter a conexão com o MongoDB entre hot-reloads em desenvolvimento
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { dbConnect };