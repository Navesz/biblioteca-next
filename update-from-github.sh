#!/bin/bash

# Script para atualizar o código na VPS a partir do GitHub
# Este script deve ser executado na VPS

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Atualizando Biblioteca Next a partir do GitHub...${NC}"

# Verificar se o diretório do projeto existe
if [ ! -d "biblioteca-next" ]; then
  echo -e "${RED}Diretório do projeto não encontrado.${NC}"
  echo -e "Execute este script no diretório pai do projeto."
  exit 1
fi

# Entrar no diretório do projeto
cd biblioteca-next

# Verificar se há alterações locais
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}Existem alterações locais não commitadas.${NC}"
  read -p "Deseja descartar essas alterações? (s/n): " discard_changes
  
  if [ "$discard_changes" = "s" ]; then
    echo -e "${YELLOW}Descartando alterações locais...${NC}"
    git reset --hard
    git clean -fd
  else
    echo -e "${YELLOW}Salvando alterações locais...${NC}"
    git stash
  fi
fi

# Atualizar o código do GitHub
echo -e "${YELLOW}Atualizando código do GitHub...${NC}"
git pull

# Verificar se o Docker está em execução
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker não está em execução.${NC}"
  echo -e "Iniciando Docker..."
  sudo systemctl start docker
fi

# Reconstruir e reiniciar os contêineres
echo -e "${YELLOW}Reconstruindo e reiniciando contêineres...${NC}"
docker-compose down
docker-compose up -d --build

# Verificar status dos contêineres
echo -e "${YELLOW}Verificando status dos contêineres...${NC}"
docker-compose ps

# Executar seed de dados (opcional)
read -p "Deseja executar o seed de dados? (s/n): " run_seed
if [ "$run_seed" = "s" ]; then
  echo -e "${YELLOW}Executando seed de dados...${NC}"
  docker-compose exec app npm run seed
  docker-compose exec app npm run seed:genres
fi

echo -e "${GREEN}Atualização concluída com sucesso!${NC}"
echo -e "${GREEN}A aplicação está disponível em: http://$(hostname -I | awk '{print $1}'):3000${NC}"