const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const { dbConnect } = require('./lib/db/connect');
require('dotenv').config({ path: '.env.local' });

const execAsync = promisify(exec);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Verificar se estamos em um ambiente Docker
async function isRunningInDocker() {
  try {
    const { stdout } = await execAsync('cat /proc/1/cgroup');
    return stdout.includes('docker');
  } catch (error) {
    return false;
  }
}

// Função para iniciar o MongoDB
async function startMongoDB() {
  try {
    // Verificar se estamos em um ambiente Docker
    const inDocker = await isRunningInDocker();
    
    if (inDocker) {
      console.log('✅ Executando em ambiente Docker, MongoDB deve estar disponível como serviço');
      return true;
    }
    
    // Verificar se o Docker está instalado
    try {
      await execAsync('docker --version');
      console.log('✅ Docker está instalado, tentando iniciar MongoDB via Docker...');
      
      // Verificar se o contêiner MongoDB está em execução
      const { stdout: dockerPs } = await execAsync('docker ps --filter "name=biblioteca-mongodb" --format "{{.Names}}"');
      
      if (dockerPs.includes('biblioteca-mongodb')) {
        console.log('✅ Container MongoDB já está em execução');
        return true;
      }
      
      // Verificar se o contêiner MongoDB existe
      const { stdout: dockerPsA } = await execAsync('docker ps -a --filter "name=biblioteca-mongodb" --format "{{.Names}}"');
      
      if (dockerPsA.includes('biblioteca-mongodb')) {
        console.log('Iniciando container MongoDB existente...');
        await execAsync('docker start biblioteca-mongodb');
      } else {
        console.log('Iniciando MongoDB via docker-compose...');
        await execAsync('docker-compose -f docker-compose.dev.yml up -d mongodb');
      }
      
      console.log('✅ MongoDB iniciado com sucesso via Docker');
      return true;
    } catch (dockerError) {
      console.log('❌ Docker não está instalado ou não está acessível');
      console.log('Tentando iniciar MongoDB localmente...');
      
      // Tentar iniciar o MongoDB localmente
      try {
        await execAsync('node ' + path.join(__dirname, 'scripts', 'start-mongodb-local.js'));
        return true;
      } catch (localError) {
        console.error('❌ Não foi possível iniciar o MongoDB localmente:', localError.message);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Erro ao iniciar o MongoDB:', error.message);
    return false;
  }
}

// Iniciar MongoDB e depois o servidor Next.js
async function startServer() {
  try {
    // Iniciar MongoDB
    const mongoStarted = await startMongoDB();
    
    if (!mongoStarted) {
      console.error('❌ Não foi possível iniciar o MongoDB. Verifique se o MongoDB está instalado ou se o Docker está em execução.');
      console.log('A aplicação será iniciada, mas as funcionalidades que dependem do banco de dados não funcionarão.');
    }
    
    // Tentar conectar ao banco de dados
    try {
      await dbConnect();
      console.log('✅ Conexão com o banco de dados estabelecida');
    } catch (dbError) {
      console.error('❌ Não foi possível conectar ao banco de dados:', dbError.message);
      console.log('A aplicação será iniciada, mas as funcionalidades que dependem do banco de dados não funcionarão.');
    }
    
    // Iniciar o servidor Next.js
    await app.prepare();
    
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Servidor pronto em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();