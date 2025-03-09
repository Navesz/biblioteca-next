const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

// Verificar se o MongoDB está instalado
async function checkMongoDBInstalled() {
  try {
    const { stdout } = await execAsync('mongod --version');
    console.log('✅ MongoDB está instalado:', stdout.split('\n')[0]);
    return true;
  } catch (error) {
    console.error('❌ MongoDB não está instalado ou não está no PATH');
    console.log('\nPor favor, instale o MongoDB Community Edition:');
    console.log('https://www.mongodb.com/try/download/community');
    return false;
  }
}

// Verificar se o MongoDB está em execução
async function isMongoDBRunning() {
  try {
    // Verificar processos em execução
    const command = os.platform() === 'win32' 
      ? 'netstat -ano | findstr "LISTENING" | findstr "27017"'
      : 'lsof -i:27017';
    
    const { stdout } = await execAsync(command);
    if (stdout) {
      console.log('✅ MongoDB já está em execução na porta 27017');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Iniciar o MongoDB
async function startMongoDB() {
  // Verificar se o MongoDB está instalado
  const isInstalled = await checkMongoDBInstalled();
  if (!isInstalled) {
    return false;
  }
  
  // Verificar se o MongoDB já está em execução
  const isRunning = await isMongoDBRunning();
  if (isRunning) {
    return true;
  }
  
  console.log('Iniciando MongoDB...');
  
  try {
    // No Windows, tentar iniciar o serviço MongoDB
    if (os.platform() === 'win32') {
      try {
        await execAsync('net start MongoDB');
        console.log('✅ Serviço MongoDB iniciado com sucesso');
        return true;
      } catch (serviceError) {
        console.log('Não foi possível iniciar o serviço MongoDB. Tentando iniciar manualmente...');
        
        // Criar diretórios para dados e logs
        const dataDir = path.join(process.cwd(), 'data/db');
        const logDir = path.join(process.cwd(), 'data/logs');
        
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        // Iniciar o MongoDB manualmente
        const mongod = exec(`mongod --dbpath="${dataDir}" --logpath="${path.join(logDir, 'mongodb.log')}" --logappend`);
        
        mongod.stdout.on('data', (data) => {
          console.log(`MongoDB: ${data}`);
        });
        
        mongod.stderr.on('data', (data) => {
          console.error(`MongoDB Error: ${data}`);
        });
        
        // Aguardar um pouco para o MongoDB iniciar
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se o MongoDB iniciou
        const started = await isMongoDBRunning();
        if (started) {
          console.log('✅ MongoDB iniciado manualmente com sucesso');
          return true;
        } else {
          console.error('❌ Falha ao iniciar o MongoDB manualmente');
          return false;
        }
      }
    } else {
      // Em sistemas Unix, iniciar o MongoDB manualmente
      console.log('Iniciando MongoDB em sistema Unix...');
      // Código para iniciar o MongoDB em sistemas Unix...
    }
  } catch (error) {
    console.error('❌ Erro ao iniciar o MongoDB:', error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('Verificando e iniciando MongoDB local...');
  
  const success = await startMongoDB();
  
  if (success) {
    console.log('\nMongoDB está pronto para uso!');
    console.log('Conecte-se usando: mongodb://localhost:27017');
    console.log('\nAgora você pode executar:');
    console.log('npm run dev - Para iniciar a aplicação');
    console.log('npm run seed:genres - Para popular os gêneros');
  } else {
    console.error('\nFalha ao iniciar o MongoDB');
    process.exit(1);
  }
}

// Executar o script
main();