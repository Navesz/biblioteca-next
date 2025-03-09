# Biblioteca Next

Sistema de gerenciamento de biblioteca desenvolvido com Next.js, MongoDB e Docker.

## ⚠️ Instalação do Docker no Windows

Se você estiver vendo erros como `'docker-compose' is not recognized` ou `docker: command not found`, siga estas etapas:

1. **Instale o Docker Desktop para Windows**:
   - Baixe o instalador em: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
   - Execute o instalador e siga as instruções
   - **Importante**: Reinicie o computador após a instalação

2. **Verifique a instalação**:
   - Abra um novo terminal (PowerShell ou CMD)
   - Execute `docker --version` e `docker-compose --version`
   - Se ainda não funcionar, verifique se o Docker Desktop está em execução

3. **Solução de problemas comuns**:
   - Certifique-se de que o Docker Desktop está em execução (verifique o ícone na bandeja do sistema)
   - Se estiver usando Git Bash, tente usar PowerShell ou CMD
   - Verifique se o WSL2 está instalado e configurado corretamente (necessário para Docker no Windows)

4. **Instalação do WSL2 (se necessário)**:
   ```powershell
   # No PowerShell como administrador
   wsl --install
   ```
   - Reinicie o computador após a instalação

## 🔄 Alternativa sem Docker (MongoDB Local)

Se você continuar tendo problemas com o Docker, pode instalar o MongoDB diretamente:

1. **Instale o MongoDB Community Edition**:
   - Baixe o instalador em: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Selecione a versão mais recente, Windows, e MSI Package
   - Execute o instalador e siga as instruções
   - **Importante**: Marque a opção "Install MongoDB as a Service" durante a instalação

2. **Verifique a instalação**:
   - Abra um novo terminal (PowerShell ou CMD)
   - Execute `mongod --version`

3. **Inicie o MongoDB usando nosso script**:
   ```bash
   npm run mongodb:local
   ```
   Este script irá:
   - Verificar se o MongoDB está instalado
   - Iniciar o serviço MongoDB se estiver instalado como serviço
   - Ou iniciar o MongoDB manualmente se necessário

4. **Configure o projeto para usar o MongoDB local**:
   - Certifique-se de que o arquivo `.env.local` contém:
     ```
     MONGODB_URI=mongodb://localhost:27017/biblioteca-iepmm
     ```

5. **Inicie a aplicação**:
   ```bash
   npm run dev
   ```

6. **Popule o banco de dados**:
   ```bash
   npm run seed:genres
   ```

## 🚀 Guia Rápido

### Desenvolvimento Local (Windows)
```bash
# Opção 1: Com Docker
npm run docker:dev
npm run dev

# Opção 2: Sem Docker (MongoDB local)
npm run mongodb:local
npm run dev
```

### Implantação na VPS (Ubuntu)
```bash
# Na VPS, após clonar o repositório
cd biblioteca-next
chmod +x deploy.sh
./deploy.sh
```

### Atualização na VPS após alterações no GitHub
```bash
# Na VPS
cd biblioteca-next
./update-from-github.sh
```

## 📋 Comandos Importantes

| Comando | Descrição |
|---------|-----------|
| `npm run docker:dev` | Inicia o MongoDB em Docker para desenvolvimento |
| `npm run docker:dev:down` | Para o MongoDB em Docker |
| `npm run mongodb:local` | Inicia o MongoDB local (sem Docker) |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run docker:prod` | Inicia a aplicação e MongoDB em Docker para produção |
| `npm run seed:genres` | Popula os gêneros no banco de dados |
| `npm run github:setup` | Configura o repositório no GitHub |

## 🔧 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `docker-compose.dev.yml` | Configuração Docker para desenvolvimento |
| `docker-compose.yml` | Configuração Docker para produção |
| `deploy.sh` | Script para implantar na VPS |
| `update-from-github.sh` | Script para atualizar a VPS a partir do GitHub |
| `VPS_SETUP.md` | Guia detalhado para configurar a VPS |
| `scripts/start-mongodb-local.js` | Script para iniciar o MongoDB local |

## 📊 Fluxo de Trabalho

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Desenvolvimento │     │     GitHub      │     │       VPS       │
│    (Windows)     │     │                 │     │    (Ubuntu)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│ npm run docker:dev│              │                       │
└────────┬────────┘              │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│   npm run dev   │              │                       │
└────────┬────────┘              │                       │
         │                       │                       │
         ▼                       │                       │
┌─────────────────┐              │                       │
│ Fazer alterações │              │                       │
└────────┬────────┘              │                       │
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────┐     ┌─────────────────┐              │
│   git commit    │────▶│    git push     │              │
└─────────────────┘     └────────┬────────┘              │
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  Repositório    │────▶│./update-from-github.sh│
                        │   Atualizado    │     └────────┬────────┘
                        └─────────────────┘              │
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ docker-compose  │
                                                │   up --build    │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   Aplicação     │
                                                │   Atualizada    │
                                                └─────────────────┘
```

## 🔄 Ciclo de Desenvolvimento e Implantação

1. **Desenvolvimento Local**:
   - Inicie o MongoDB com Docker: `npm run docker:dev`
   - Inicie a aplicação: `npm run dev`
   - Faça alterações no código

2. **Envio para o GitHub**:
   - Commit das alterações: `git add . && git commit -m "Descrição"`
   - Push para o GitHub: `git push`

3. **Implantação na VPS**:
   - Conecte-se à VPS: `ssh usuario@seu-ip`
   - Atualize a aplicação: `cd biblioteca-next && ./update-from-github.sh`

## 🔄 Solução de Problemas Comuns

### 1. Docker não está instalado ou não é reconhecido

```bash
# Erro: 'docker-compose' is not recognized ou docker: command not found
# Solução: Instale o Docker Desktop e use o MongoDB local enquanto isso
npm run mongodb:local
npm run dev
```

### 2. MongoDB não conecta no Windows

```bash
# Verifique se o Docker está em execução
docker ps

# Se o Docker não estiver funcionando, use o MongoDB local
npm run mongodb:local

# Reinicie o contêiner MongoDB (se estiver usando Docker)
npm run docker:dev:down
npm run docker:dev

# Verifique os logs do MongoDB
docker logs biblioteca-mongodb-dev
```

### 3. Erro ao executar scripts de seed

```bash
# Certifique-se de que o MongoDB está em execução
# Opção 1: Com Docker
npm run docker:dev

# Opção 2: Sem Docker
npm run mongodb:local

# Execute o seed de gêneros
npm run seed:genres
```

### 4. Erro "Cannot use import statement outside a module"

Este erro ocorre quando há uma incompatibilidade entre ES Modules e CommonJS. Verifique se todos os arquivos estão usando a mesma sintaxe de importação.

### 5. Erro de conexão com o MongoDB na VPS

Verifique se a string de conexão no arquivo `.env.local` está correta:
```
# Para Docker na VPS
MONGODB_URI=mongodb://mongodb:27017/biblioteca-iepmm

# Para MongoDB local
MONGODB_URI=mongodb://localhost:27017/biblioteca-iepmm
```

## 🔰 Configuração do Zero

### Windows (Desenvolvimento)

1. **Instale as dependências**:
   - Instale o [Node.js](https://nodejs.org/)
   - Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Instale o [Git](https://git-scm.com/)

2. **Clone o repositório**:
   ```bash
   git clone https://github.com/Navesz/biblioteca-next.git
   cd biblioteca-next
   ```

3. **Instale as dependências do projeto**:
   ```bash
   npm install
   ```

4. **Configure o ambiente**:
   ```bash
   # Crie o arquivo .env.local
   echo MONGODB_URI=mongodb://localhost:27017/biblioteca-iepmm > .env.local
   echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
   echo NEXTAUTH_SECRET=sua_chave_secreta_aqui >> .env.local
   ```

5. **Inicie o MongoDB e a aplicação**:
   ```bash
   npm run docker:dev
   npm run dev
   ```

6. **Configure o GitHub**:
   ```bash
   npm run github:setup
   ```

### VPS Ubuntu (Produção)

1. **Conecte-se à VPS**:
   ```bash
   ssh usuario@seu-ip
   ```

2. **Atualize o sistema e instale dependências**:
   ```bash
   sudo apt-get update
   sudo apt-get upgrade -y
   sudo apt-get install -y git
   ```

3. **Instale o Docker e Docker Compose**:
   ```bash
   # Instale o Docker
   sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
   sudo apt-get update
   sudo apt-get install -y docker-ce

   # Configure o Docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER

   # Instale o Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone o repositório e configure**:
   ```bash
   git clone https://github.com/Navesz/biblioteca-next.git
   cd biblioteca-next
   chmod +x deploy.sh update-from-github.sh
   ```

5. **Execute o deploy**:
   ```bash
   ./deploy.sh
   ```

## Requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) (recomendado)
- [Git](https://git-scm.com/)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.