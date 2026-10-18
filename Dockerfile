# ==============================================================================
# Enterprise Production Dockerfile for Kajian Ihsan Financial Platform
# Multi-runtime: Node.js 20 LTS + Python 3.11/3.12 (openpyxl + pypdf)
# ==============================================================================

FROM node:20-bookworm-slim

# Prevent interactive prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production
ENV PORT=3005
ENV CLUSTER_MODE=false

WORKDIR /app

# Install Python 3, pip, and virtualenv tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment for python document parsing dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip install --no-cache-dir openpyxl pypdf

# Copy application source code
COPY . /app

# Ensure proper non-root user permissions
RUN chown -R node:node /app /opt/venv

# Switch to non-privileged user for enhanced security
USER node

# Healthcheck targeting Kubernetes/Docker swarm liveness endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3005/api/healthz').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

EXPOSE 3005

# Start platform server
CMD ["node", "server.js"]
