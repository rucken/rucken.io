export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./docker/prod/docker-compose-build.yml build