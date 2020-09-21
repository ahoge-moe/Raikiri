#!/bin/bash

BLACK="\033[0;30m"
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
DEFAULT="\033[0;37m"
DARK_GRAY="\033[1;30m"
FG_RED="\033[1;31m"
FG_GREEN="\033[1;32m"
FG_YELLOW="\033[1;33m"
FG_BLUE="\033[1;34m"
FG_MAGENTA="\033[1;35m"
FG_CYAN="\033[1;36m"
FG_WHITE="\033[1;37m"

_success () {
  echo -e "${FG_GREEN}✔ ${FG_WHITE}${1}${DEFAULT}"
}

_info () {
  echo -e "${FG_CYAN}i ${FG_WHITE}${1}${DEFAULT}"
}

# Config files
branch_name=$(cat .git/HEAD | cut -d "/" -f 3)
if [ "${branch_name}" == "master" ]; then

  if [ -f conf/user_config.toml ]; then
    _success "Found user_config.toml"
  else
    _info "Creating user_config.toml ..."
    cp conf/template_config.toml conf/user_config.toml
    _success "Created user_config.toml"
    _info "Please make the necessary changes in conf/user_config.toml"
  fi

else

  if [ -f conf/dev_config.toml ]; then
    _success "Found dev_config.toml"
  else
    _info "Creating dev_config.toml ..."
    cp conf/template_config.toml conf/dev_config.toml
    _success "Created dev_config.toml"
    _info "Please make the necessary changes in conf/dev_config.toml"
  fi

fi