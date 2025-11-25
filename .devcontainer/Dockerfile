FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20-bullseye

# Use root to install system/global packages
ARG USERNAME=vscode
USER root

# Ensure Corepack is enabled and activate the project Yarn version (yarn@4.9.2)
RUN corepack enable \
    && corepack prepare yarn@4.9.2 --activate

# Install useful global CLIs: Angular CLI and Supabase CLI
RUN npm install -g @angular/cli@^20.3.1 supabase

# Restore to non-root user
USER ${USERNAME}
