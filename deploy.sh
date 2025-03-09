#!/bin/bash

# Script de deploy para a VPS Ubuntu
# Este script atualiza o código do GitHub e reinicia os contêineres Docker

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando deploy da Biblioteca Next...${NC}"

# Verificar se o diretório do projeto existe
if [ ! -d "biblioteca-next" ]; then
  echo -e "${YELLOW}Diretório do projeto não encontrado. Clonando do GitHub...${NC}"
  git clone https://github.com/Navesz/biblioteca-next.git
  cd biblioteca-next
else
  cd biblioteca-next
  echo -e "${YELLOW}Atualizando código do GitHub...${NC}"
  git pull
fi

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Docker não está instalado. Instalando...${NC}"
  sudo apt-get update
  sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo apt-get update
  sudo apt-get install -y docker-ce
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Docker Compose não está instalado. Instalando...${NC}"
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# Parar contêineres existentes
echo -e "${YELLOW}Parando contêineres existentes...${NC}"
sudo docker-compose down

# Construir e iniciar os contêineres
echo -e "${YELLOW}Construindo e iniciando contêineres...${NC}"
sudo docker-compose up -d --build

# Verificar status dos contêineres
echo -e "${YELLOW}Verificando status dos contêineres...${NC}"
sudo docker-compose ps

# Executar seed de dados (opcional)
read -p "Deseja executar o seed de dados? (s/n): " run_seed
if [ "$run_seed" = "s" ]; then
  echo -e "${YELLOW}Executando seed de dados...${NC}"
  sudo docker-compose exec app npm run seed
  sudo docker-compose exec app npm run seed:genres
fi

echo -e "${GREEN}Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}A aplicação está disponível em: http://seu-ip:3000${NC}"