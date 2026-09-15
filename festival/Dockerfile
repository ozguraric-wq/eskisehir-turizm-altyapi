FROM node:24-bookworm-slim
WORKDIR /app
COPY server ./server
COPY lib/festival/domain.ts lib/festival/actions.ts ./lib/festival/
RUN mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 8787
CMD ["node", "server/server.mjs"]
