# Node Demo

The purpose of the code is to allow you to test out the reverse proxy feature for Nginx

# Installing Node JS

Download and install NVM

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Update your profile configuration

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Reload your shell (or disconnect and reconnect)

```
source ~/.bashrc
```

Check if NVM is installed

```
nvm -v
```

Install latest version of NVM by running the command

```
nvm install 20.9.0
```

At the time of writing `20.9.0` is the latest LTS version of node.
